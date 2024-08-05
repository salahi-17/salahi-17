import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const ExcursionsSection = () => {
  return (
    <section className="py-12 bg-pink-50">
      <div className="container mx-auto">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Excursions</h2>
              <p className="mb-4">
                Dhow Cruises: Traditional wooden dhows are a common sight along Zanzibar's
                coastline. These sailing vessels offer scenic cruises, allowing visitors to enjoy the
                views of stone town and tropical beaches. Many dhow cruises also include snorkeling
                stops and fresh seafood meals on board.
              </p>
              <Button variant="outline">Explore now</Button>
            </div>
            <div className="flex-1 ml-6">
              <img 
                src="/api/placeholder/400/300" 
                alt="Excursions" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};