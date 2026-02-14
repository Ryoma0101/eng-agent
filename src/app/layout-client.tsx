'use client';

import { AuthProvider } from '@/lib/firebase/auth-context';
import { Toaster } from '@/components/ui/sonner';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}
