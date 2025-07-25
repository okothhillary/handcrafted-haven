import { connectDB } from "@/utils/connectDB";
import { Order } from "@/models/order";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const order = await Order.findById(params.id)
    .populate("userId")
    .populate("products.productId");
  return NextResponse.json(order);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const data = await req.json();
  const updatedOrder = await Order.findByIdAndUpdate(params.id, data, {
    new: true,
  });
  return NextResponse.json(updatedOrder);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Order.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Order deleted" });
}
