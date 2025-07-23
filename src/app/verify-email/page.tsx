"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          toast.success('email verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
          toast.error(data.error || 'Verification failed');
        }
      } catch {
        setStatus('error');
        setMessage('an error occurred during verification');
        toast.error('an error occurred during verification');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === 'loading' && <Loader2 className="h-6 w-6 animate-spin text-blue-500" />}
            {status === 'success' && <CheckCircle className="h-6 w-6 text-green-500" />}
            {status === 'error' && <XCircle className="h-6 w-6 text-red-500" />}
            Email Verification
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Verifying your email address...'}
            {status === 'success' && 'Your email has been verified!'}
            {status === 'error' && 'Verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
          
          {status === 'success' && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  Welcome to Pied Paper! You can now sign in and start creating your markdown projects.
                </p>
              </div>
              <Link href="/sign-in">
                <Button className="w-full">
                  Sign In to Your Account
                </Button>
              </Link>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">
                  The verification link may be invalid or expired. Please try signing up again or contact support.
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/sign-up" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Sign Up Again
                  </Button>
                </Link>
                <Link href="/sign-in" className="flex-1">
                  <Button className="w-full">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          )}
          
          {status === 'loading' && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                Please wait while we verify your email address ...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
