import Link from "next/link";

type ProjectCardProps = {
  id: string;
  name: string;
  description: string;
  members: number;
};

export default function ProjectCard({
  id,
  name,
  description,
  members,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${id}`}>
      <div className="border rounded-xl p-5 cursor-pointer hover:shadow-md transition">
        <h2 className="text-xl font-semibold">
          {name}
        </h2>

        <p className="text-gray-500 mt-2">
          {description}
        </p>

        <p className="mt-4 text-sm">
          Members: {members}
        </p>
      </div>
    </Link>
  );
}