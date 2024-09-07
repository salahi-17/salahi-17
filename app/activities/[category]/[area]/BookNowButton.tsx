'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

interface BookNowButtonProps {
  category: string;
  activityName: string;
}

export default function BookNowButton({ category, activityName }: BookNowButtonProps) {
  const router = useRouter();

  const handleBookNow = () => {
    router.push(`/itinerary-creator?category=${encodeURIComponent(category)}&activity=${encodeURIComponent(activityName)}`);
  };

  return (
    <Button 
      className="bg-[#4CAF50] hover:bg-[#45a049] text-white w-full"
      onClick={handleBookNow}
    >
      BOOK NOW
    </Button>
  );
}