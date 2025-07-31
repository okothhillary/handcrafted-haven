// users/route.ts
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'users.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(fileContents);
    // Exclude passwords for security
    const safeUsers = users.map((user: any) => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error('Error reading users:', error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return NextResponse.json(
    { message: "POST not implemented for JSON file storage" },
    { status: 501 }
  );
}
