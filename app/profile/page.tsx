// app/profile/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileTabs from "./ProfileTabs";
import LogoutButton from "./LogoutButton";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return <div>User not found.</div>;
  }

  const initialItineraries = await prisma.itinerary.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <LogoutButton />
      </div>
      <p className="mb-8">Welcome, {session.user.name || session.user.email}</p>
      <ProfileTabs initialItineraries={initialItineraries} />
    </div>
  );
}