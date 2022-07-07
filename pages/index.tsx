import type { NextPage } from "next";
import { Total } from "@components/total";

const Home: NextPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Total />
    </div>
  );
};

export default Home;
