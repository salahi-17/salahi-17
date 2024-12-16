import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
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

    if (!itinerary) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
    }

    if (session) {
      if (itinerary.userId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    } else if (!itinerary.user.isGuest) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    return NextResponse.json(sortedItinerary);
  } catch (error) {
    console.error("Failed to fetch itinerary:", error);
    return NextResponse.json({ error: "Failed to fetch itinerary" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    const { name, startDate, endDate, days, email } = await req.json();

    const existingItinerary = await prisma.itinerary.findUnique({
      where: { id },
      include: {
        user: true
      }
    });

    if (!existingItinerary) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
    }

    if (session) {
      if (existingItinerary.userId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    } else {
      if (!existingItinerary.user.isGuest || existingItinerary.user.email !== email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    await prisma.itineraryItem.deleteMany({
      where: { day: { itineraryId: id } }
    });
    await prisma.itineraryDay.deleteMany({
      where: { itineraryId: id }
    });

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
        },
        user: true
      }
    });

    // Sort the data after fetching
    const sortedItinerary = {
      ...updatedItinerary,
      days: updatedItinerary.days
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(day => ({
          ...day,
          items: day.items.sort((a, b) => a.order - b.order)
        }))
    };

    return NextResponse.json(sortedItinerary);
  } catch (error) {
    console.error("Failed to update itinerary:", error);
    return NextResponse.json({ error: "Failed to update itinerary" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    const email = req.headers.get('x-guest-email');

    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      include: {
        user: true
      }
    });

    if (!itinerary) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
    }

    if (session) {
      if (itinerary.userId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    } else {
      if (!itinerary.user.isGuest || itinerary.user.email !== email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    await prisma.itinerary.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    console.error("Failed to delete itinerary:", error);
    return NextResponse.json({ error: "Failed to delete itinerary" }, { status: 500 });
  }
}