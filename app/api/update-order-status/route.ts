// app/api/update-order-status/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const itineraryId = searchParams.get('itineraryId');

  if (!itineraryId) {
    return NextResponse.json({ error: 'Itinerary ID is required' }, { status: 400 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        status: 'PENDING',
      },
    });

    const order = orders.find(o => {
      const schedule = JSON.parse(o.schedule);
      return schedule.itineraryId === itineraryId;
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'COMPLETED' },
    });

    return NextResponse.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}