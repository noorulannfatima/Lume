'use client';

import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Logo from '@/public/LUME.png';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from "react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'You do not have permission to sign in.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'EmailCreateAccount':
      case 'Callback':
        return 'There was an error during the authentication process.';
      case 'OAuthAccountNotLinked':
        return 'This email is already associated with another account.';
      case 'EmailSignin':
        return 'The email could not be sent.';
      case 'CredentialsSignin':
        return 'Invalid email or password.';
      case 'SessionRequired':
        return 'Please sign in to access this page.';
      default:
        return 'An unexpected error occurred during authentication.';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex flex-col items-center space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={Logo} alt="Lume Logo" width={48} height={48} />
            <h1 className="text-3xl font-bold text-primary">Lume</h1>
          </Link>
          <h2 className="text-2xl font-semibold text-destructive">Authentication Error</h2>
          <div className="bg-destructive/10 text-destructive rounded-md p-4 text-sm text-center">
            {getErrorMessage(error)}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Button asChild className="w-full">
              <Link href="/auth/signin">Try Again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
