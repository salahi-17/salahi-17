// app/api/pending-orders/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const REVOLUT_API_URL = "https://sandbox-merchant.revolut.com/api/orders";

async function getRevolutOrderDetails(revolutOrderId: string) {
  try {
    const response = await fetch(`${REVOLUT_API_URL}/${revolutOrderId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.REVOLUT_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order from Revolut');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Revolut order details:', error);
    return null;
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const dbPendingOrders = await prisma.order.findMany({
      where: {
        userId: user.id,
        status: 'PENDING'
      },
      select: {
        id: true,
        revolutOrderId: true,
        planName: true,
        amount: true,
        currency: true,
      },
    });

    const verifiedPendingOrders = await Promise.all(
      dbPendingOrders.map(async (order) => {
        const revolutOrder = await getRevolutOrderDetails(order.revolutOrderId);
        if (revolutOrder && revolutOrder.state === 'pending') {
          return {
            ...order,
            checkoutUrl: revolutOrder.checkout_url,
            state: revolutOrder.state,
          };
        }
        if (revolutOrder && ['completed', 'cancelled'].includes(revolutOrder.state)) {
          // Update order status in our database
          await prisma.order.update({
            where: { id: order.id },
            data: { status: revolutOrder.state.toUpperCase() },
          });
        }
        return null;
      })
    );

    const validPendingOrders = verifiedPendingOrders.filter(Boolean);

    return NextResponse.json(validPendingOrders);
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    return NextResponse.json({ error: 'Failed to fetch pending orders' }, { status: 500 });
  }
}