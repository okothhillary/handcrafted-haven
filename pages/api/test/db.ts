import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/utils/connectDB";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const connection = await connectDB();
    const db = connection.connection.db;

    const collections = await db.listCollections().toArray();

    res.status(200).json({
      message: "Connected successfully",
      collections: collections.map((col: any) => col.name),
    });
  } catch (error) {
    res.status(500).json({ message: "Test endpoint failed", error });
  }
}
