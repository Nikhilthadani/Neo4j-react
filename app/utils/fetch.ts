// utils/fetchGraph.js
import driver from "./neo4j";
export const fetchRiskData = async () => {
  const QUERY = `MATCH (t:Token)
OPTIONAL MATCH (t)-[:GRANTS]->(p:Permission)
OPTIONAL MATCH (p)-[:APPLIES_TO]->(e:Endpoint)
OPTIONAL MATCH (t)-[:USED_BY]->(u:User)

WITH 
  t,
  COLLECT(DISTINCT p) AS permissions,
  COLLECT(DISTINCT e) AS endpoints,
  COLLECT(DISTINCT u) AS users

WITH 
  t,
  permissions,
  endpoints,
  users,
  CASE 
    WHEN ANY(p IN permissions WHERE p.name = 'Read') AND ANY(p IN permissions WHERE p.name = 'Write') THEN 3
    ELSE 0
  END AS permRisk,
  CASE 
    WHEN SIZE(endpoints) > 3 THEN 2
    ELSE 0
  END AS endpointRisk,
  CASE 
    WHEN SIZE(users) > 1 THEN 3
    ELSE 0
  END AS userRisk

WITH 
  t,
  permissions,
  endpoints,
  users,
  (permRisk + endpointRisk + userRisk) AS riskScore

SET t.riskScore = riskScore

WITH t, permissions, endpoints, users

UNWIND permissions AS p
UNWIND endpoints AS e
UNWIND users AS u

MATCH (t)-[r1:USED_BY]->(u)
MATCH (t)-[r2:GRANTS]->(p)
MATCH (p)-[r3:APPLIES_TO]->(e)

RETURN 
  collect(DISTINCT t) AS tokens,
  collect(DISTINCT u) AS users,
  collect(DISTINCT p) AS permissions,
  collect(DISTINCT e) AS endpoints,
  collect(DISTINCT r1) AS usedRels,
  collect(DISTINCT r2) AS grantRels,
  collect(DISTINCT r3) AS applyRels

`;
  const session = driver.session();
  try {
    const result = await session.run(QUERY);
    // const data = {
    //   nodes: result.records..nodes.map(n => ({
    //     id: n.id,
    //     label: n.label,
    //     ...n.properties,
    //   })),
    //   links: data.links.map(l => ({
    //     source: l.source,
    //     target: l.target,
    //     label: l.type,
    //   })),
    // }

    return result.records[0];
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }
};
export const fetchGraphData = async () => {
  const session = driver.session();
  const result = await session.run(`
    MATCH (n)-[r]->(m)
    RETURN n, r, m
  `);

  const nodes = new Map();
  const links = [];

  result.records.forEach((record) => {
    const n = record.get("n");
    const m = record.get("m");
    const r = record.get("r");

    [n, m].forEach((node) => {
      if (!nodes.has(node.identity.toString())) {
        nodes.set(node.identity.toString(), {
          id: node.identity.toString(),
          label: node.labels[0],
          properties: node.properties,
        });
      }
    });

    links.push({
      source: n.identity.toString(),
      target: m.identity.toString(),
      label: r.type,
    });
  });

  await session.close();
  return {
    nodes: Array.from(nodes.values()),
    links,
  };
};
