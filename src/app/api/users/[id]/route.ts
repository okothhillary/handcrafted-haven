import { connectDB } from "@/utils/connectDB";
import { User } from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { userSchema } from "@/validation/user.schema";

// Helper function to extract params safely
async function getParams(params: Promise<{ id: string }>) {
  return params;
}

// Create an update schema with all fields optional
const updateUserSchema = userSchema.partial();

// GET /api/users/:id
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await getParams(params);
    await connectDB();
    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT /api/users/:id
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await getParams(params);
    await connectDB();
    const body = await req.json();

    // Validate input
    const parseResult = updateUserSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Optional: If password is being updated, hash it
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/:id
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await getParams(params);
    await connectDB();
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
