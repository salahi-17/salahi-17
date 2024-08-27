// app/admin/withAdminAuth.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AdminComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
      if (status === 'unauthenticated') {
        router.push('/auth/signin');
      } else if (status === 'authenticated') {
        fetch('/api/auth/is-admin')
          .then(res => res.json())
          .then(data => {
            if (data.isAdmin) {
              setIsAdmin(true);
            } else {
              router.push('/');
            }
          })
          .catch(() => router.push('/'));
      }
    }, [status, router]);

    if (status === 'loading' || !isAdmin) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
}