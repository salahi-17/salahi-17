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
    <section className="py-8 md:py-16">
      <div className="container mx-auto px-4">
        <Carousel className="bg-pink-50 rounded-lg shadow-md w-full max-w-5xl mx-auto">
          <CarouselContent>
            {excursions.map((excursion, index) => (
              <CarouselItem key={index}>
                <div className="overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/2">
                      <img
                        src={excursion.image}
                        alt={excursion.title}
                        className="w-full h-48 sm:h-64 lg:h-full object-cover"
                      />
                    </div>
                    <div className="lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
                      <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">{excursion.title}</h2>
                      <div className="mb-4 text-gray-600 overflow-y-auto max-h-[200px] sm:max-h-[250px] lg:max-h-[300px] pr-2">
                        <p className="text-sm sm:text-base">{excursion.description}</p>
                      </div>
                      <Button variant="outline" size="sm" className="self-start mt-2">
                        Explore now
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="hidden  md:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </section>
  );
};