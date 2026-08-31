import ProjectCard from "@/components/projects/ProjectCard";

export default function ProjectsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-gray-500 mt-1">
            Manage your projects
          </p>
        </div>

        <button className="border px-4 py-2 rounded-lg">
          Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        <ProjectCard
          name="Website Redesign"
          description="Redesign the company website."
          members={4}
        />

        <ProjectCard
          name="Mobile App"
          description="Build the mobile application."
          members={3}
        />

        <ProjectCard
          name="Marketing Campaign"
          description="Plan the upcoming campaign."
          members={5}
        />
      </div>
    </div>
  );
}