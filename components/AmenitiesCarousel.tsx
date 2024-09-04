'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface Amenity {
  name: string;
  image: string;
}

interface AmenitiesCarouselProps {
  amenities: Amenity[];
  onAmenityClick: (amenity: string) => void;
}

export const AmenitiesCarousel: React.FC<AmenitiesCarouselProps> = ({ amenities, onAmenityClick }) => {
  const searchParams = useSearchParams();
  const selectedAmenity = searchParams.get('amenity');

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">What are you looking for?</h2>
        <Carousel className="mb-12">
          <CarouselContent>
            {amenities.map((amenity, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <div 
                  className={`relative h-72 rounded-lg overflow-hidden group cursor-pointer ${
                    selectedAmenity === amenity.name ? 'ring-4 ring-[#00e1e3]' : ''
                  }`}
                  onClick={() => onAmenityClick(amenity.name)}
                >
                  <img 
                    src={amenity.image} 
                    alt={amenity.name} 
                    className="w-full h-full object-cover transition-all duration-[2000ms] ease-in-out transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 group-hover:bg-opacity-20">
                    <span className="text-white text-4xl font-semibold">{amenity.name}</span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='hidden md:flex'/>
          <CarouselNext className='hidden md:flex'/>
        </Carousel>
      </div>
    </section>
  );
};