// app/api/cleanup-orders/route.ts
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { subMinutes } from 'date-fns';

const REVOLUT_API_URL = "https://sandbox-merchant.revolut.com/api/orders";

async function cancelRevolutOrder(revolutOrderId: string) {
  try {
    const response = await fetch(`${REVOLUT_API_URL}/${revolutOrderId}/cancel`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.REVOLUT_API_KEY}`
      }
    });

    if (!response.ok) {
      console.error(`Failed to cancel Revolut order ${revolutOrderId}`);
    }
  } catch (error) {
    console.error('Error cancelling Revolut order:', error);
  }
}

export async function POST() {
  try {
    const tenMinutesAgo = subMinutes(new Date(), 10);

    const expiredOrders = await prisma.order.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: tenMinutesAgo
        }
      }
    });

    for (const order of expiredOrders) {
      // Cancel the order in Revolut
      await cancelRevolutOrder(order.revolutOrderId);

      // Delete the order from our database
      await prisma.order.delete({
        where: { id: order.id }
      });
    }

    return NextResponse.json({ message: `Cleaned up ${expiredOrders.length} expired orders` });
  } catch (error) {
    console.error('Error cleaning up orders:', error);
    return NextResponse.json({ error: 'Failed to clean up orders' }, { status: 500 });
  }
}