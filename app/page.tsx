import Table from "@/src/features/table/Table";
import OptimizedSearch from "@/src/features/optimized-search/OptimizedSearch";

export const metadata = {
  title: "Home Page",
  description: "This is the home page of the application.",
}

export default function Home() {
  return <div>  <div className="p-4">
    <Table/>
    <OptimizedSearch/>
</div></div>;
}
