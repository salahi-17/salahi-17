// app/auth/register/page.tsx
import RegisterForm from './RegisterForm'
import Link from 'next/link'
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Register for Your Zanzibar Adventure | Zafiri",
  description: "Create an account to begin your unforgettable Zanzibar journey! Sign up now for exclusive deals, easy booking management, and tailored travel experiences with Zafiri.",
  alternates: {
    canonical: '/auth/regsiter',
  }
};

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { callbackUrl: string | undefined }
}) {
  const callbackUrl = searchParams.callbackUrl || '/'

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Create an account</h1>
        </CardHeader>
        <CardContent>
          <RegisterForm callbackUrl={callbackUrl} />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>Already have an account? 
            <Button variant="link" asChild>
              <Link href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
                Sign in here
              </Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}