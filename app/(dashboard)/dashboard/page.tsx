import StatCard from "@/components/dashboard/StatCard";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p className="text-gray-500 mt-1">
        Welcome back
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
        <StatCard title="Total Projects" value={4} />
        <StatCard title="Total Tasks" value={18} />
        <StatCard title="Completed Tasks" value={10} />
      </div>
    </div>
  );
}