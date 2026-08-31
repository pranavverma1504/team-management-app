type TaskCardProps = {
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
};

export default function TaskCard({
  title,
  status,
  priority,
}: TaskCardProps) {
  return (
    <div className="border rounded-xl p-5">
      <h2 className="font-semibold">{title}</h2>

      <div className="flex gap-3 mt-4 text-sm">
        <span>Status: {status}</span>
        <span>Priority: {priority}</span>
      </div>
    </div>
  );
}