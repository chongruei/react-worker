import dynamic from "next/dynamic";

const loader = () => import("@components/total/total").then((mod) => mod.Total);

export const Total = dynamic(loader, {
  ssr: false,
});
