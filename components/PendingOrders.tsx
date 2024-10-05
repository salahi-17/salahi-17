// app/components/PendingOrders.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PendingOrder {
  id: string;
  revolutOrderId: string;
  planName: string;
  amount: number;
  currency: string;
  checkoutUrl: string;
  state: string;
}

export default function PendingOrders() {
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const response = await fetch('/api/pending-orders');
      if (!response.ok) {
        throw new Error('Failed to fetch pending orders');
      }
      const data = await response.json();
      setPendingOrders(data);
    } catch (error) {
      console.error('Error fetching pending orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = (checkoutUrl: string) => {
    window.open(checkoutUrl, '_blank');
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      setPendingOrders(pendingOrders.filter(order => order.id !== orderId));
      toast({
        title: "Success",
        description: "Order deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading pending orders...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pending Orders</h2>
      {pendingOrders.length === 0 ? (
        <p>You have no pending orders.</p>
      ) : (
        <ul className="space-y-4">
          {pendingOrders.map((order) => (
            <li key={order.id} className="border p-4 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold">{order.planName}</h3>
              <p className="text-gray-600">Amount: {order.currency} {(order.amount / 100).toFixed(2)}</p>
              <p className="text-gray-600">Status: {order.state}</p>
              <div className="mt-2 space-x-2">
                <Button 
                  onClick={() => handlePayment(order.checkoutUrl)}
                  className="bg-primary hover:bg-primary-dark text-white"
                >
                  Complete Payment
                </Button>
                <Button 
                  onClick={() => handleDeleteOrder(order.id)}
                  variant="destructive"
                >
                  Delete Order
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}