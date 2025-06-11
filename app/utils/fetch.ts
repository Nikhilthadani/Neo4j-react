// utils/fetchGraph.js
import driver from "./neo4j";

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
