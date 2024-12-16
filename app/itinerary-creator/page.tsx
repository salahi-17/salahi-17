// app/itinerary-creator/page.tsx
import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ClientTripPlanner from './ClientTripPlanner';

export const dynamic = 'force-dynamic';

export default async function ItineraryCreatorPage() {
  const session = await getServerSession(authOptions);
  
  // Fetch activities with related images
  const activities = await prisma.activity.findMany({
    include: {
      images: true 
    }
  });
  // Transform activities to convert Decimal to number and format images
  const transformedActivities = activities.map(activity => ({
    ...activity,
    rating: activity.rating ? parseFloat(activity.rating.toString()) : null,
    additionalImages: activity.images.map(img => img.url) // Extract image URLs
  }));

  // TypeScript-friendly way to get unique categories
  const categories = transformedActivities.reduce<string[]>((acc, activity) => {
    if (!acc.includes(activity.category)) {
      acc.push(activity.category);
    }
    return acc;
  }, []);

  return (
    <ClientTripPlanner
      initialCityData={transformedActivities}
      categories={categories}
      isAuthenticated={!!session}
      userId={session?.user?.id}
    />
  );
}