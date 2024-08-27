// app/components/PendingOrders.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PendingOrder {
  id: string;
  planName: string;
  amount: number;
  currency: string;
  checkoutUrl: string;
}

export default function PendingOrders() {
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      fetchPendingOrders();
    }
  }, [session]);

  const fetchPendingOrders = async () => {
    try {
      const response = await fetch('/api/pending-orders');
      if (!response.ok) {
        throw new Error('Failed to fetch pending orders');
      }
      const orders = await response.json();
      setPendingOrders(orders);
    } catch (error) {
      console.error('Error fetching pending orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending orders. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  const handlePayment = (checkoutUrl: string) => {
    window.location.href = checkoutUrl;
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Pending Orders</h1>
      {pendingOrders.length === 0 ? (
        <p>You have no pending orders.</p>
      ) : (
        <ul className="space-y-4">
          {pendingOrders.map((order) => (
            <li key={order.id} className="border p-4 rounded-md">
              <h2 className="text-xl font-semibold">{order.planName}</h2>
              <p>Amount: {order.currency} {(order.amount / 100).toFixed(2)}</p>
              <Button onClick={() => handlePayment(order.checkoutUrl)} className="mt-2">
                Complete Payment
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}