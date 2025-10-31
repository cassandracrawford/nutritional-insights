import Charts from "./Charts";
import Filter from "./Filter";
import Metadata from "./Metadata";

export default function Dashboard() {
  return (
    <div className="flex flex-col py-4 w-4xl">
      <h1 className="px-6 font-bold text-xl">Explore Nutritional Insights</h1>
      <Filter />
      <Charts />
      <Metadata />
    </div>
  );
}
