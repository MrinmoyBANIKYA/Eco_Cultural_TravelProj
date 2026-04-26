import { prisma } from "@/lib/db";
import LandingClient from "./LandingClient";

import { Community } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  let communities: Community[] = [];
  try {
    communities = await prisma.community.findMany({
      take: 10,
      orderBy: { featured: 'desc' }
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }

  return <LandingClient communities={communities} />;
}
