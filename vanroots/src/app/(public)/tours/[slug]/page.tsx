import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import TourClient from "./TourClient";

import { Community } from "@prisma/client";

interface TourPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TourPage({ params }: TourPageProps) {
  const { slug } = await params;
  
  let community: Community | null = null;
  try {
    community = await prisma.community.findUnique({
      where: { slug: slug },
    });
  } catch (error) {
    console.error("Database connection failed for TourPage:", error);
  }

  if (!community) {
    // If we don't have this community in the DB or DB fails, fallback to a placeholder for the demo
    const placeholderCommunity = {
      name: slug.replace("-", " "),
      state: "NORTHEAST",
      coverImageUrl: "https://images.unsplash.com/photo-1540316377017-f58c70830424?q=80&w=2000&auto=format&fit=crop"
    };
    return <TourClient community={placeholderCommunity} />;
  }

  return <TourClient community={community} />;
}
