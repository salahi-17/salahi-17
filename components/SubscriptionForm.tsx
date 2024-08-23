'use client';

import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";

export const SubscriptionForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Subscribed!",
          description: "You've been successfully added to our mailing list.",
        });
        setFirstName('');
        setLastName('');
        setEmail('');
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <Input 
        type="text" 
        placeholder="First Name" 
        className="bg-white" 
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <Input 
        type="text" 
        placeholder="Last Name" 
        className="bg-white" 
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <Input 
        type="email" 
        placeholder="Email" 
        className="bg-white" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button 
        type="submit" 
        variant="outline" 
        className="w-full bg-[#E5C1B5] text-white hover:bg-[#d8a795]"
        disabled={isLoading}
      >
        {isLoading ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  );
};