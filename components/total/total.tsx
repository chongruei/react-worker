import { useWorker } from "@hooks/useWorker";
import { FC, useEffect, useState } from "react";

const code = `self.onmessage = (e) => {
  const [num1, num2] = e.data
  let sum = 0
  for (let i = num1; i < num2; i++) {
    sum += i
  }
  self.postMessage(sum)
}`;

export const Total: FC = () => {
  const { data, loading, error, postMessage } = useWorker<number | number[]>({
    code,
  });

  useEffect(() => {
    postMessage([0, 100000]);
  }, [postMessage]);

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Sum: {data}</h1>
    </div>
  );
};

export default Total;
