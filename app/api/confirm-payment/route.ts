// app/api/confirm-payment/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const REVOLUT_API_URL =  
// process.env.NODE_ENV === 'production' ? 'https://merchant.revolut.com/api/orders' :
 'https://sandbox-merchant.revolut.com/api/orders';


async function getRevolutOrderStatus(revolutOrderId: string) {
  try {
    const response = await fetch(`${REVOLUT_API_URL}/${revolutOrderId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.REVOLUT_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order status from Revolut');
    }

    const orderData = await response.json();
    return orderData.state;
  } catch (error) {
    console.error('Error fetching Revolut order status:', error);
    return null;
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { itineraryId } = await req.json();

    if (!itineraryId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the order using the itineraryId
    const order = await prisma.order.findFirst({
      where: {
        userId: user.id,
        status: 'PENDING',
        schedule: {
          contains: itineraryId
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found or already processed' }, { status: 404 });
    }

    // Verify the payment status with Revolut
    const revolutOrderStatus = await getRevolutOrderStatus(order.revolutOrderId);

    if (revolutOrderStatus === 'completed') {
      // Update the order status to COMPLETED
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED' }
      });

      return NextResponse.json({ message: 'Payment confirmed successfully' });
    } else if (revolutOrderStatus === 'failed') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'FAILED' }
      });

      return NextResponse.json({ error: 'Payment failed' }, { status: 400 });
    } else {
      return NextResponse.json({ message: 'Payment is still pending' });
    }

  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json({ error: 'Failed to confirm payment' }, { status: 500 });
  }
}