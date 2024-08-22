// app/api/itineraries/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      include: {
        days: {
          include: {
            items: {
              include: {
                activity: true
              },
              orderBy: {
                order: 'asc'
              }
            }
          },
          orderBy: {
            date: 'asc'
          }
        }
      }
    });

    if (!itinerary) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
    }

    if (itinerary.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error("Failed to fetch itinerary:", error);
    return NextResponse.json({ error: "Failed to fetch itinerary" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const { name, startDate, endDate, days } = await req.json();

    const existingItinerary = await prisma.itinerary.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingItinerary) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
    }

    if (existingItinerary.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete existing days and items
    await prisma.itineraryItem.deleteMany({
      where: { day: { itineraryId: id } }
    });
    await prisma.itineraryDay.deleteMany({
      where: { itineraryId: id }
    });

    // Update itinerary and create new days and items
    const updatedItinerary = await prisma.itinerary.update({
      where: { id },
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
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

    return NextResponse.json(updatedItinerary);
  } catch (error) {
    console.error("Failed to update itinerary:", error);
    return NextResponse.json({ error: "Failed to update itinerary" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!itinerary) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
    }

    if (itinerary.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.itinerary.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Itinerary deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete itinerary:", error);
    return NextResponse.json({ error: "Failed to delete itinerary" }, { status: 500 });
  }
}