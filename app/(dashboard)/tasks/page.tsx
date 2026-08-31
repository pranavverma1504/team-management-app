import TaskCard from "@/components/tasks/TaskCard";

export default function TasksPage() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-gray-500 mt-1">
          View and manage your tasks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        <TaskCard
          title="Create Login Page"
          status="DONE"
          priority="HIGH"
        />

        <TaskCard
          title="Design Dashboard"
          status="IN_PROGRESS"
          priority="MEDIUM"
        />

        <TaskCard
          title="Add Project API"
          status="TODO"
          priority="HIGH"
        />
      </div>
    </div>
  );
}