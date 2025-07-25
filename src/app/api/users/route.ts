// users/route.ts
import { connectDB } from "@/utils/connectDB";
import { User } from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
  await connectDB();
  const users = await User.find().select("-password"); // Exclude password
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  await connectDB();
  const { name, email, password } = await req.json();

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 409 }
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Exclude password in response
  const { password: _, ...userWithoutPassword } = newUser.toObject();

  return NextResponse.json(userWithoutPassword, { status: 201 });
}
