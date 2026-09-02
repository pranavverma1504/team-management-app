"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "@/components/projects/ProjectCard";

type Project = {
  _id: string;
  name: string;
  description: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const getProjects = async () => {
    try {
      const response = await axios.get("/api/projects");

      setProjects(response.data.projects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    try {
      if (!name || !description) {
        alert("Name and description are required");
        return;
      }

      await axios.post("/api/projects", {
        name,
        description,
      });

      setName("");
      setDescription("");
      setShowForm(false);

      await getProjects();
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Projects
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your projects
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="border px-4 py-2 rounded-lg"
        >
          Create Project
        </button>
      </div>

      {showForm && (
        <div className="border rounded-xl p-5 mt-6 max-w-xl">
          <h2 className="text-lg font-semibold mb-4">
            Create New Project
          </h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <textarea
              placeholder="Project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-3 rounded-lg"
            />

            <div className="flex gap-3">
              <button
                onClick={createProject}
                className="border px-4 py-2 rounded-lg"
              >
                Create
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <p className="mt-8">
          Loading projects...
        </p>
      )}

      {!loading && projects.length === 0 && (
        <p className="mt-8 text-gray-500">
          No projects found.
        </p>
      )}

      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              id={project._id}
              name={project.name}
              description={project.description}
              members={1}
            />
          ))}
        </div>
      )}
    </div>
  );
}