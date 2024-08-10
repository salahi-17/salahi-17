import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { HotelsSection } from '@/components/HotelCard';
import { AmenitiesCarousel } from '@/components/AmenitiesCarousel';
import TestimonialsSection from '@/components/HotelsTestimonials';

const HotelsPage = () => {
  const hotels = [
    { name: "Park Hyatt", location: "Zanzibar | Stone Town", image: "/hotels/Park-Hyatt.webp" },
    { name: "Serena", location: "Zanzibar | Stone Town", image: "/hotels/Serena-.webp" },
    { name: "Golden Tulip", location: "Zanzibar | Stone Town", image: "/hotels/Golden-Tulip.webp" },
    { name: "Tembo Hotel", location: "Zanzibar | Stone Town", image: "/hotels/Tembo-Hotel.webp" },
    { name: "Hotel Verde", location: "Zanzibar | Stone Town", image: "/hotels/Verde-2.webp" },
    { name: "Zuri Hotel", location: "Zanzibar | Nungwi", image: "/hotels/Zuri-Hotel.webp" },
    { name: "Ycona Luxury Resort", location: "Zanzibar | Nungwi", image: "/hotels/Ycona-Luxury-Resort.webp" },
    { name: "THE ISLAND PONGWE", location: "Zanzibar | Pongwe", image: "/hotels/THE-ISLAND-PONGWE.webp" },
    { name: "Bububu Bungalow", location: "Zanzibar | Bububu", image: "/hotels/Babalao-Bungalos.webp" },
  ];

  const amenities = [
    { name: "Hot Tub", image: "/hotels/hot-tub.webp" },
    { name: "Apartments", image: "/hotels/apartments.webp" },
    { name: "Pool", image: "/hotels/pool.webp" },
    { name: "Spa", image: "/hotels/spa.webp" },
    { name: "Sea View", image: "/hotels/sea-view.webp" },
    { name: "Family Friendly", image: "/hotels/family-friendly.webp" },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[600px] mb-12">
        <img src="/hotels/hotels-hero.png" alt="Zanzibar Hotels" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
          <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl md:text-7xl font-bold text-white text-center">
            Hotels
          </h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">

        {/* Hotels Section */}
        <HotelsSection hotels={hotels} />

        { /* Amenities Courasel */}
        <AmenitiesCarousel amenities={amenities} />

        {/* Testimonials Section */}
        <TestimonialsSection />

      </div>
    </>
  );

};

export default HotelsPage;