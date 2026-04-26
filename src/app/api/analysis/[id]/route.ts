import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized } from "@/lib/session";

// GET /api/analysis/[id] — get single analysis details
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const analysis = await prisma.analysis.findFirst({
    where: { id, userId: user.id },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  // Also fetch the campaign names for display
  const campaigns = await prisma.campaign.findMany({
    where: { id: { in: analysis.campaignIds } },
    select: { id: true, name: true, platform: true },
  });

  return NextResponse.json({ ...analysis, campaigns });
}

// DELETE /api/analysis/[id] — delete an analysis
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const analysis = await prisma.analysis.findFirst({
    where: { id, userId: user.id },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  await prisma.analysis.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}