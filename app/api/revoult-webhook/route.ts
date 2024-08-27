// app/api/revolut-webhook/route.ts
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const webhookSecret = process.env.REVOLUT_WEBHOOK_SECRET;
  const revolutSignature = req.headers.get('Revolut-Signature');

  if (!revolutSignature) {
    return NextResponse.json({ error: 'Missing Revolut signature' }, { status: 400 });
  }

  // TODO: Verify the Revolut signature here

  const payload = await req.json();

  try {
    if (payload.event === 'ORDER_COMPLETED') {
      const order = await prisma.order.findUnique({
        where: { revolutOrderId: payload.order_id },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'COMPLETED' },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}