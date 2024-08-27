// app/api/pending-orders/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const API_URL = process.env.NODE_ENV === 'production' ? 'https://merchant.revolut.com/api/orders' : 'https://sandbox-merchant.revolut.com/api/orders';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pendingOrders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        status: 'PENDING',
      },
      select: {
        id: true,
        planName: true,
        amount: true,
        currency: true,
        revolutOrderId: true,
      },
    });

    // Fetch checkout URLs for each order
    const ordersWithCheckoutUrls = await Promise.all(
      pendingOrders.map(async (order) => {
        const revolutResponse = await fetch(`${API_URL}/${order.revolutOrderId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.REVOLUT_API_KEY}`,
          },
        });

        if (revolutResponse.ok) {
          const revolutOrder = await revolutResponse.json();
          return {
            ...order,
            checkoutUrl: revolutOrder.checkout_url,
          };
        }

        return order;
      })
    );

    return NextResponse.json(ordersWithCheckoutUrls);
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    return NextResponse.json({ error: 'Failed to fetch pending orders' }, { status: 500 });
  }
}