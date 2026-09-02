"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Project = {
  _id: string;
  name: string;
  description: string;
};

export default function ProjectDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const getProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`);

      setProject(response.data.project);
      setRole(response.data.role);
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
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

  return (
    <div>
      <h1 className="text-3xl font-bold">
        {project.name}
      </h1>

      <p className="text-gray-500 mt-2">
        {project.description}
      </p>

      <div className="mt-6">
        <p>
          Your Role:{" "}
          <span className="font-semibold">
            {role}
          </span>
        </p>
      </div>
    </div>
  );
}