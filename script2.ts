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
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "nikhil1234")
);

const Queries = [
  "SELECT * FROM users",
  "SELECT * FROM repositories",
  "SELECT * FROM scans",
  "SELECT * FROM findings",
];

async function insertData() {
  const session = driver.session();
  await client.connect();

  for (const query of Queries) {
    const table = query.split(" ")[3]; // users, repositories, scans, findings
    console.log(`🔄 Processing table: ${table}`);

    const res = await client.query(query);
    const rows = res.rows;

    for (const row of rows) {
      switch (table) {
        case "users":
          await session.run(
            `
            MERGE (u:User {username: $username})
            SET u.email = $email
            `,
            { username: row.username, email: row.email }
          );
          break;

        case "repositories":
          await session.run(
            `
  MATCH (u:User {username: $username})
  MERGE (r:Repository {id: $id})
  SET r.name = $name
  MERGE (u)-[:OWNS]->(r)
  `,
            {
              id: row.id,
              name: row.name ?? "", // Set repo name
              username:
                row.owner ??
                row.owner_username ??
                (row.user || row.username || row.created_by), // fallback chain
            }
          );
          break;

        case "scans":
          await session.run(
            `
            MATCH (r:Repository {id: $repository_id})
            MERGE (s:Scan {id: $id})
            MERGE (r)-[:SCANNED_IN]->(s)
            `,
            { id: row.id, repository_id: row.repository_id }
          );
          break;

        case "findings":
          console.log("raw", row.raw_result);

          await session.run(
            `
  MATCH (s:Scan {id: $scan_id})
  MERGE (f:Finding {id: $id})
  SET f.organization = $organization,
      f.filename = $filename,
      f.project = $project,
      f.owner = $owner
  MERGE (s)-[:HAS_FINDING]->(f)
  MERGE (t:Token {value: $token})
  MERGE (f)-[:LEAKED_TOKEN]->(t)
  `,
            {
              id: row.id,
              scan_id: row.scan_id,
              token: row.token_value ?? row.raw_result ?? "", // ⚠️ Use the actual field name
              organization: row.detector_type ?? "",
              filename: row.file ?? "",
              project: row.repository ?? "",
              owner: row.owner ?? "",
            }
          );
          break;
      }
    }
  }

  await session.close();
  await client.end();
  await driver.close();

  console.log("✅ ETL completed successfully");
}

insertData().catch((err) => {
  console.error("❌ ETL failed:", err);
});
