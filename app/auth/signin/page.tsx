// app/auth/signin/page.tsx
import SignInForm from './SignInForm'
import Link from 'next/link'
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl: string | undefined }
}) {
  const callbackUrl = searchParams.callbackUrl || '/itinerary-creator'

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Sign in to your account</h1>
        </CardHeader>
        <CardContent>
          <SignInForm callbackUrl={callbackUrl} />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>Don't have an account? 
            <Button variant="link" asChild>
              <Link href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
                Register here
              </Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}