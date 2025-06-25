import React, { useEffect, useState } from "react";
import { nvlResultTransformer } from "@neo4j-nvl/base";

const GraphWrapper = () => {
  const [InteractiveNvlWrapper, setWrapper] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { InteractiveNvlWrapper } = await import("@neo4j-nvl/react");
      setWrapper(() => InteractiveNvlWrapper); // ✅ lazily set component
    };

    load();

    // mock records
    setRecords([]);
  }, []);

  if (!InteractiveNvlWrapper) return <div>Loading...</div>;

  return (
    <InteractiveNvlWrapper
      records={records}
      recordTransformer={nvlResultTransformer}
    />
  );
};

export default GraphWrapper;
