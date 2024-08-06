import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer = () => {
  return (
    <footer className="bg-pink-50 py-8">
      <div className="container mx-auto flex flex-wrap justify-between">
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <h3 className="text-xl font-bold text-pink-500 mb-4">Zafiri Group</h3>
        </div>
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <h4 className="font-semibold mb-2">Discover Zafiri</h4>
          <ul>
            <li>Islands</li>
            <li>Activities</li>
            <li>Hotels</li>
            <li>Food and drinks</li>
          </ul>
        </div>
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <h4 className="font-semibold mb-2">Contact us</h4>
          <p>info@zafiri.com</p>
          <p>+1 234 567 8901</p>
          <p>+1 987 654 3210</p>
        </div>
        <div className="w-full md:w-1/4">
          <h4 className="font-semibold mb-2">Don't miss out</h4>
          <p className="mb-2">Subscribe for latest events, travel tips, promotions and more!</p>
          <form className="space-y-2">
            <Input type="text" placeholder="First Name" />
            <Input type="text" placeholder="Last Name" />
            <Input type="email" placeholder="Email" />
            <Button variant="outline" className="w-full">Subscribe</Button>
          </form>
        </div>
      </div>
      <div className="container mx-auto mt-8 text-center text-sm">
        <p>BOOKING TERMS & CONDITIONS | PRIVACY POLICY | DISCLAIMER</p>
        <p>© 2024 All Rights Reserved | Designed by Zafiri</p>
        <div className="mt-4 space-x-4">
          <Button variant="ghost" size="sm">Facebook</Button>
          <Button variant="ghost" size="sm">Instagram</Button>
          <Button variant="ghost" size="sm">TikTok</Button>
          <Button variant="ghost" size="sm">LinkedIn</Button>
        </div>
      </div>
    </footer>
  );
};