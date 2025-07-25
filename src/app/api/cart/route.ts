import { connectDB } from "@/utils/connectDB";
import { Cart } from "@/models/cart";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const carts = await Cart.find()
    .populate("userId")
    .populate("items.productId");
  return NextResponse.json(carts);
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  const newCart = await Cart.create(data);
  return NextResponse.json(newCart, { status: 201 });
}
