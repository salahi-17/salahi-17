// app/pending-orders/page.tsx
import React from 'react';
import PendingOrders from '@/components/PendingOrders';
export default function PendingOrdersPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Pending Orders</h1>
      <PendingOrders />
    </div>
  );
}