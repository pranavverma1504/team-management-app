"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Project = {
  _id: string;
  name: string;
  description: string;
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const [showEditForm, setShowEditForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const getProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`);

      setProject(response.data.project);
      setRole(response.data.role);

      setName(response.data.project.name);
      setDescription(response.data.project.description);
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async () => {
    try {
      if (!name || !description) {
        alert("Name and description are required");
        return;
      }

      await axios.patch(`/api/projects/${id}`, {
        name,
        description,
      });

      setShowEditForm(false);

      await getProject();
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const deleteProject = async () => {
    try {
      const confirmed = confirm(
        "Are you sure you want to delete this project?"
      );

      if (!confirmed) {
        return;
      }

      await axios.delete(`/api/projects/${id}`);

      router.push("/projects");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getProject();
    }
  }, [id]);

  if (loading) {
    return <p>Loading project...</p>;
  }

  if (!project) {
    return <p>Project not found or access denied.</p>;
  }

  const canEdit =
    role === "OWNER" || role === "ADMIN";

  const canDelete =
    role === "OWNER";

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {project.name}
          </h1>

          <p className="text-gray-500 mt-2">
            {project.description}
          </p>

          <p className="mt-4">
            Your Role:{" "}
            <span className="font-semibold">
              {role}
            </span>
          </p>
        </div>

        <div className="flex gap-3">
          {canEdit && (
            <button
              onClick={() => setShowEditForm(!showEditForm)}
              className="border px-4 py-2 rounded-lg"
            >
              Edit Project
            </button>
          )}

          {canDelete && (
            <button
              onClick={deleteProject}
              className="border px-4 py-2 rounded-lg"
            >
              Delete Project
            </button>
          )}
        </div>
      </div>

      {showEditForm && canEdit && (
        <div className="border rounded-xl p-5 mt-8 max-w-xl">
          <h2 className="text-lg font-semibold mb-4">
            Edit Project
          </h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              className="border p-3 rounded-lg"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description"
              className="border p-3 rounded-lg"
            />

            <div className="flex gap-3">
              <button
                onClick={updateProject}
                className="border px-4 py-2 rounded-lg"
              >
                Save Changes
              </button>

              <button
                onClick={() => setShowEditForm(false)}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}