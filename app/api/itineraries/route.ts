import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { name, startDate, endDate, days, email } = await req.json();

    let userId: string;

    if (session) {
      userId = session.user.id;
    } else if (email) {
      const guestUser = await prisma.user.upsert({
        where: { email },
        create: {
          email,
          isGuest: true
        },  
        update: {}
      });
      userId = guestUser.id;
    } else {
      return NextResponse.json({ error: "Email required for guest users" }, { status: 400 });
    }

    const itinerary = await prisma.itinerary.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
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
        },
        user: true
      }
    });

    // Sort the data after fetching
    const sortedItinerary = {
      ...itinerary,
      days: itinerary.days
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(day => ({
          ...day,
          items: day.items.sort((a, b) => a.order - b.order)
        }))
    };

    return NextResponse.json(sortedItinerary, { status: 201 });
  } catch (error) {
    console.error("Failed to create itinerary:", error);
    return NextResponse.json({ error: "Failed to create itinerary" }, { status: 500 });
  }
}