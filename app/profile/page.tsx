// app/profile/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileTabs from "./ProfileTabs";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const itineraries = await prisma.itinerary.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform dates to ISO strings
  const transformedItineraries = itineraries.map(itinerary => ({
    ...itinerary,
    startDate: itinerary.startDate.toISOString(),
    endDate: itinerary.endDate.toISOString(),
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <p className="pb-10">Welcome, {session.user.name || session.user.email}</p>
      <ProfileTabs initialItineraries={transformedItineraries} />
    </div>
  );
}