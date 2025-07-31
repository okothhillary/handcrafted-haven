import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

// GET /api/products
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'products.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(fileContents);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error reading products:', error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Not implemented for JSON file approach
export async function POST(req: Request) {
  return NextResponse.json(
    { message: "POST not implemented for JSON file storage" },
    { status: 501 }
  );
}
