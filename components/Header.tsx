import React from 'react';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="bg-white p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-pink-500">Zafiri</div>
        <nav>
          <ul className="flex space-x-4">
            <li><Button variant="ghost">About</Button></li>
            <li><Button variant="ghost">Hotels</Button></li>
            <li><Button variant="ghost">Activities</Button></li>
            <li><Button variant="ghost">Food and Culture</Button></li>
            <li><Button variant="ghost">Islands</Button></li>
            <li><Button variant="ghost">History</Button></li>
            <li><Button variant="ghost">Contact Us</Button></li>
            <li><Button variant="ghost">Itinerary Creator</Button></li>
            <li><Button variant="ghost">Itinerary Interface</Button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};