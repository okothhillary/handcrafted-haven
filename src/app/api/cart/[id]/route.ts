import { connectDB } from "@/utils/connectDB";
import { Cart } from "@/models/cart";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const cart = await Cart.findById(params.id)
    .populate("userId")
    .populate("items.productId");
  return NextResponse.json(cart);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const data = await req.json();
  const updatedCart = await Cart.findByIdAndUpdate(params.id, data, {
    new: true,
  });
  return NextResponse.json(updatedCart);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Cart.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Cart deleted" });
}
