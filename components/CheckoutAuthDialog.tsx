// components/CheckoutAuthDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';

interface CheckoutAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGuestCheckout: (email: string, name: string) => void;
}

export default function CheckoutAuthDialog({
  isOpen,
  onClose,
  onGuestCheckout,
}: CheckoutAuthDialogProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isGuestMode, setIsGuestMode] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleGuestCheckout = () => {
    // Validate name
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to continue.",
        variant: "destructive",
      });
      return;
    }

    // Validate email
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    onGuestCheckout(email, name);
    onClose();
  };

  const handleLogin = () => {
    router.push('/auth/signin');
    onClose();
  };

  // Reset form when dialog closes
  const handleClose = () => {
    setEmail('');
    setName('');
    setIsGuestMode(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Continue to Checkout</DialogTitle>
          <DialogDescription>
            Sign in to access your account or continue as a guest
          </DialogDescription>
        </DialogHeader>

        {isGuestMode ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsGuestMode(false)}
              >
                Back
              </Button>
              <Button
                onClick={handleGuestCheckout}
              >
                Continue as Guest
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              className="w-full"
              onClick={handleLogin}
            >
              Sign In / Create Account
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsGuestMode(true)}
            >
              Continue as Guest
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}