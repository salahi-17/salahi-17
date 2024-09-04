import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

interface CheckoutButtonProps {
  totalPrice: number;
  planName: string;
  schedule: Record<string, Record<string, any[]>>;
  startDate: Date;
  endDate: Date;
}

export default function CheckoutButton({ totalPrice, planName, schedule, startDate, endDate }: CheckoutButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const handleCheckout = async () => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to checkout.",
        duration: 3000,
      });
      router.push('/auth/signin');
      return;
    }

    const formattedSchedule = {
      name: planName,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      days: Object.entries(schedule).map(([date, daySchedule]) => ({
        date,
        items: Object.entries(daySchedule).flatMap(([timeSlot, activities]) => 
          activities.map((activity: any, index: number) => ({
            activityId: activity.id,
            order: getOrderForTimeSlot(timeSlot) + index,
            notes: activity.notes || null
          }))
        )
      }))
    };

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(totalPrice * 100), // Convert to cents
          currency: 'USD', // Adjust as needed
          schedule: formattedSchedule,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create order');
      }

      const { orderId, itineraryId, checkoutUrl } = await response.json();

      // Save the orderId and itineraryId in localStorage for later use
      localStorage.setItem('pendingOrderId', orderId);
      localStorage.setItem('currentItineraryId', itineraryId);

      // Redirect to Revolut checkout page
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create order. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  const getOrderForTimeSlot = (timeSlot: string): number => {
    switch (timeSlot) {
      case 'Morning': return 0;
      case 'Afternoon': return 10;
      case 'Evening': return 20;
      case 'Night': return 30;
      default: return 0;
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={totalPrice === 0}>
      Checkout
    </Button>
  );
}