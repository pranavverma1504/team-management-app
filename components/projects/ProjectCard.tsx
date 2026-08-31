type ProjectCardProps = {
  name: string;
  description: string;
  members: number;
};

export default function ProjectCard({
  name,
  description,
  members,
}: ProjectCardProps) {
  return (
    <div className="border rounded-xl p-5">
      <h2 className="text-xl font-semibold">{name}</h2>

      <p className="text-gray-500 mt-2">
        {description}
      </p>

      <p className="mt-4 text-sm">
        Members: {members}
      </p>
    </div>
  );
}