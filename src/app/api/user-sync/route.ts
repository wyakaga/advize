import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { googleId, email, name, avatar } = body;

    if (!googleId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const dbUser = await prisma.user.upsert({
      where: { googleId },
      update: {
        name: name ?? undefined,
        avatar: avatar ?? undefined,
        email,
      },
      create: {
        email,
        name: name ?? null,
        avatar: avatar ?? null,
        googleId,
      },
    });

    return NextResponse.json({ success: true, user: { id: dbUser.id } });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}