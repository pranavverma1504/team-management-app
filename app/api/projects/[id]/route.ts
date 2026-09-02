import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDb from "@/lib/db";
import Project from "@/models/project";
import ProjectMember from "@/models/ProjectMember";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDb();

    const { id } = await context.params;

    const membership = await ProjectMember.findOne({
      projectId: id,
      userId: session.user.id,
    });

    if (!membership) {
      return NextResponse.json(
        { message: "You do not have access to this project" },
        { status: 403 }
      );
    }

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Project fetched successfully",
        project,
        role: membership.role,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get project error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}