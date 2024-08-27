// app/my-orders/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  revolutOrderId: string;
  amount: number;
  currency: string;
  planName: string;
  status: string;
  createdAt: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/my-orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleViewItinerary = (orderId: string) => {
    // Implement the logic to view the itinerary
    console.log(`View itinerary for order ${orderId}`);
  };

  const handleCompletePayment = (revolutOrderId: string) => {
    // Implement the logic to complete the payment
    window.location.href = `https://sandbox-pay.revolut.com/payment/${revolutOrderId}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{order.planName}</h2>
                <Badge className={`${getStatusColor(order.status)} text-white`}>
                  {order.status}
                </Badge>
              </div>
              <p>Amount: {order.currency} {(order.amount / 100).toFixed(2)}</p>
              <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <div className="mt-4 space-x-2">
                <Button onClick={() => handleViewItinerary(order.id)}>
                  View Itinerary
                </Button>
                {order.status.toLowerCase() === 'pending' && (
                  <Button onClick={() => handleCompletePayment(order.revolutOrderId)}>
                    Complete Payment
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}