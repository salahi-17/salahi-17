import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, startDate, endDate, days } = await req.json();

    const itinerary = await prisma.itinerary.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId: session.user.id,
        days: {
          create: days.map((day: any) => ({
            date: new Date(day.date),
            items: {
              create: day.items.map((item: any) => ({
                activityId: item.activityId,
                order: item.order,
                notes: item.notes
              }))
            }
          }))
        }
      },
      include: {
        days: {
          include: {
            items: {
              include: {
                activity: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(itinerary, { status: 201 });
  } catch (error) {
    console.error("Failed to create itinerary:", error);
    return NextResponse.json({ error: "Failed to create itinerary" }, { status: 500 });
  }
}