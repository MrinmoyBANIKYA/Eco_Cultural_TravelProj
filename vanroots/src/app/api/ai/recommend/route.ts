import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Groq from "groq-sdk";
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

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
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

    // 4. Call Groq API
    const systemPrompt = `You are VanRoots, a warm and knowledgeable cultural guide for Northeast India. 
Given traveler preferences and community data, recommend the 3 best matching communities.
Respond ONLY with valid JSON in this exact format, no other text:
{
  "recommendations": [
    {
      "communitySlug": "string",
      "matchScore": number,
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

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: "llama-3.3-70b-specdec",
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    });

    const aiResponseText = chatCompletion.choices[0]?.message?.content || "";
    let aiJson;
    try {
      aiJson = JSON.parse(aiResponseText);
    } catch (parseError) {
      console.error("AI response parsing error:", aiResponseText);
      throw new Error("Failed to parse AI response");
    }

    // 5. Enrich recommendations with full community data
    const enrichedRecommendations = aiJson.recommendations.map((rec: any) => {
      const communityData = communities.find(
        (c) => c.slug === rec.communitySlug
      );
      return {
        ...rec,
        community: communityData || null,
      };
    });

    // 6. Save session to RecommendationSession table
    const session = await prisma.recommendationSession.create({
      data: {
        inputParams: travelerProfile as any,
        recommendedIds: enrichedRecommendations
          .filter((r: any) => r.community)
          .map((r: any) => r.community.id),
      },
    });

    // 7. Return results
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
