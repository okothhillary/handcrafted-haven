import { connectDB } from "@/utils/connectDB";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "DB connected successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to connect to DB", error },
      { status: 500 }
    );
  }
}
