// app/api/confirm-payment/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { itineraryId, orderId } = await req.json();

    if (!itineraryId || !orderId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify that the order belongs to the user and is in a pending state
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
        status: 'PENDING'
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found or already processed' }, { status: 404 });
    }

    // Here you would typically verify the payment with your payment provider (e.g., Revolut)
    // For this example, we'll assume the payment is successful if we've reached this point

    // Update the order status to COMPLETED
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'COMPLETED' }
    });

    // You might also want to update the itinerary status if necessary

    return NextResponse.json({ message: 'Payment confirmed successfully' });
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 });
  }
}