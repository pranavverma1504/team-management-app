import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDb from "@/lib/db";
import ProjectMember from "@/models/ProjectMember";
import User from "@/models/User";

export async function POST(
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
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const currentMembership =
      await ProjectMember.findOne({
        projectId: id,
        userId: session.user.id,
      });

    if (!currentMembership) {
      return NextResponse.json(
        {
          message:
            "You do not have access to this project",
        },
        { status: 403 }
      );
    }

    if (
      currentMembership.role !== "OWNER" &&
      currentMembership.role !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          message:
            "You are not allowed to add members",
        },
        { status: 403 }
      );
    }

    const userToAdd = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!userToAdd) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const existingMembership =
      await ProjectMember.findOne({
        projectId: id,
        userId: userToAdd._id,
      });

    if (existingMembership) {
      return NextResponse.json(
        {
          message:
            "User is already a member of this project",
        },
        { status: 400 }
      );
    }

    const member = await ProjectMember.create({
      projectId: id,
      userId: userToAdd._id,
      role: "MEMBER",
    });

    return NextResponse.json(
      {
        message: "Member added successfully",
        member,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add member error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

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

    const currentMembership =
      await ProjectMember.findOne({
        projectId: id,
        userId: session.user.id,
      });

    if (!currentMembership) {
      return NextResponse.json(
        {
          message:
            "You do not have access to this project",
        },
        { status: 403 }
      );
    }

    const members = await ProjectMember.find({
      projectId: id,
    })
      .populate(
        "userId",
        "name email profileImage"
      )
      .sort({ createdAt: 1 });

    return NextResponse.json(
      {
        message: "Members fetched successfully",
        members,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get members error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}