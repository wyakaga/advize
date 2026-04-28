import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized } from "@/lib/session";

export const dynamic = "force-dynamic";

// GET /api/analysis — list analyses with pagination and search
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || "";
  const skip = (page - 1) * pageSize;

  const where = {
    userId: user.id,
    deletedAt: null,
    ...(search
      ? {
          summary: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {}),
  };

  const [analyses, total] = await Promise.all([
    prisma.analysis.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      select: {
        id: true,
        campaignIds: true,
        summary: true,
        createdAt: true,
      },
    }),
    prisma.analysis.count({ where }),
  ]);

  return NextResponse.json(
    {
      data: analyses,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
