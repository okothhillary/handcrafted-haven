import { connectDB } from "@/utils/connectDB";
import { Order } from "@/models/order";
import "@/models/user";
import "@/models/product"
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";



export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Validate required fields (e.g., userId, products)
    if (!data.userId || !Array.isArray(data.products) || data.products.length === 0) {
      return NextResponse.json(
        { message: "userId and products are required" },
        { status: 400 }
      );
    }

    // Validate userId
    if (!isValidObjectId(data.userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    // Validate product IDs
    for (const item of data.products) {
      if (!isValidObjectId(item.productId)) {
        return NextResponse.json(
          { message: `Invalid product ID: ${item.productId}` },
          { status: 400 }
        );
      }
    }

    const order = await Order.create(data);
    const populatedOrder = await Order.findById(order._id)
      .populate("userId")
      .populate("products.productId");

    return NextResponse.json(populatedOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectDB();

  const orders = await Order.find()
    .populate("userId")
    .populate("products.productId");

  return NextResponse.json(orders);
}
