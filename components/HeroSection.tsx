import React from 'react';
import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  return (
    <section className="relative h-[500px]">
      <img 
        src="/api/placeholder/1200/500" 
        alt="Beautiful beach" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Zafiri</h1>
          <div className="space-x-4">
            <Button variant="outline" className="bg-white text-black hover:bg-gray-200">
              Itinerary creator
            </Button>
            <Button variant="outline" className="bg-white text-black hover:bg-gray-200">
              Enquire now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};