import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAiClient } from "@/lib/ai-client";
import { getSessionUser, unauthorized } from "@/lib/session";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { campaignIds } = await req.json();

  if (!Array.isArray(campaignIds) || campaignIds.length === 0) {
    return NextResponse.json(
      { error: "Please select at least one campaign" },
      { status: 400 },
    );
  }

  // Fetch campaigns owned by user
  const campaigns = await prisma.campaign.findMany({
    where: {
      id: { in: campaignIds },
      userId: user.id,
    },
  });

  if (campaigns.length === 0) {
    return NextResponse.json(
      { error: "No valid campaigns found" },
      { status: 404 },
    );
  }

  // Build the prompt
  const campaignSummaries = campaigns
    .map(
      (c) =>
        `- "${c.name}" (${c.platform}): ${c.impressions.toLocaleString()} impressions, ${c.clicks.toLocaleString()} clicks, ${c.conversions.toLocaleString()} conversions, $${c.cost.toFixed(2)} spent, from ${c.startDate.toISOString().split("T")[0]} to ${c.endDate.toISOString().split("T")[0]}`,
    )
    .join("\n");

  const prompt = `You are an expert digital advertising analyst. Analyze the following ad campaigns and return a JSON object with your analysis.

Campaigns:
${campaignSummaries}

Calculated metrics for reference:
- CTR = (clicks / impressions) * 100
- CPC = cost / clicks
- CPA = cost / conversions
- ROAS = (conversions * $30 assumed value) / cost

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "summary": "A concise 2-3 sentence overview of overall cross-platform performance.",
  "underperforming_campaigns": ["[Campaign Name] ([Platform]) - [Brief explanation of issue with specific metric evidence]"],
  "optimization_suggestions": ["[Category]: [Highly specific, data-driven recommendation] -> [Expected impact]"],
  "prioritized_actions": ["Step 1 to execute today", "Step 2 to execute today", "Step 3 to execute today"]
}`;

  try {
    const completion = await getAiClient().chat.completions.create({
      model: "qwen3.6-flash",
      messages: [
        {
          role: "system",
          content: `You are a Lead Performance Marketing Strategist with expert-level media buying experience across Meta (Facebook/Instagram), Google Ads, TikTok, and LinkedIn campaigns.
          Your objective is to analyze cross-channel campaign performance data provided by the user and deliver highly specific, actionable, data-driven optimization recommendations aimed at maximizing ROAS and minimizing CPA.
          CRITICAL INSTRUCTION: Always respond in valid JSON format only. Do not include any explanatory text outside the JSON object.
          Your analysis must be specific, practical, and focused on improving ROI. Avoid generic advice like "improve ad creatives" without context.
          Use clear, professional English. Be direct and confident.`,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    const rawResponse = completion.choices[0]?.message?.content ?? "{}";

    // Parse the AI response
    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch {
      // Try to extract JSON from the response if wrapped in markdown
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      parsed = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : {
            summary: "Analysis completed but response format was unexpected.",
            underperforming_campaigns: [],
            optimization_suggestions: [
              "Review your campaigns manually for now.",
            ],
            prioritized_actions: ["Retry the analysis."],
          };
    }

    // Save to database
    const analysis = await prisma.analysis.create({
      data: {
        userId: user.id,
        campaignIds: campaigns.map((c) => c.id),
        summary: parsed.summary ?? "",
        fullResponse: rawResponse,
        suggestions: parsed,
      },
    });

    return NextResponse.json({ analysisId: analysis.id });
  } catch (error) {
    console.error("AI analysis failed:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 },
    );
  }
}
