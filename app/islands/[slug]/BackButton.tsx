'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="outline"
      className="mx-auto"
    >
      Back to Islands
    </Button>
  );
};

export default BackButton;