// app/admin/orders/[id]/page.tsx
import React from 'react';
import { prisma } from "@/lib/prisma";
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
    },
  });

  if (!order) {
    notFound();
  }

  const schedule = JSON.parse(order.schedule);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Order Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Order ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.id}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">User</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.user.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Plan Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.planName}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Amount</dt>
              <dd className="mt-1 text-sm text-gray-900">{`${order.currency} ${(order.amount / 100).toFixed(2)}`}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.status}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">{format(order.createdAt, 'PPP')}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Itinerary Details</CardTitle>
        </CardHeader>
        <CardContent>
          {schedule.days.map((day: any, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold">Day {index + 1}</h3>
              <ul className="list-disc pl-5">
                {day.items.map((item: any, itemIndex: number) => (
                  <li key={itemIndex} className="text-sm">
                    {item.activityId} - {item.notes}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}