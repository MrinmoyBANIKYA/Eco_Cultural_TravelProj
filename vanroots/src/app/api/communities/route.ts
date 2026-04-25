import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { NERState, ExperienceType } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Filters
    const state = searchParams.get("state") as NERState | null;
    const experienceType = searchParams.get("experienceType") as ExperienceType | null;
    const ilpRequiredStr = searchParams.get("ilpRequired");
    const search = searchParams.get("search");

    const where: any = {};

    if (state) {
      where.state = state;
    }

    if (experienceType) {
      where.experienceTypes = {
        has: experienceType,
      };
    }

    if (ilpRequiredStr !== null) {
      where.ilpRequired = ilpRequiredStr === "true";
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { shortDesc: { contains: search, mode: "insensitive" } },
      ];
    }

    // Database Queries
    const [communities, total] = await Promise.all([
      prisma.community.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          name: true,
          state: true,
          latitude: true,
          longitude: true,
          coverImageUrl: true,
          shortDesc: true,
          experienceTypes: true,
          ilpRequired: true,
          rating: true,
          reviewCount: true,
          featured: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.community.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      communities,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching communities:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
