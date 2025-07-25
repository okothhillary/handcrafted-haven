import { connectDB } from "@/utils/connectDB";
import { Cart } from "@/models/cart";
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

// Helper function to extract params safely
async function getParams(params: Promise<{ id: string }>) {
  return params;
}

// GET /api/carts/:id
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await getParams(params);

    // Validate cart ID
    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid cart ID" }, { status: 400 });
    }

    await connectDB();
    const cart = await Cart.findById(id)
      .populate("userId")
      .populate("items.productId");

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// PUT /api/carts/:id
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await getParams(params);

    // Validate cart ID
    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid cart ID" }, { status: 400 });
    }

    await connectDB();
    const data = await req.json();
    const updatedCart = await Cart.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedCart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCart);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update cart" },
      { status: 500 }
    );
  }
}

// DELETE /api/carts/:id
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await getParams(params);

    // Validate cart ID
    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid cart ID" }, { status: 400 });
    }

    await connectDB();
    const deleted = await Cart.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Cart deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete cart" },
      { status: 500 }
    );
  }
}