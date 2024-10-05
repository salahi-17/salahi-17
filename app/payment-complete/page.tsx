// app/payment-complete/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function PaymentCompletePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const router = useRouter();
  const searchParams = useSearchParams();
  const itineraryId = searchParams.get('itineraryId');

  useEffect(() => {
    const confirmPayment = async () => {
      if (!itineraryId) {
        setStatus('error');
        return;
      }

      try {
        const response = await fetch('/api/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itineraryId }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.message === 'Payment confirmed successfully') {
            setStatus('success');
          } else if (data.message === 'Payment is still pending') {
            setStatus('pending');
          } else {
            setStatus('error');
          }
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error confirming payment:', error);
        setStatus('error');
      }
    };

    confirmPayment();
  }, [itineraryId]);

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
      {status === 'pending' && (
        <>
          <h1 className="text-2xl font-bold mb-4">Payment Pending</h1>
          <p className="mb-4">Your payment is still being processed. Please check back later.</p>
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