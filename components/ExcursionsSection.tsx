import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const excursions = [
  {
    title: "Festivals",
    description: "Festivals and Events: Zanzibar is renowned for its vibrant festivals and cultural events that celebrate the rich heritage and diverse cultures of the region. Visitors can immerse themselves in the local festivities, which often include traditional music, dance performances, and art exhibitions. Highlighted events like the Zanzibar International Film Festival and the Sauti za Busara Music Festival provide a platform for both local and international artists.",
    image: "/api/placeholder/800/600"
  },
  {
    title: "Dhow Cruises",
    description: "Traditional wooden dhows are a common sight along Zanzibar's coastline. These sailing vessels offer scenic cruises, allowing visitors to enjoy the views of stone town and tropical beaches. Many dhow cruises also include snorkeling stops and fresh seafood meals on board.",
    image: "/api/placeholder/800/600"
  },
  // Add more excursions as needed
];

export const ExcursionsSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Carousel className="w-full max-w-7xl mx-auto">
          <CarouselContent>
            {excursions.map((excursion, index) => (
              <CarouselItem key={index}>
                <div className="bg-pink-50 rounded-2xl overflow-hidden h-[600px] flex flex-col md:flex-row">
                  <div className="md:w-1/2 p-6 md:p-8 flex items-center">
                    <img
                      src={excursion.image}
                      alt={excursion.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-4">{excursion.title}</h2>
                    <div className="mb-6 text-gray-600 overflow-y-auto max-h-[300px] pr-8">
                      <p>{excursion.description}</p>
                      <Button variant="outline" size={"lg"} className="self-start mt-4">
                        Explore now
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </section>
  );
};