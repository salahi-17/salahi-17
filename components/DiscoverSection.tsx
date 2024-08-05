import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const DiscoverSection = () => {
  const discoverItems = [
    { title: 'Zanzibar Cuisine', image: '/api/placeholder/300/200' },
    { title: 'Culture & History', image: '/api/placeholder/300/200' },
    { title: 'Activities', image: '/api/placeholder/300/200' },
    { title: 'Zanzibar Islands', image: '/api/placeholder/300/200' },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6">Discover more</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {discoverItems.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-0">
                <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};