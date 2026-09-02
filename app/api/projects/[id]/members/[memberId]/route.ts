import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDb from "@/lib/db";
import ProjectMember from "@/models/ProjectMember";

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
      memberId: string;
    }>;
  }
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

    const { id, memberId } = await context.params;
    const { role } = await request.json();

    if (!role) {
      return NextResponse.json(
        { message: "Role is required" },
        { status: 400 }
      );
    }

    if (role !== "ADMIN" && role !== "MEMBER") {
      return NextResponse.json(
        { message: "Invalid role" },
        { status: 400 }
      );
    }

    const currentMembership = await ProjectMember.findOne({
      projectId: id,
      userId: session.user.id,
    });

    if (!currentMembership) {
      return NextResponse.json(
        { message: "You do not have access to this project" },
        { status: 403 }
      );
    }

    if (currentMembership.role !== "OWNER") {
      return NextResponse.json(
        { message: "Only the project owner can change roles" },
        { status: 403 }
      );
    }

    const member = await ProjectMember.findOne({
      _id: memberId,
      projectId: id,
    });

    if (!member) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );
    }

    if (member.role === "OWNER") {
      return NextResponse.json(
        { message: "Owner role cannot be changed" },
        { status: 403 }
      );
    }

    member.role = role;

    await member.save();

    return NextResponse.json(
      {
        message: "Member role updated successfully",
        member,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update member role error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{
      id: string;
      memberId: string;
    }>;
  }
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

    const { id, memberId } = await context.params;

    const currentMembership = await ProjectMember.findOne({
      projectId: id,
      userId: session.user.id,
    });

    if (!currentMembership) {
      return NextResponse.json(
        { message: "You do not have access to this project" },
        { status: 403 }
      );
    }

    if (
      currentMembership.role !== "OWNER" &&
      currentMembership.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { message: "You are not allowed to remove members" },
        { status: 403 }
      );
    }

    const memberToRemove = await ProjectMember.findOne({
      _id: memberId,
      projectId: id,
    });

    if (!memberToRemove) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );
    }

    if (memberToRemove.role === "OWNER") {
      return NextResponse.json(
        { message: "Project owner cannot be removed" },
        { status: 403 }
      );
    }

    if (
      currentMembership.role === "ADMIN" &&
      memberToRemove.role === "ADMIN"
    ) {
      return NextResponse.json(
        { message: "Admin cannot remove another admin" },
        { status: 403 }
      );
    }

    await ProjectMember.findByIdAndDelete(memberId);

    return NextResponse.json(
      {
        message: "Member removed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Remove member error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}