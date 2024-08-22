// app/itinerary-creator/page.tsx
import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ClientTripPlanner from './ClientTripPlanner';

export const dynamic = 'force-dynamic';

export default async function ItineraryCreatorPage() {
  const session = await getServerSession(authOptions);
  const activities = await prisma.activity.findMany();
  
  // TypeScript-friendly way to get unique categories
  const categories = activities.reduce<string[]>((acc, activity) => {
    if (!acc.includes(activity.category)) {
      acc.push(activity.category);
    }
    return acc;
  }, []);

  return (
    <ClientTripPlanner 
      initialCityData={activities}
      categories={categories}
      isAuthenticated={!!session}
      userId={session?.user?.id}
    />
  );
}