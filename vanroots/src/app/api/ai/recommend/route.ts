import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import prisma from "@/lib/db";

// Zod schema for request validation
const recommendSchema = z.object({
  interests: z.array(z.string()),
  travelDates: z.object({
    from: z.string(),
    to: z.string(),
  }),
  groupType: z.enum(["solo", "couple", "family", "friends", "research"]),
  groupSize: z.number(),
  physicalLevel: z.enum(["low", "medium", "high"]),
  ilpOk: z.boolean(),
  preferredStates: z.array(z.string()).optional(),
});

type TravelerProfile = z.infer<typeof recommendSchema>;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    // 1. Validate request body
    const body = await request.json();
    const validation = recommendSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.format() },
        { status: 400 }
      );
    }

    const travelerProfile = validation.data;

    // 2. Fetch top 20 communities from DB
    // Logic: featured first, then by rating
    const communities = await prisma.community.findMany({
      take: 20,
      orderBy: [{ featured: "desc" }, { rating: "desc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        state: true,
        shortDesc: true,
        experienceTypes: true,
        ilpRequired: true,
        rating: true,
        coverImageUrl: true,
      },
    });

    // 3. Build context string for AI
    const contextArray = communities.map((c) => ({
      slug: c.slug,
      name: c.name,
      state: c.state,
      description: c.shortDesc,
      experiences: c.experienceTypes,
      ilpRequired: c.ilpRequired,
      rating: c.rating,
    }));

    // 4. Call Anthropic Claude API
    const systemPrompt = `You are VanRoots, a warm and knowledgeable cultural guide for Northeast India. 
Given traveler preferences and community data, recommend the 3 best matching communities.
Respond ONLY with valid JSON in this exact format, no other text:
{
  "recommendations": [
    {
      "communitySlug": "string",
      "matchScore": "number (0-100)",
      "whyThisMatch": "string (2 sentences, warm tone)",
      "bestTimeToVisit": "string",
      "mustDo": "string"
    }
  ],
  "travelTip": "string"
}`;

    const userMessage = JSON.stringify({
      travelerProfile,
      communities: contextArray,
    });

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    // 5. Parse response
    const aiResponseText =
      msg.content[0].type === "text" ? msg.content[0].text : "";
    let aiJson;
    try {
      aiJson = JSON.parse(aiResponseText);
    } catch (parseError) {
      console.error("AI response parsing error:", aiResponseText);
      throw new Error("Failed to parse AI response");
    }

    // 6. Enrich recommendations with full community data
    const enrichedRecommendations = aiJson.recommendations.map((rec: any) => {
      const communityData = communities.find(
        (c) => c.slug === rec.communitySlug
      );
      return {
        ...rec,
        community: communityData || null,
      };
    });

    // 7. Save session to RecommendationSession table
    const session = await prisma.recommendationSession.create({
      data: {
        inputParams: travelerProfile as any,
        recommendedIds: enrichedRecommendations
          .filter((r: any) => r.community)
          .map((r: any) => r.community.id),
        // userId: session?.user?.id, // Logic for authenticated user can be added later
      },
    });

    // 8. Return results
    return NextResponse.json({
      recommendations: enrichedRecommendations,
      travelTip: aiJson.travelTip,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
