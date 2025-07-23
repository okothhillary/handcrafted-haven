import { connectDB } from "@/utils/connectDB";
import { Order } from "@/models/order";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const orders = await Order.find()
    .populate("userId")
    .populate("products.productId");
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  const newOrder = await Order.create(data);
  return NextResponse.json(newOrder, { status: 201 });
}
