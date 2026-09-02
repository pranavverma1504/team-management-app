import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDb from "@/lib/db";
import Project from "@/models/project";
import ProjectMember from "@/models/ProjectMember";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDb();

    const { name, description } = await request.json();

    if (!name || !description) {
      return NextResponse.json(
        { message: "Name and description are required" },
        { status: 400 }
      );
    }

    const project = await Project.create({
      name,
      description,
      ownerId: session.user.id,
    });

    await ProjectMember.create({
      projectId: project._id,
      userId: session.user.id,
      role: "OWNER",
    });

    return NextResponse.json(
      {
        message: "Project created successfully",
        project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create project error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDb();

    const memberships = await ProjectMember.find({
      userId: session.user.id,
    });

    const projectIds = memberships.map(
      (membership) => membership.projectId
    );

    const projects = await Project.find({
      _id: { $in: projectIds },
    }).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "Projects fetched successfully",
        projects,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get projects error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}