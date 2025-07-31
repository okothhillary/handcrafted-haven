import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Mock response for demo purposes (no database connection)
    res.status(200).json({
      message: "Demo mode - No database connection",
      collections: ["users", "products", "orders", "carts"],
      note: "This is a mock response for demonstration purposes"
    });
  } catch (error) {
    res.status(500).json({ message: "Test endpoint failed", error });
  }
}
