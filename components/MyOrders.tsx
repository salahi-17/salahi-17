// components/MyOrders.tsx
"use client";

import React, { useEffect, useState } from 'react';
import CommonCard from '@/components/CommonCard';

interface Order {
  id: string;
  revolutOrderId: string;
  amount: number;
  currency: string;
  planName: string;
  status: string;
  createdAt: string;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/my-orders');
      if (response.ok) {
        const data = await response.json();
        // Filter for completed orders only
        const completedOrders = data.filter((order: Order) => order.status.toLowerCase() === 'completed');
        setOrders(completedOrders);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>You have no completed orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <CommonCard
                title={order.planName}
                subtitle={`Order ID: ${order.id}`}
                details={[
                  { label: "Amount", value: `${order.currency} ${(order.amount / 100).toFixed(2)}` },
                  { label: "Order Date", value: new Date(order.createdAt).toLocaleDateString() }
                ]}
                status={order.status}
                actionLabel="View Itinerary"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}