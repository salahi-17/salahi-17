// app/payment-complete/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function PaymentCompletePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const router = useRouter();
  const searchParams = useSearchParams();
  const itineraryId = searchParams.get('itineraryId');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const confirmPayment = async () => {
      if (!itineraryId || !orderId) {
        setStatus('error');
        return;
      }

      try {
        const response = await fetch('/api/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itineraryId, orderId }),
        });

        if (response.ok) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error confirming payment:', error);
        setStatus('error');
      }
    };

    confirmPayment();
  }, [itineraryId, orderId]);

  const handleViewOrder = () => {
    router.push('/profile');
  };

  return (
    <div className="container mx-auto p-4 text-center">
      {status === 'loading' && <p>Processing your payment...</p>}
      {status === 'success' && (
        <>
          <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
          <p className="mb-4">Your order has been confirmed and your itinerary is now available.</p>
          <Button onClick={handleViewOrder}>View My Orders</Button>
        </>
      )}
      {status === 'error' && (
        <>
          <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h1>
          <p className="mb-4">We couldn't confirm your payment. Please check your orders or contact customer support.</p>
          <Button onClick={handleViewOrder}>View My Orders</Button>
        </>
      )}
    </div>
  );
}