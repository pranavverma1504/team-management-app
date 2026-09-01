import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDb();

    const users = await User.find().select("-password");

    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
      users,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 }
    );
  }
}