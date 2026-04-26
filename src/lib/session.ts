import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user || !(session.user as Record<string, unknown>).id) {
    return null;
  }
  return {
    id: (session.user as Record<string, unknown>).id as string,
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
  };
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
