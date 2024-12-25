// components/CheckoutButton.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import CheckoutAuthDialog from '@/components/CheckoutAuthDialog';

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
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const handleCheckout = async (guestEmail?: string, guestName?: string) => {
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
          amount: Math.round(totalPrice * 100),
          currency: 'USD',
          schedule: formattedSchedule,
          guestEmail,
          guestName // Add this for guest checkout
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create order');
      }

      const { orderId, itineraryId, checkoutUrl } = await response.json();
      localStorage.setItem('pendingOrderId', orderId);
      localStorage.setItem('currentItineraryId', itineraryId);
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

  const handleClick = () => {
    if (session) {
      handleCheckout();
    } else {
      setIsAuthDialogOpen(true);
    }
  };

  return (
    <>
      <Button onClick={handleClick} disabled={totalPrice === 0}>
        Checkout
      </Button>
      <CheckoutAuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
        onGuestCheckout={(email, name) => handleCheckout(email, name)}
      />
    </>
  );
}