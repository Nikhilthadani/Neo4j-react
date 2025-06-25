import { InteractiveNvlWrapper } from "@neo4j-nvl/react";
import { useEffect, useRef, useState } from "react";
import { nvlResultTransformer } from "@neo4j-nvl/base";
import driver from "./utils/neo4j";

/** 
const nodes = [
  // Users
  { id: "user_001", label: "Anita Sharma", caption: "User: Anita Sharma" },
  { id: "user_002", label: "Rahul Mehta", caption: "User: Rahul Mehta" },
  { id: "user_003", label: "Kavita Desai", caption: "User: Kavita Desai" },
  { id: "user_004", label: "Devendra Rao", caption: "User: Devendra Rao" },
  { id: "user_005", label: "Sonal Kapoor", caption: "User: Sonal Kapoor" },

  // Repositories
  {
    id: "repo_101",
    label: "secure-api-service",
    caption: "Repo: secure-api-service",
  },
  {
    id: "repo_102",
    label: "internal-toolkit",
    caption: "Repo: internal-toolkit",
  },
  { id: "repo_103", label: "payment-engine", caption: "Repo: payment-engine" },
  { id: "repo_104", label: "audit-logs", caption: "Repo: audit-logs" },
  { id: "repo_105", label: "devops-scripts", caption: "Repo: devops-scripts" },

  // Tokens
  { id: "token_a1", label: "ghp_93rT0kenX1", caption: "Token: ghp_93rT0kenX1" },
  { id: "token_b2", label: "ghp_Lk3T0ken88", caption: "Token: ghp_Lk3T0ken88" },
  {
    id: "token_c3",
    label: "ghp_R4r3T0ken77",
    caption: "Token: ghp_R4r3T0ken77",
  },
];

const rels = [
  // Scanned Repos
  {
    id: "rel_001",
    from: "user_001",
    to: "repo_101",
    label: "SCANNED_REPO",
    caption: "Anita scanned secure-api-service",
  },
  {
    id: "rel_002",
    from: "user_002",
    to: "repo_102",
    label: "SCANNED_REPO",
    caption: "Rahul scanned internal-toolkit",
  },
  {
    id: "rel_003",
    from: "user_003",
    to: "repo_103",
    label: "SCANNED_REPO",
    caption: "Kavita scanned payment-engine",
  },
  {
    id: "rel_004",
    from: "user_004",
    to: "repo_104",
    label: "SCANNED_REPO",
    caption: "Devendra scanned audit-logs",
  },
  {
    id: "rel_005",
    from: "user_005",
    to: "repo_105",
    label: "SCANNED_REPO",
    caption: "Sonal scanned devops-scripts",
  },

  // Token Leaks
  {
    id: "rel_006",
    from: "repo_101",
    to: "token_a1",
    label: "LEAKED_TOKEN_FOUND",
    caption: "Token found in secure-api-service",
  },
  {
    id: "rel_007",
    from: "repo_102",
    to: "token_b2",
    label: "LEAKED_TOKEN_FOUND",
    caption: "Token found in internal-toolkit",
  },
  {
    id: "rel_008",
    from: "repo_104",
    to: "token_c3",
    label: "LEAKED_TOKEN_FOUND",
    caption: "Token found in audit-logs",
  },

  // Token Usage
  {
    id: "rel_009",
    from: "user_001",
    to: "token_a1",
    label: "USED_TOKEN",
    caption: "Anita used ghp_93rT0kenX1",
  },
  {
    id: "rel_010",
    from: "user_005",
    to: "token_b2",
    label: "USED_TOKEN",
    caption: "Sonal used ghp_Lk3T0ken88",
  },
  {
    id: "rel_011",
    from: "user_003",
    to: "token_c3",
    label: "USED_TOKEN",
    caption: "Kavita used ghp_R4r3T0ken77",
  },

  // Cross-repo analysis
  {
    id: "rel_012",
    from: "user_002",
    to: "repo_105",
    label: "SCANNED_REPO",
    caption: "Rahul also scanned devops-scripts",
  },
  {
    id: "rel_013",
    from: "user_003",
    to: "repo_104",
    label: "SCANNED_REPO",
    caption: "Kavita also scanned audit-logs",
  },
];*/
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

const FINDING_ID = `MATCH (t:Token {id: "demo-finding-001"})
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
  const nvlRef = useRef(null);
  const [nodes, setNodes] = useState();
  const [rels, setRels] = useState([]);
  const fetchAndFormat = async (query, params) => {
    await fetchD(getVisual, params)
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

  return (
    nodes?.length > 0 && (
      <InteractiveNvlWrapper
        style={{ width: "100%", height: "100vh" }}
        nodes={nodes}
        rels={rels}
        ref={nvlRef}
        nvlOptions={{
          initialZoom: 3,
        }}
        layout="grid"
        config={{
          autoLayout: true, // Prevent overlaps
          labelKey: (node) => {
            if (node.labels.includes("Token")) return node.properties.value;
            if (node.labels.includes("Permission")) return node.properties.name;
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
    )
  );
}
