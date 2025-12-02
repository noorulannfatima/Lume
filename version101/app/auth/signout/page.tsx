'use client';

import { signOut } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Logo from '@/public/LUME.png';
import Link from 'next/link';
import { useEffect } from 'react';

export default function SignOutPage() {
  useEffect(() => {
    // Auto sign out when landing on this page
    signOut({ callbackUrl: '/' });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4 text-center">
        <div className="flex flex-col items-center space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={Logo} alt="Lume Logo" width={48} height={48} />
            <h1 className="text-3xl font-bold text-primary">Lume</h1>
          </Link>
          <h2 className="text-2xl font-semibold">Signing you out...</h2>
          <p className="text-muted-foreground text-sm">
            Please wait while we sign you out of your account.
          </p>
        </div>
      </div>
    </div>
  );
}
