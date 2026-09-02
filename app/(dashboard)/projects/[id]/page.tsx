"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Project = {
  _id: string;
  name: string;
  description: string;
};

type Member = {
  _id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  userId: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const [members, setMembers] = useState<Member[]>([]);

  const [showEditForm, setShowEditForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const getProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`);

      setProject(response.data.project);
      setRole(response.data.role);

      setName(response.data.project.name);
      setDescription(response.data.project.description);
    } catch (error) {
      console.error("Failed to fetch project:", error);
    }
  };

  const getMembers = async () => {
    try {
      const response = await axios.get(
        `/api/projects/${id}/members`
      );

      setMembers(response.data.members);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  const loadProjectData = async () => {
    try {
      setLoading(true);

      await Promise.all([
        getProject(),
        getMembers(),
      ]);
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

  const addMember = async () => {
    try {
      if (!memberEmail) {
        alert("Email is required");
        return;
      }

      await axios.post(`/api/projects/${id}/members`, {
        email: memberEmail,
      });

      setMemberEmail("");
      setShowMemberForm(false);

      await getMembers();

      alert("Member added successfully");
    } catch (error) {
      console.error("Failed to add member:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            "Failed to add member"
        );
      }
    }
  };

  const changeMemberRole = async (
    memberId: string,
    newRole: "ADMIN" | "MEMBER"
  ) => {
    try {
      await axios.patch(
        `/api/projects/${id}/members/${memberId}`,
        {
          role: newRole,
        }
      );

      await getMembers();
    } catch (error) {
      console.error("Failed to change member role:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            "Failed to change role"
        );
      }
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const confirmed = confirm(
        "Are you sure you want to remove this member?"
      );

      if (!confirmed) {
        return;
      }

      await axios.delete(
        `/api/projects/${id}/members/${memberId}`
      );

      await getMembers();

      alert("Member removed successfully");
    } catch (error) {
      console.error("Failed to remove member:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            "Failed to remove member"
        );
      }
    }
  };

  useEffect(() => {
    if (id) {
      loadProjectData();
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

  const canManageMembers =
    role === "OWNER" || role === "ADMIN";

  const canChangeRoles =
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
              onClick={() =>
                setShowEditForm(!showEditForm)
              }
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
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Project name"
              className="border p-3 rounded-lg"
            />

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
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
                onClick={() =>
                  setShowEditForm(false)
                }
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            Project Members
          </h2>

          {canManageMembers && (
            <button
              onClick={() =>
                setShowMemberForm(!showMemberForm)
              }
              className="border px-4 py-2 rounded-lg"
            >
              Add Member
            </button>
          )}
        </div>

        {showMemberForm && canManageMembers && (
          <div className="border rounded-xl p-5 mb-6 max-w-xl">
            <h3 className="font-semibold mb-4">
              Add Project Member
            </h3>

            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Member email"
                value={memberEmail}
                onChange={(e) =>
                  setMemberEmail(e.target.value)
                }
                className="border p-3 rounded-lg"
              />

              <div className="flex gap-3">
                <button
                  onClick={addMember}
                  className="border px-4 py-2 rounded-lg"
                >
                  Add
                </button>

                <button
                  onClick={() =>
                    setShowMemberForm(false)
                  }
                  className="border px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {members.length === 0 ? (
          <p className="text-gray-500">
            No members found.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {members.map((member) => (
              <div
                key={member._id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300" />

                  <div>
                    <p className="font-semibold">
                      {member.userId.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {member.userId.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {member.role === "OWNER" ? (
                    <span className="text-sm font-medium">
                      OWNER
                    </span>
                  ) : canChangeRoles ? (
                    <select
                      value={member.role}
                      onChange={(e) =>
                        changeMemberRole(
                          member._id,
                          e.target.value as
                            | "ADMIN"
                            | "MEMBER"
                        )
                      }
                      className="border rounded-lg px-3 py-2"
                    >
                      <option value="MEMBER">
                        MEMBER
                      </option>

                      <option value="ADMIN">
                        ADMIN
                      </option>
                    </select>
                  ) : (
                    <span className="text-sm font-medium">
                      {member.role}
                    </span>
                  )}

                  {member.role !== "OWNER" &&
                    canManageMembers && (
                      <button
                        onClick={() =>
                          removeMember(member._id)
                        }
                        className="border px-3 py-2 rounded-lg"
                      >
                        Remove
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}