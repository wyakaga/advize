import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const googleId = searchParams.get("googleId");

    if (!googleId) {
      return NextResponse.json({ error: "Missing googleId parameter" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { googleId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: { id: dbUser.id } });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}