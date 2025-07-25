"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";

export default function VerifyEmailComponent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'code-input'>('loading');
  const [message, setMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  const verifyWithToken = useCallback(async (verificationToken: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        toast.success('Email verified successfully!');
      } else {
        // if token verification fails, show code input if we have email
        if (emailParam) {
          setStatus('code-input');
          setMessage(`Enter the verification code sent to ${emailParam}`);
        } else {
          setStatus('error');
          setMessage(data.error || 'verification failed');
          toast.error(data.error || 'verification failed');
        }
      }
    } catch {
      setStatus('error');
      setMessage('an error occurred during verification');
      toast.error('an error occurred during verification');
    }
  }, [emailParam]);

  useEffect(() => {
    if (token) {
      // if token is provided, try to verify with token first
      verifyWithToken(token);
    } else if (emailParam) {
      // if only email is provided, show code input
      setStatus('code-input');
      setMessage(`enter the verification code sent to ${emailParam}`);
    } else {
      setStatus('error');
      setMessage('invalid verification link. please check your email for the correct link.');
    }
  }, [token, emailParam, verifyWithToken]);

  const verifyWithCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('please enter a valid 6-digit code');
      return;
    }

    if (!emailParam) {
      toast.error('email parameter is missing');
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: verificationCode,
          email: emailParam 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        toast.success('email verified successfully!');
      } else {
        setMessage(data.error || 'invalid verification code');
        toast.error(data.error || 'invalid verification code');
      }
    } catch {
      setMessage('an error occurred during verification');
      toast.error('an error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  };

  const resendCode = async () => {
    if (!emailParam) {
      toast.error('email parameter is missing');
      return;
    }

    setIsResending(true);

    try {
      const response = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailParam }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('new verification code sent!');
        setVerificationCode('');
      } else {
        toast.error(data.error || 'failed to resend code');
      }
    } catch {
      toast.error('an error occurred while resending code');
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && verificationCode.length === 6) {
      verifyWithCode();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === 'loading' && <Loader2 className="h-6 w-6 animate-spin text-blue-500" />}
            {status === 'success' && <CheckCircle className="h-6 w-6 text-green-500" />}
            {status === 'error' && <XCircle className="h-6 w-6 text-red-500" />}
            {status === 'code-input' && <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">#</div>}
            Email Verification
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Verifying your email address...'}
            {status === 'success' && 'Your email has been verified!'}
            {status === 'error' && 'Verification failed'}
            {status === 'code-input' && 'Enter your verification code'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            {message}
          </p>

          {status === 'code-input' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  onKeyPress={handleKeyPress}
                  className="text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit code from your email
                </p>
              </div>
              
              <Button 
                onClick={verifyWithCode} 
                disabled={verificationCode.length !== 6 || isVerifying}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying ...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>

              <Button 
                variant="outline" 
                onClick={resendCode}
                disabled={isResending}
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resending ...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>
          )}
          
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
                <Link href="/" className="flex-1">
                  <Button variant="ghost" className="w-full">
                    Go Home
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
