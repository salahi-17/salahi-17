// app/api/create-order/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const API_URL = process.env.NODE_ENV === 'production' ? 'https://merchant.revolut.com/api/orders' : 'https://sandbox-merchant.revolut.com/api/orders';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, currency, schedule } = await req.json();

    try {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Create the itinerary
        const itinerary = await prisma.itinerary.create({
            data: {
                name: schedule.name,
                startDate: new Date(schedule.startDate),
                endDate: new Date(schedule.endDate),
                userId: user.id,
                days: {
                    create: schedule.days.map((day: any) => ({
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
        });

        // Create Revolut order
        const revolutResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${process.env.REVOLUT_API_KEY}`,
                'Revolut-Api-Version': '2024-05-01'
            },
            body: JSON.stringify({
                amount: amount,
                currency: currency,
                redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?itineraryId=${itinerary.id}`,
                customer: {
                    email: user.email,
                },
                description: `Payment for itinerary ${itinerary.id}`,
                merchant_order_ext_ref: itinerary.id,
                metadata: {
                    itineraryId: itinerary.id,
                },
                merchant_order_data: {
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile/my-orders`,
                },
            }),
        });

        if (!revolutResponse.ok) {
            const errorData = await revolutResponse.json();
            console.error('Revolut API error:', errorData);
            throw new Error(`Failed to create order in Revolut: ${JSON.stringify(errorData)}`);
        }

        const revolutOrder = await revolutResponse.json();

        // Save order in database
        const order = await prisma.order.create({
            data: {
                revolutOrderId: revolutOrder.id,
                amount,
                currency,
                planName: schedule.name,
                schedule: JSON.stringify({ ...schedule, itineraryId: itinerary.id }),
                status: 'PENDING',
                userId: user.id,
            },
        });

        return NextResponse.json({
            orderId: order.id,
            itineraryId: itinerary.id,
            checkoutUrl: revolutOrder.checkout_url,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Failed to create order', details: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'Failed to create order', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
}