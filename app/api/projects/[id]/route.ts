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

export async function PATCH(
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

    if (
      membership.role !== "OWNER" &&
      membership.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { message: "You are not allowed to edit this project" },
        { status: 403 }
      );
    }

    const { name, description } = await request.json();

    if (!name || !description) {
      return NextResponse.json(
        { message: "Name and description are required" },
        { status: 400 }
      );
    }

    const project = await Project.findByIdAndUpdate(
      id,
      {
        name,
        description,
      },
      {
        new: true,
      }
    );

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Project updated successfully",
        project,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update project error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    if (membership.role !== "OWNER") {
      return NextResponse.json(
        { message: "Only the project owner can delete this project" },
        { status: 403 }
      );
    }

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    await ProjectMember.deleteMany({
      projectId: id,
    });

    return NextResponse.json(
      {
        message: "Project deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete project error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}