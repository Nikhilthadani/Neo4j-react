import { Pool } from "pg";
import neo4j from "neo4j-driver";

// ✅ Postgres Config
const client = new Pool({
  host: "ep-hidden-smoke-a1fd7yeu-pooler.ap-southeast-1.aws.neon.tech",
  user: "neondb_owner",
  password: "npg_ZU4qn7RQAsfw",
  database: "neondb",
  ssl: true,
});
// ✅ Neo4j Config
const driver = neo4j.driver(
  "neo4j+s://066a28ac.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "Hy--rVZxL4sEsHDHy9JvhgrGbXTGPhYi-6lRcAsfIUs")
);
const CYPHER = `WITH $row AS row

MERGE (u:User {name: row.org_user})
  SET u.role = row.org_role, u.is_default = row.org_default

MERGE (o:Organization {id: row.org_id})
  SET o.title = row.org_title

MERGE (u)-[:BELONGS_TO]->(o)

MERGE (t:Token {value: row.secret})
  SET t.id = row.id,
      t.scan_id = row.scan_id,
      t.title = row.finding_title,
      t.severity = row.severity,
      t.description = row.description,
      t.analyzed_at = row.analyzed_at,
      t.created_at = row.created_at

MERGE (u)-[:OWNS_TOKEN]->(t)
MERGE (t)-[:ISSUED_BY]->(o)

WITH t, row  
UNWIND row.endpoints AS ep
  MERGE (e:Endpoint {url: ep})
  MERGE (t)-[:HAS_ENDPOINT]->(e)

WITH t, row  
UNWIND row.permissions AS perm
  MERGE (p:Permission {type: perm})
  MERGE (t)-[:HAS_PERMISSION]->(p)

`;

function sanitizeRow(row: any): any {
  const allowedTypes = ["string", "boolean", "number"];
  const output: any = {};

  for (const key in row) {
    const value = row[key];

    if (value == null) continue;

    if (Array.isArray(value)) {
      if (value.every((v) => typeof v === "string")) {
        output[key] = value;
      } else {
        console.warn(`Skipping non-string array: ${key}`);
      }
    } else if (allowedTypes.includes(typeof value)) {
      output[key] = value;
    } else if (key.endsWith("_at")) {
      // Attempt to convert date-like strings
      output[key] = new Date(value).toISOString();
    } else {
      console.warn(`⚠️ Skipping unsupported property type for key: ${key}`);
    }
  }

  return output;
}

// export async function insertRows(records: any[]) {
//   const session = driver.session();

//   try {
//     for (const record of records) {
//       const row = sanitizeRow(record); // ensures only allowed types are passed

//       await session.run(
//         `
//         MERGE (t:Token {id: $row.id})
//         SET t.secret = $row.secret,
//             t.finding_title = $row.finding_title,
//             t.severity = $row.severity,
//             t.description = $row.description,
//             t.analyzed_at = datetime($row.analyzed_at),
//             t.created_at = datetime($row.created_at)

//         MERGE (o:Organization {id: $row.org_id})
//         SET o.title = $row.org_title

//         MERGE (u:User {username: $row.org_user})
//         SET u.is_default = $row.org_default,
//             u.role = $row.org_role

//         MERGE (u)-[:BELONGS_TO]->(o)
//         MERGE (t)-[:EXPOSED_BY]->(u)

//         FOREACH (ep IN $row.endpoints |
//           MERGE (e:Endpoint {path: ep})
//           MERGE (t)-[:HAS_ENDPOINT]->(e)
//         )

//         FOREACH (perm IN $row.permissions |
//           MERGE (p:Permission {name: perm})
//           MERGE (t)-[:HAS_PERMISSION]->(p)
//         )
//         `,
//         { row }
//       );
//     }

//     console.log("✅ ETL to Neo4j complete");
//   } catch (error) {
//     console.error("❌ ETL failed", error);
//   } finally {
//     await session.close();
//   }
// }

async function insertData() {
  const session = driver.session();
  const res = await client.query("SELECT * FROM combined_findings");
  for (const r of res.rows) {
    const row = sanitizeRow(r);
    await session.run(
      `MERGE (t:Token {id: $row.id})
SET t.secret = $row.secret,
    t.name = $row.secret, // for visible labels
    t.analyzed_at = datetime($row.analyzed_at),
    t.created_at = datetime($row.created_at),
    t.value = $row.secret

MERGE (f:Finding {id: $row.id})
SET f.title = $row.finding_title,
    f.severity = $row.severity,
    f.description = $row.description,
    f.value = $row.finding_title,
    f.name  = $row.finding_title

MERGE (t)-[:HAS_FINDING]->(f)

MERGE (o:Organization {id: $row.org_id})
SET o.title = $row.org_title

MERGE (u:User {username: $row.org_user})
SET u.is_default = $row.org_default,
    u.role = $row.org_role

MERGE (u)-[:BELONGS_TO]->(o)
MERGE (t)-[:EXPOSED_BY]->(u)

FOREACH (ep IN $row.endpoints |
  MERGE (e:Endpoint {path: ep})
  MERGE (t)-[:HAS_ENDPOINT]->(e)
)

FOREACH (perm IN $row.permissions |
  MERGE (p:Permission {name: perm})
  MERGE (t)-[:HAS_PERMISSION]->(p)
)
`,
      { row }
    );
  }
  await session.close();
  await driver.close();
  await client.end();
}

insertData().catch((err) => {
  console.error(" ETL failed", err);
});
