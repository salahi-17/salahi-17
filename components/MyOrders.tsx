// components/MyOrders.tsx
"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

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
        // Filter for completed (paid) orders only
        const paidOrders = data.filter((order: Order) => order.status.toLowerCase() === 'completed');
        setOrders(paidOrders);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>You have no paid orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">{order.planName}</h3>
              <p>Amount: {order.currency} {(order.amount / 100).toFixed(2)}</p>
              <p>Status: {order.status}</p>
              <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}