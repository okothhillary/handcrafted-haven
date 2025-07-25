import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/app/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("handcrafted-haven");

    const collections = await db.listCollections().toArray();

    res.status(200).json({
      message: "Connected successfully",
      collections: collections.map((col) => col.name),
    });
  } catch (error) {
    res.status(500).json({ message: "Database connection failed", error });
  }
}
