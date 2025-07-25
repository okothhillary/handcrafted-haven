import { connectDB } from "@/utils/connectDB";
import { Order } from "@/models/order";
import "@/models/user";
import "@/models/product"
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const orders = await Order.find()
    .populate("userId")
    .populate("products.productId");

  return NextResponse.json(orders);
}
