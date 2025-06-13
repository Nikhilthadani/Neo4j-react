// Import necessary modules
import React, { useState, useEffect, useRef } from "react";
import { useReadCypher } from "use-neo4j";

// Placeholder for useReadCypher if it's not a real import in this environment.
// In a real application, you would remove this and use the actual library import.
const useReadCypher = (query) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call for demonstration purposes
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real application, you would connect to Neo4j here.
        // For now, let's simulate some data based on your query structure.
        const mockData = {
          records: [
            {
              _fields: [
                [
                  // tokens
                  {
                    id: 1,
                    label: "Token",
                    properties: { name: "tokenA", riskScore: 5 },
                  },
                  {
                    id: 2,
                    label: "Token",
                    properties: { name: "tokenB", riskScore: 3 },
                  },
                ],
                [
                  // permissions
                  {
                    id: 101,
                    label: "Permission",
                    properties: { name: "Read" },
                  },
                  {
                    id: 102,
                    label: "Permission",
                    properties: { name: "Write" },
                  },
                ],
                [
                  // endpoints
                  {
                    id: 201,
                    label: "Endpoint",
                    properties: { url: "/api/v1/data" },
                  },
                  {
                    id: 202,
                    label: "Endpoint",
                    properties: { url: "/api/v2/config" },
                  },
                ],
                [
                  // users
                  { id: 301, label: "User", properties: { name: "Alice" } },
                  { id: 302, label: "User", properties: { name: "Bob" } },
                ],
                [
                  // grantsLinks
                  { source: 1, target: 101, type: "GRANTS" },
                  { source: 1, target: 102, type: "GRANTS" },
                ],
                [
                  // appliesToLinks
                  { source: 101, target: 201, type: "APPLIES_TO" },
                  { source: 102, target: 202, type: "APPLIES_TO" },
                ],
                [
                  // usedByLinks
                  { source: 1, target: 301, type: "USED_BY" },
                  { source: 2, target: 302, type: "USED_BY" },
                ],
              ],
              _fieldLookup: {
                tokens: 0,
                permissions: 1,
                endpoints: 2,
                users: 3,
                grantsLinks: 4,
                appliesToLinks: 5,
                usedByLinks: 6,
              },
              get: function (key) {
                return this._fields[this._fieldLookup[key]];
              },
            },
          ],
        };
        setResult(mockData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]); // Re-run if query changes
  return { result, loading, error };
};

// ForceGraph2D requires a window object, so we use dynamic import
// if running in a Next.js environment with 'use client'
const ForceGraph2D =
  typeof window !== "undefined"
    ? require("react-force-graph-2d").default
    : () => null;

const GraphVisualization = () => {
  // State to hold the graph data (nodes and links)
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  // Ref to hold the graph component instance
  const fgRef = useRef();

  // Cypher query to fetch tokens, permissions, endpoints, users,
  // and their relationships, along with a calculated risk score.
  // The RETURN clause is structured to provide collections of nodes and links,
  // which are then processed in the useEffect hook.
  const cypherQuery = `
    MATCH (t:Token)
    OPTIONAL MATCH (t)-[gr:GRANTS]->(p:Permission)
    OPTIONAL MATCH (p)-[at:APPLIES_TO]->(e:Endpoint)
    OPTIONAL MATCH (t)-[ub:USED_BY]->(u:User)

    // Calculate and set riskScore on Token nodes
    WITH
      t, gr, p, at, e, ub, u,
      COLLECT(DISTINCT p) AS permissions_for_risk, // Use different alias to avoid conflict
      COLLECT(DISTINCT e) AS endpoints_for_risk,
      COLLECT(DISTINCT u) AS users_for_risk

    WITH
      t, gr, p, at, e, ub, u,
      CASE
        WHEN ANY(perm IN permissions_for_risk WHERE perm.name = 'Read') AND ANY(perm IN permissions_for_risk WHERE perm.name = 'Write') THEN 3
        ELSE 0
      END AS permRisk,
      CASE
        WHEN SIZE(endpoints_for_risk) > 3 THEN 2
        ELSE 0
      END AS endpointRisk,
      CASE
        WHEN SIZE(users_for_risk) > 1 THEN 3
        ELSE 0
      END AS userRisk

    SET t.riskScore = (permRisk + endpointRisk + userRisk)

    // Return distinct nodes and links for graph visualization
    RETURN
      COLLECT(DISTINCT {id: id(t), label: 'Token', properties: properties(t)}) AS tokens,
      COLLECT(DISTINCT {id: id(p), label: 'Permission', properties: properties(p)}) AS permissions,
      COLLECT(DISTINCT {id: id(e), label: 'Endpoint', properties: properties(e)}) AS endpoints,
      COLLECT(DISTINCT {id: id(u), label: 'User', properties: properties(u)}) AS users,
      COLLECT(DISTINCT {source: id(t), target: id(p), type: type(gr)}) AS grantsLinks,
      COLLECT(DISTINCT {source: id(p), target: id(e), type: type(at)}) AS appliesToLinks,
      COLLECT(DISTINCT {source: id(t), target: id(u), type: type(ub)}) AS usedByLinks
  `;

  // Use the useReadCypher hook to fetch data from Neo4j
  const { result, loading, error } = useReadCypher(cypherQuery);

  // useEffect hook to process the fetched data and update graphData state
  useEffect(() => {
    if (result && result.records && result.records.length > 0) {
      const nodes = {}; // Use an object to store nodes by ID for efficient lookup
      const links = [];

      // The Cypher query returns a single record containing all collections
      const record = result.records[0];

      // Extract node collections
      const tokens = record.get("tokens") || [];
      const permissions = record.get("permissions") || [];
      const endpoints = record.get("endpoints") || [];
      const users = record.get("users") || [];

      // Extract link collections
      const grantsLinks = record.get("grantsLinks") || [];
      const appliesToLinks = record.get("appliesToLinks") || [];
      const usedByLinks = record.get("usedByLinks") || [];

      // Add all unique nodes to the nodes object
      [...tokens, ...permissions, ...endpoints, ...users].forEach((node) => {
        // Ensure node is not null (can happen with OPTIONAL MATCH)
        if (node && node.id !== null) {
          nodes[node.id] = {
            id: node.id,
            label: node.label,
            ...node.properties, // Spread existing properties
            // Add a color based on node type for better visualization
            color:
              node.label === "Token"
                ? "#FF6347" // Tomato
                : node.label === "Permission"
                ? "#4682B4" // SteelBlue
                : node.label === "Endpoint"
                ? "#3CB371" // MediumSeaGreen
                : node.label === "User"
                ? "#DAA520" // Goldenrod
                : "#6A5ACD", // SlateBlue (default)
          };

          // If it's a Token node, add a risk score property
          if (
            node.label === "Token" &&
            node.properties &&
            typeof node.properties.riskScore !== "undefined"
          ) {
            nodes[node.id].riskScore = node.properties.riskScore;
          }
        }
      });

      // Add all links to the links array
      [...grantsLinks, ...appliesToLinks, ...usedByLinks].forEach((link) => {
        // Ensure source and target exist and are not null
        if (link && link.source !== null && link.target !== null) {
          links.push({
            source: link.source,
            target: link.target,
            label: link.type, // Use the relationship type as the link label
            color: "#999", // Link color
          });
        }
      });

      // Update the graphData state
      setGraphData({ nodes: Object.values(nodes), links });

      // Optional: Adjust graph physics after data loads
      if (fgRef.current) {
        fgRef.current.d3Force("charge").strength(-400); // Adjust node repulsion
        fgRef.current.d3Force("link").distance(100); // Adjust link length
        fgRef.current.d3Force("center", null); // Disable centering force if preferred
      }
    }
  }, [result]); // Re-run effect when 'result' changes

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Loading graph data...
        </p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 dark:bg-red-900">
        <p className="text-xl font-semibold text-red-700 dark:text-red-300">
          Error loading graph: {error.message}
        </p>
      </div>
    );
  }

  // Render the ForceGraph2D component
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center p-4 font-inter">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Neo4j Graph Visualization
      </h1>
      <div className="w-full max-w-7xl h-[600px] md:h-[800px] lg:h-[900px] bg-white dark:bg-gray-700 rounded-lg shadow-xl overflow-hidden relative">
        {graphData.nodes.length > 0 ? (
          <ForceGraph2D
            ref={fgRef} // Attach ref to the ForceGraph2D component
            graphData={graphData}
            nodeLabel={(node) => {
              // Display node type, name/URL, and riskScore for Tokens
              if (node.label === "Token") {
                return `ID: ${node.id} | Type: ${node.label} | Name: ${
                  node.name || "N/A"
                } | Risk Score: ${node.riskScore || 0}`;
              } else if (node.label === "Endpoint") {
                return `ID: ${node.id} | Type: ${node.label} | URL: ${
                  node.url || "N/A"
                }`;
              } else if (node.label === "User") {
                return `ID: ${node.id} | Type: ${node.label} | Name: ${
                  node.name || "N/A"
                }`;
              }
              return `ID: ${node.id} | Type: ${node.label} | Name: ${
                node.name || "N/A"
              }`;
            }}
            nodeColor={(node) => node.color} // Use the color property set in useEffect
            nodeCanvasObject={(node, ctx, globalScale) => {
              // Draw a circle for the node
              const radius = 6; // Default node radius
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
              ctx.fillStyle = node.color;
              ctx.fill();

              // Draw node label
              const label = node.label;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "#000"; // Black text for labels
              ctx.fillText(label, node.x, node.y + radius + fontSize / 2 + 2); // Position label below the node

              // Optionally draw risk score for Token nodes
              if (
                node.label === "Token" &&
                typeof node.riskScore !== "undefined"
              ) {
                const riskFontSize = 10 / globalScale;
                ctx.font = `${riskFontSize}px Sans-Serif`;
                ctx.fillStyle = "red"; // Red for risk score
                ctx.fillText(
                  `Risk: ${node.riskScore}`,
                  node.x,
                  node.y - radius - riskFontSize / 2 - 2
                ); // Position above
              }
            }}
            linkWidth={1}
            linkColor={(link) => link.color}
            linkDirectionalParticles={2}
            linkDirectionalParticleWidth={3}
            linkDirectionalArrowLength={8}
            linkDirectionalArrowRelPos={1}
            linkCanvasObject={(link, ctx, globalScale) => {
              const start = link.source;
              const end = link.target;
              if (!start || !end || !start.x || !start.y || !end.x || !end.y)
                return;

              // Draw link line
              ctx.beginPath();
              ctx.moveTo(start.x, start.y);
              ctx.lineTo(end.x, end.y);
              ctx.strokeStyle = link.color;
              ctx.lineWidth = link.width || 1;
              ctx.stroke();

              // Draw link label (relationship type)
              const label = link.label;
              const fontSize = 10 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "#555"; // Grey text for link labels

              const midX = (start.x + end.x) / 2;
              const midY = (start.y + end.y) / 2;
              ctx.fillText(label, midX, midY);
            }}
            // Adjust dimensions dynamically based on parent container
            width={null} // Set to null to make it responsive to parent's width
            height={null} // Set to null to make it responsive to parent's height
            onNodeClick={(node) => {
              // Center the graph on the clicked node
              fgRef.current.centerAndZoom(node.x, node.y, 1.5);
              console.log("Clicked Node:", node);
            }}
            onLinkClick={(link) => {
              console.log("Clicked Link:", link);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-lg">
            No graph data available.
          </div>
        )}
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
        Interact with the graph: drag nodes, zoom with scroll, click to center.
      </p>
    </div>
  );
};

export default GraphVisualization;
