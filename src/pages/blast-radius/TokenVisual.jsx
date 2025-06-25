import { InteractiveNvlWrapper } from "@neo4j-nvl/react";
import React, { useRef, useState, useEffect } from "react";
import { nvlResultTransformer } from "@neo4j-nvl/base";
import driver from "../../constants/utils";

const colorPalette = [
  "#FFDF81",
  "#C990C0",
  "#F79767",
  "#56C7E4",
  "#F16767",
  "#D8C7AE",
  "#8DCC93",
  "#ECB4C9",
  "#4D8DDA",
  "#FFC354",
  "#DA7294",
  "#579380",
];

const labelColorMap = new Map();
let colorIndex = 0;

export const getUniqueColorForLabel = (label) => {
  if (!labelColorMap.has(label)) {
    const color = colorPalette[colorIndex % colorPalette.length];
    labelColorMap.set(label, color);
    colorIndex++;
  }
  return labelColorMap.get(label);
};

const fetchD = async (query, params) => {
  const data = await driver.executeQuery(query, params, {
    resultTransformer: nvlResultTransformer,
  });
  console.log(data);
  return data;
};
const GET_TOKEN_ENDPOINT_REL = `MATCH path = (t:Token)-[:GRANTS]->(p:Permission)-[:APPLIES_TO]->(e:Endpoint)
RETURN path;
`;
const getVisual = "call db.schema.visualization()";
const QUERY = `MATCH (a)-[r]->(b)
RETURN a, r, b`;
const DEMO_FINDING = `
MATCH (f:Finding {id: 'demo-finding-001'})
OPTIONAL MATCH (f)<-[:HAS_FINDING]-(t:Token)
OPTIONAL MATCH (t)-[:EXPOSED_BY]->(u:User)-[:BELONGS_TO]->(o:Organization)
OPTIONAL MATCH (t)-[:HAS_ENDPOINT]->(ep:Endpoint)
OPTIONAL MATCH (t)-[:HAS_PERMISSION]->(perm:Permission)
RETURN f, t, u, o, ep, perm
`;
const FINDING_ID = `MATCH (t:Token {id: "090609f3-0ddb-4dba-ba80-bb8bb851f705"})
OPTIONAL MATCH (t)-[r1:EXPOSED_BY]->(u:User)-[r2:BELONGS_TO]->(o:Organization)
OPTIONAL MATCH (t)-[r3:HAS_ENDPOINT]->(e:Endpoint)
OPTIONAL MATCH (t)-[r4:HAS_PERMISSION]->(p:Permission)
RETURN t, u, o, e, p, r1, r2, r3, r4`;
const getUrl = (prop) => {
  // value:token
  // permissions"name
  const URLS = {
    AVATAR:
      "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png",
    KEY: "https://pngfre.com/wp-content/uploads/key-4.png",
    TOKEN: "https://cdn-icons-png.freepik.com/512/8257/8257840.png",
    PERMISSION:
      "https://upload.wikimedia.org/wikipedia/commons/f/f0/Permission_logo_2021.svg",
    ENDPOINT: "/browser.png",
    COMPANY: "https://cdn-icons-png.flaticon.com/512/2399/2399925.png",
  };

  if ("value" in prop) {
    console.log("VALUEEEE");
    console.log("TOKEN");
    return URLS.KEY;
  } else if ("name" in prop) {
    return URLS.PERMISSION;
  } else if ("path" in prop) {
    return URLS.ENDPOINT;
  } else if ("username" in prop) {
    return URLS.AVATAR;
  } else if ("title" in prop) {
    return URLS.COMPANY;
  }
};
export default function Neo4jVisual() {
  const [nodes, setNodes] = useState();
  const [rels, setRels] = useState([]);
  const nvlRef = useRef();

  const fetchAndFormat = async (query, params) => {
    await fetchD(FINDING_ID, params)
      .then((d) => {
        const styledNodes = d.nodes.map((node) => {
          const ogNode = d.recordObjectMap.get(node.id);

          return {
            ...node,
            captions: [
              {
                value:
                  ogNode.properties.name ||
                  ogNode.properties.username ||
                  ogNode.properties.title ||
                  ogNode.properties.value ||
                  ogNode.properties.path ||
                  ogNode.properties.finding_title,
              },
            ],
            overlayIcon: {
              url: getUrl(ogNode.properties),
            },
            // color: getUniqueColorForLabel(ogNode.properties),
            highlight: { background: "transparent" },
            captionAlign: "top",
            size: 40,
          };
        });

        const stylesRels = d.relationships.map((rel) => {
          const ogRel = d.recordObjectMap.get(rel.id);
          console.log(ogRel);

          return {
            ...rel,
            captions: [{ value: ogRel.type }],
          };
        });
        return { nodes: styledNodes, rels: stylesRels };
      })
      .then(({ nodes, rels }) => {
        setNodes(nodes);
        setRels(rels);
      });
  };
  useEffect(() => {
    fetchAndFormat(getVisual, {});
  }, []);

  useEffect(() => {
    console.log(nvlRef.current);
  }, [nodes]);
  return (
    nodes &&
    nodes.length > 0 && (
      <div className="bg-white">
        <InteractiveNvlWrapper
          style={{ width: "100%", height: "100vh" }}
          nodes={nodes}
          rels={rels}
          ref={nvlRef}
          nvlOptions={{
            initialZoom: 3,
          }}
          layout="d3Force"
          config={{
            autoLayout: true, // Prevent overlaps
            labelKey: (node) => {
              if (node.labels.includes("Token")) return node.properties.value;
              if (node.labels.includes("Permission"))
                return node.properties.name;
              if (node.labels.includes("Endpoint")) return node.properties.path;
              return node.labels[0]; // fallback
            },
            captionKey: (node) => {
              if (node.labels.includes("Token"))
                return `Risk: ${node.properties.riskScore ?? "N/A"}`;
              if (node.labels.includes("Permission")) return "Permission";
              if (node.labels.includes("Endpoint")) return "API";
            },
          }}
          // Event handlers you can add:
          mouseEventCallbacks={{
            onZoom: true,
            onPan: true,
          }}
        />
      </div>
    )
  );
}
