import { fetchRiskData } from "./utils/fetch";
import TokenRiskDashboard from "./TokenRiskDashboard";

function isNeo4jInteger(value) {
  return value && typeof value.toNumber === "function";
}

function extractId(value) {
  return isNeo4jInteger(value) ? value.toNumber() : value;
}

function normalizeNode(node) {
  return {
    id: node.elementId || extractId(node.identity),
    label: node.labels?.[0] || "Unknown",
    properties: node.properties || {},
  };
}

function normalizeRelationship(rel) {
  return {
    source: rel.startElementId || extractId(rel.start),
    target: rel.endElementId || extractId(rel.end),
    type: rel.type,
    properties: rel.properties || {},
  };
}

/**
 * Converts Neo4j query result into graph-friendly format.
 * @param {Record} record - The first record from Neo4j query result.
 * @returns {{ nodes: any[], links: any[] }}
 */
function convertNeo4jGraph(record) {
  const tokens = record.get("tokens") || [];
  const users = record.get("users") || [];
  const permissions = record.get("permissions") || [];
  const endpoints = record.get("endpoints") || [];

  const usedRels = record.get("usedRels") || [];
  const grantRels = record.get("grantRels") || [];
  const applyRels = record.get("applyRels") || [];

  const nodeSet = new Map();

  const addNode = (node) => {
    const norm = normalizeNode(node);
    nodeSet.set(norm.id, norm);
  };

  [...tokens, ...users, ...permissions, ...endpoints].forEach(addNode);

  const links = [
    ...usedRels.map(normalizeRelationship),
    ...grantRels.map(normalizeRelationship),
    ...applyRels.map(normalizeRelationship),
  ];

  return {
    nodes: Array.from(nodeSet.values()),
    links,
  };
}
// utils/normalizeNeo4j.ts
export function normalizeNeo4jGraph({ nodes, links }) {
  const parseProperties = (props) => {
    const plain = {};
    for (const [key, value] of Object.entries(props)) {
      // Convert Neo4j Integer or nested objects to plain values
      if (typeof value?.toNumber === "function") {
        plain[key] = value.toNumber();
      } else if (typeof value === "object" && value !== null) {
        plain[key] = parseProperties(value);
      } else {
        plain[key] = value;
      }
    }
    return plain;
  };

  return {
    nodes: nodes.map((n) => ({
      id: n.id || n.identity?.toString(), // fallback if using identity
      label: n.label || n.labels?.[0],
      properties: parseProperties(n.properties || {}),
    })),
    links: links.map((l) => ({
      source: l.source?.toString() ?? l.source,
      target: l.target?.toString() ?? l.target,
      type: l.type,
      properties: parseProperties(l.properties || {}),
    })),
  };
}
// Fix links to use full node IDs
export function patchGraphData(raw) {
  const idMap = Object.fromEntries(
    raw.nodes.map((node) => {
      const shortId = node.id.split(":").pop(); // e.g. "9"
      return [shortId, node.id];
    })
  );

  const patchedLinks = raw.links.map((l) => ({
    ...l,
    source: idMap[l.source] || l.source,
    target: idMap[l.target] || l.target,
  }));

  return { nodes: raw.nodes, links: patchedLinks };
}

const page = async () => {
  const records = await fetchRiskData();
  const graph = convertNeo4jGraph(records);
  const normalized = normalizeNeo4jGraph({
    links: graph.links,
    nodes: graph.nodes,
  });
  console.log(JSON.stringify(normalized));

  return (
    <div>
      <TokenRiskDashboard {...patchGraphData({ ...normalized })} />
    </div>
  );
};

export default page;
