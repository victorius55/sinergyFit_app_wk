'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useAuth, useUser } from '@/firebase';
import { 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  signInWithPopup 
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.94 11.04c0-.82-.07-1.59-.2-2.31H12v4.37h5.03c-.22.99-.87 1.84-1.77 2.4v2.82h3.62c2.12-1.95 3.38-4.79 3.38-8.28Z" />
      <path d="M12 21c2.97 0 5.46-.98 7.28-2.66l-3.62-2.82c-.99.66-2.25 1.06-3.66 1.06-2.8 0-5.18-1.89-6.03-4.42H2.3v2.9C4.1 19.06 7.73 21 12 21Z" />
      <path d="M5.97 12.02c-.14-.42-.22-.88-.22-1.35s.08-.93.22-1.35V6.42H2.3C1.48 8.08 1 10.02 1 12s.48 3.92 1.3 5.58l3.67-2.9Z" />
      <path d="M12 5.25c1.62 0 3.06.56 4.21 1.64l3.22-3.22C17.46 1.99 15.02 1 12 1 7.73 1 4.1 2.94 2.3 5.58l3.67 2.9c.85-2.53 3.23-4.42 6.03-4.42Z" />
    </svg>
  );
}

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    }
  };

  const handleOAuthSignIn = (provider: GoogleAuthProvider) => {
    signInWithPopup(auth, provider)
      .then(() => {
        router.push('/dashboard');
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Sign-in Failed",
          description: error.message,
        });
      });
  };

  const handleGoogleSignIn = () => {
    handleOAuthSignIn(new GoogleAuthProvider());
  };
  
  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-4">
        <Logo className="h-16 w-16 text-primary" />
        <div className="flex items-center gap-2 text-foreground">
          <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-primary"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">SynergyFit</h1>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline" prefetch={false}>
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid gap-4">
            <Button variant="outline" onClick={handleGoogleSignIn}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline" prefetch={false}>
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
