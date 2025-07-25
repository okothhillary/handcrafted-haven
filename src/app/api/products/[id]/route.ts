import { connectDB } from "@/utils/connectDB";
import { Product } from "@/models/product";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

// GET /api/products/[id]
export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();

  if (!Types.ObjectId.isValid(params.id)) {
    return NextResponse.json(
      { message: "Invalid Product ID" },
      { status: 400 }
    );
  }

  const product = await Product.findById(params.id);
  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

// PUT /api/products/[id]
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  if (!Types.ObjectId.isValid(params.id)) {
    return NextResponse.json(
      { message: "Invalid Product ID" },
      { status: 400 }
    );
  }

  const data = await req.json();
  const updated = await Product.findByIdAndUpdate(params.id, data, {
    new: true,
  });

  if (!updated) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE /api/products/[id]
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  if (!Types.ObjectId.isValid(params.id)) {
    return NextResponse.json(
      { message: "Invalid Product ID" },
      { status: 400 }
    );
  }

  const deleted = await Product.findByIdAndDelete(params.id);

  if (!deleted) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Product deleted successfully" });
}
