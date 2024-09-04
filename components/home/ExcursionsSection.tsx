import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import { getPlaceholderImage } from '@/utils/images';

const excursions = [
  {
    title: "Excursions",
    description: "Dhow Cruises: Traditional wooden dhows are a common sight along Zanzibar's coastline. Dhows offer serene and scenic cruises, allowing visitors to enjoy the coastline, islands, and sunset views. Some dhow cruises also include snorkeling stops and fresh seafood meals on board.",
    image: "/home/denys-nevozhai-guNIjIuUcgY-unsplash-scaled.webp"
  },
  {
    title: "Festivals",
    description: "Festivals and Events: Zanzibar is renowned for its vibrant festivals and cultural events that celebrate the rich heritage and diverse cultures of the region. Visitors can immerse themselves in the local festivities, which often include traditional music, dance performances, and art exhibitions. Highlighted events like the Zanzibar International Film Festival and the Sauti za Busara Music Festival provide a platform for both local and international artists.",
    image: "/home/festivals.webp"
  },
  {
    title: "Attractions you must visit  ",
    description: "Attractions to Visit: Zanzibar is a treasure trove of attractions that highlight its rich heritage and vibrant culture. Notable destinations include the ancient Stone Town with its winding alleys and bustling markets, and the pristine beaches of Nungwi and Paje. The Jozani Chwaka Bay National Park offers a glimpse into the island's unique wildlife and ecosystems. ",
    image: "/home/zanzibar-attractions.webp"
  },
  {
    title: "Safaris",
    description: "Safaris in Zanzibar and Beyond:  Within Zanzibar itself, visitors can embark on a safari through the Jozani Chwaka Bay National Park, where the lush forests are home to rare wildlife such as the Red Colobus monkey and myriad bird species. Iconic parks such as the Serengeti and the Ngorongoro Crater are just a flight away, where travelers can witness the Great Migration and encounter the Big Five. ",
    image: "/home/zanzibar-safaris.webp"
  }
];

export const ExcursionsSection = async () => {
  const excursionsWithPlaceholders = await Promise.all(
    excursions.map(async (excursion) => {
      const imageData = await getPlaceholderImage(excursion.image);
      return { ...excursion, imageData };
    })
  );

  return (
    <section className="py-16 relative w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <Carousel className="bg-[#f8e1d8] rounded-3xl shadow-md w-full max-w-5xl mx-auto overflow-hidden">
          <CarouselContent>
            {excursionsWithPlaceholders.map((excursion, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col md:flex-row md:h-[400px]">
                  <div className="hidden md:block md:w-1/2 h-full relative rounded-l-3xl overflow-hidden">
                    <Image
                      src={excursion.imageData.src}
                      alt={excursion.title}
                      fill
                      style={{ objectFit: "cover" }}
                      placeholder="blur"
                      blurDataURL={excursion.imageData.placeholder}
                    />
                  </div>
                  <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">{excursion.title}</h2>
                    <div className="mb-6 text-gray-600">
                      <p className="text-sm md:text-base">{excursion.description}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </section>
  );
};