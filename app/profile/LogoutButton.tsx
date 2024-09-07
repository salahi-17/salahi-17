'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <Button onClick={handleLogout} variant="destructive">
      Logout
    </Button>
  );
}