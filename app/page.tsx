import { fetchGraphData } from "./utils/fetch";

const page = async () => {
  const records = await fetchGraphData();
  console.log(records);

  return <div>{JSON.stringify(records)}</div>;
};

export default page;
