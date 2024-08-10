import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"


const excursions = [
  {
    title: "Excursions",
    description: "Dhow Cruises: Traditional wooden dhows are a common sight along Zanzibar’s coastline. Dhows offer serene and scenic cruises, allowing visitors to enjoy the coastline, islands, and sunset views. Some dhow cruises also include snorkeling stops and fresh seafood meals on board.",
    image: "/home/denys-nevozhai-guNIjIuUcgY-unsplash-scaled.webp"
  },
  {
    title: "Festivals",
    description: "Festivals and Events: Zanzibar is renowned for its vibrant festivals and cultural events that celebrate the rich heritage and diverse cultures of the region. Visitors can immerse themselves in the local festivities, which often include traditional music, dance performances, and art exhibitions. Highlighted events like the Zanzibar International Film Festival and the Sauti za Busara Music Festival provide a platform for both local and international artists.",
    image: "/home/festivals.webp"
  },
  {
    title: "Attractions you must visit  ",
    description: "Attractions to Visit: Zanzibar is a treasure trove of attractions that highlight its rich heritage and vibrant culture. Notable destinations include the ancient Stone Town with its winding alleys and bustling markets, and the pristine beaches of Nungwi and Paje. The Jozani Chwaka Bay National Park offers a glimpse into the island’s unique wildlife and ecosystems. ",
    image: "/home/zanzibar-attractions.webp"
  },
  {
    title: "Safaris",
    description: "Safaris in Zanzibar and Beyond:  Within Zanzibar itself, visitors can embark on a safari through the Jozani Chwaka Bay National Park, where the lush forests are home to rare wildlife such as the Red Colobus monkey and myriad bird species. Iconic parks such as the Serengeti and the Ngorongoro Crater are just a flight away, where travelers can witness the Great Migration and encounter the Big Five. ",
    image: "/home/zanzibar-safaris.webp"
  }
];

export const ExcursionsSection = () => {
  return (
    <section className="py-8 md:py-16">
      <div className="container mx-auto px-4">
        <Carousel className="bg-primary rounded-3xl shadow-md w-full max-w-5xl mx-auto overflow-hidden">
          <CarouselContent>
            {excursions.map((excursion, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col md:flex-row h-[500px]">
                  <div className="flex justfiy-center md:w-1/2 h-full">
                    <AspectRatio ratio={4/3} className="h-full">
                      <Image
                        src={excursion.image}
                        alt={excursion.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-3xl"
                      />
                    </AspectRatio>
                  </div>
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-4">{excursion.title}</h2>
                    <div className="mb-6 text-gray-600 overflow-y-auto max-h-[250px] pr-4">
                      <p className="text-sm md:text-base">{excursion.description}</p>
                    </div>
                    <Button variant="outline" size="lg" className="self-start rounded-none border-2 text-white border-white bg-primary hover:border-none hover:text-white ">
                      Explore now
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </section>
  );
};