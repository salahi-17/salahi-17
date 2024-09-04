// app/admin/orders/[id]/page.tsx
import React from 'react';
import { prisma } from "@/lib/prisma";
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface Order extends Prisma.OrderGetPayload<{
  include: { user: true }
}> {}

interface ScheduleItem {
  activityId: string;
  order: number;
  notes: string | null;
}

interface ScheduleDay {
  date: string;
  items: ScheduleItem[];
}

interface Schedule {
  name: string;
  startDate: string;
  endDate: string;
  days: ScheduleDay[];
  itineraryId: string;
}

interface Activity {
  id: string;
  name: string;
  location: string;
  description: string;
}

export default async function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
  let order: Order | null;
  try {
    order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: true,
      },
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order');
  }

  if (!order) {
    notFound();
  }

  let schedule: Schedule | null = null;
  try {
    schedule = order.schedule ? JSON.parse(order.schedule) as Schedule : null;
  } catch (error) {
    console.error('Error parsing schedule:', error);
  }

  let activitiesMap = new Map<string, Activity>();
  if (schedule && schedule.days) {
    const activityIds = schedule.days.flatMap(day => day.items.map(item => item.activityId));
    const activities = await prisma.activity.findMany({
      where: {
        id: {
          in: activityIds
        }
      }
    });
    activitiesMap = new Map(activities.map(activity => [activity.id, activity]));
  }

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

      {schedule && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Itinerary Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{schedule.name || 'N/A'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Itinerary ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{schedule.itineraryId}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{schedule.startDate}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">End Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{schedule.endDate}</dd>
              </div>
            </dl>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Daily Schedule</h3>
              {schedule.days.map((day, index) => (
                <div key={index} className="mt-4">
                  <h4 className="text-md font-medium text-gray-700">Day {index + 1} - {day.date}</h4>
                  <ul className="mt-2 space-y-2">
                    {day.items.map((item, itemIndex) => {
                      const activity = activitiesMap.get(item.activityId);
                      return (
                        <li key={itemIndex} className="text-sm text-gray-600">
                          <span className="font-medium">{activity ? activity.name : 'Unknown Activity'}</span>
                          {activity && (
                            <>
                              <br />
                              Location: {activity.location}
                              <br />
                              Description: {activity.description}
                            </>
                          )}
                          {item.notes && (
                            <>
                              <br />
                              Notes: {item.notes}
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}