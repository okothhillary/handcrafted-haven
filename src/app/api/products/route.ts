import { NextResponse } from "next/server";

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
  try {
    await connectDB();
    const data = await req.json();

    // Basic validation
    if (!data.name || !data.price) {
      return NextResponse.json(
        { message: "Name and price are required" },
        { status: 400 }
      );
    }

    const newProduct = await Product.create(data);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}
