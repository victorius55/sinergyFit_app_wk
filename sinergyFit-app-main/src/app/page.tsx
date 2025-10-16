'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // In a real app, you'd check for an auth token here.
      // We'll simulate by always redirecting to login for the demo flow.
      const timer = setTimeout(() => {
        router.replace('/login');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [router, isClient]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-4">
      <Logo className="h-16 w-16 text-primary" />
      <div className="flex items-center gap-2 text-foreground">
        <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-primary"></div>
        <p className="text-lg">Preparing your dashboard...</p>
      </div>
    </div>
  );
}
