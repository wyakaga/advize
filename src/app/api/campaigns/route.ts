import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorized } from "@/lib/session";
import { parseRobustDate } from "@/lib/date";

// GET /api/campaigns — fetch campaigns with pagination
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || "";
  const platform = searchParams.get("platform") || "";
  const skip = (page - 1) * pageSize;

  const where: any = { userId: user.id };
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  if (platform) {
    where.platform = platform;
  }

  const [campaigns, total, aggregate] = await Promise.all([
    prisma.campaign.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      omit: { userId: true },
    }),
    prisma.campaign.count({
      where,
    }),
    prisma.campaign.aggregate({
      where,
      _sum: {
        impressions: true,
        clicks: true,
        conversions: true,
        cost: true,
      },
    }),
  ]);

  return NextResponse.json({
    data: campaigns,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
    totals: {
      impressions: aggregate._sum.impressions || 0,
      clicks: aggregate._sum.clicks || 0,
      conversions: aggregate._sum.conversions || 0,
      cost: Number(aggregate._sum.cost) || 0,
    },
  });
}

// POST /api/campaigns — create one or many campaigns
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const body = await req.json();

  // Support both single campaign and array of campaigns
  const campaignsData = Array.isArray(body) ? body : [body];

  try {
    const created = await prisma.campaign.createMany({
      data: campaignsData.map((c: Record<string, unknown>) => {
        const startDate = parseRobustDate(c.startDate as string);
        const endDate = parseRobustDate(c.endDate as string);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          throw new Error("Invalid date format provided");
        }

        return {
          userId: user.id,
          name: c.name as string,
          platform: c.platform as string,
          impressions: Number(c.impressions),
          clicks: Number(c.clicks),
          conversions: Number(c.conversions),
          cost: Number(c.cost),
          startDate,
          endDate,
        };
      }),
    });

    return NextResponse.json({ count: created.count }, { status: 201 });
  } catch (error: any) {
    console.error("Campaign creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create campaigns" },
      { status: 400 }
    );
  }
}

// DELETE /api/campaigns?id=... — delete a campaign
export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing campaign id" }, { status: 400 });
  }

  // Verify ownership
  const campaign = await prisma.campaign.findFirst({
    where: { id, userId: user.id },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  await prisma.campaign.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}
