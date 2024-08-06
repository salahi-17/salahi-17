import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const discoverItems = [
  { title: 'Zanzibar Cuisine', image: '/api/placeholder/1200/800' },
  { title: 'Culture & History', image: '/api/placeholder/1200/800' },
  { title: 'Activities', image: '/api/placeholder/1200/800' },
  { title: 'Zanzibar Islands', image: '/api/placeholder/1200/800' },
];

export const DiscoverSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-10 text-center">Discover more</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
          {discoverItems.map((item, index) => (
            <Card 
              key={index} 
              className="w-full md:w-[350px] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full"
            >
              <CardContent className="p-0 relative aspect-square">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity duration-300 hover:bg-opacity-40">
                  <h3 className="text-white text-3xl md:text-4xl font-bold text-center px-4">
                    {item.title}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
