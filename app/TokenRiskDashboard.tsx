"use client";
import "aframe";
import { useMemo, useState } from "react";
import { ForceGraph2D } from "react-force-graph";

export default function TokenRiskGraph({ nodes, links }) {
  const [onlyRisky, setOnlyRisky] = useState(false);

  const filteredData = useMemo(() => {
    if (!onlyRisky) return { nodes, links };

    const riskyIds = new Set(
      nodes
        .filter(
          (n) => n.label === "Token" && (n.properties?.riskScore ?? 0) >= 5
        )
        .map((n) => n.id)
    );

    return {
      nodes: nodes.filter((n) => n.label !== "Token" || riskyIds.has(n.id)),
      links: links.filter(
        (l) => riskyIds.has(l.source) || riskyIds.has(l.target)
      ),
    };
  }, [nodes, links, onlyRisky]);

  const idMap = useMemo(() => {
    return Object.fromEntries(nodes.map((n) => [n.id.split(":").pop(), n.id]));
  }, [nodes]);

  const graphData = useMemo(() => {
    const patchedLinks = links.map((l) => ({
      ...l,
      source: idMap[l.source] || l.source,
      target: idMap[l.target] || l.target,
    }));
    return { nodes, links: patchedLinks };
  }, [nodes, links, idMap]);

  return (
    <div className="relative h-screen bg-gradient-to-b from-black to-zinc-900 text-white font-sans">
      {/* Toggle Button */}
      <button
        onClick={() => setOnlyRisky(!onlyRisky)}
        className="absolute top-4 left-4 z-10 bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-xl shadow-lg transition-all duration-300"
      >
        {onlyRisky ? "Show All" : "Show High Risk Only"}
      </button>

      {/* Node Details Panel */}
      <div className="absolute right-4 top-4 z-10 w-96 max-h-[90%] overflow-y-auto bg-white text-black p-5 rounded-2xl shadow-2xl backdrop-blur-md">
        <h2 className="text-xl font-bold mb-3 border-b pb-2 text-gray-800">
          Node Details
        </h2>
        {(onlyRisky ? filteredData.nodes : graphData.nodes).map((node) => (
          <div
            key={node.id}
            className="mb-4 border-b border-gray-200 pb-2 transition-all duration-200 hover:bg-gray-50 rounded p-2"
          >
            <div>
              <strong>Label:</strong> {node.label}
            </div>
            {node.properties?.value && (
              <div>
                <strong>Value:</strong> {node.properties.value}
              </div>
            )}
            {node.properties?.username && (
              <div>
                <strong>Username:</strong> {node.properties.username}
              </div>
            )}
            {node.properties?.name && (
              <div>
                <strong>Name:</strong> {node.properties.name}
              </div>
            )}
            {node.properties?.path && (
              <div>
                <strong>Path:</strong> {node.properties.path}
              </div>
            )}
            {node.properties?.riskScore !== undefined && (
              <div>
                <strong>Risk Score:</strong>{" "}
                <span
                  className={`font-semibold ${
                    node.properties.riskScore >= 6
                      ? "text-red-600"
                      : node.properties.riskScore >= 3
                      ? "text-orange-500"
                      : "text-green-600"
                  }`}
                >
                  {node.properties.riskScore}
                </span>
              </div>
            )}
            {node.properties?.status && (
              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    node.properties.status === "compromised"
                      ? "text-red-700"
                      : "text-green-700"
                  }`}
                >
                  {node.properties.status}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Force Graph */}
      <ForceGraph2D
        graphData={onlyRisky ? filteredData : graphData}
        nodeAutoColorBy="label"
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        linkColor={() => "rgba(255,255,255,0.2)"}
        linkWidth={2}
        cooldownTicks={100}
        onEngineStop={() => console.log("Layout stabilized")}
        nodeLabel={(node) => {
          const p = node.properties || {};
          return `${node.label}:
$${p.value || p.username || p.name || p.path || "?"}${
            p.riskScore !== undefined ? `\nRisk: ${p.riskScore}` : ""
          }${p.status ? `\nStatus: ${p.status}` : ""}`;
        }}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = `${node.label}: ${
            node.properties?.value ||
            node.properties?.username ||
            node.properties?.name ||
            node.properties?.path ||
            ""
          }`;

          const fontSize = 12 / globalScale;
          const risk = node.properties?.riskScore ?? 0;
          const status = node.properties?.status;
          let color = "#bbb";

          if (node.label === "Token") {
            if (status === "compromised") color = "#ff0033";
            else if (risk >= 6) color = "#f87171"; // red-400
            else if (risk >= 3) color = "#fb923c"; // orange-400
            else color = "#34d399"; // green-400
          }

          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.font = `${fontSize}px Inter, sans-serif`;
          ctx.fillStyle = "white";
          ctx.fillText(label, node.x + 10, node.y + 5);
        }}
      />
    </div>
  );
}
