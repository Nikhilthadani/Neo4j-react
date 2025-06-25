// neo4j.js
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  "neo4j+s://066a28ac.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "Hy--rVZxL4sEsHDHy9JvhgrGbXTGPhYi-6lRcAsfIUs")
);

export default driver;
