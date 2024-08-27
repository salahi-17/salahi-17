// app/admin/orders/page.tsx
import React from 'react';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return <div>Access Denied</div>;
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Admin: Order Management</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Order ID</th>
            <th className="py-2 px-4 border-b">User</th>
            <th className="py-2 px-4 border-b">Plan Name</th>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="py-2 px-4 border-b">{order.id}</td>
              <td className="py-2 px-4 border-b">{order.user.email}</td>
              <td className="py-2 px-4 border-b">{order.planName}</td>
              <td className="py-2 px-4 border-b">{`${order.currency} ${(order.amount / 100).toFixed(2)}`}</td>
              <td className="py-2 px-4 border-b">{order.status}</td>
              <td className="py-2 px-4 border-b">{format(order.createdAt, 'PPP')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}