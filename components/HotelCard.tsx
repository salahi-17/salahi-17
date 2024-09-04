'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  amenities: string[];
  image: string;
  imageData: {
    src: string;
    placeholder: string;
  };
}

interface HotelsSectionProps {
  hotels: Hotel[];
}

interface CustomHotelCardProps {
  hotel: Hotel;
}

const CustomHotelCard: React.FC<CustomHotelCardProps> = ({ hotel }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer">
          <div className="relative overflow-hidden group h-64">
            <Image 
              src={hotel.imageData.src} 
              alt={hotel.name} 
              layout="fill"
              objectFit="cover"
              placeholder="blur"
              blurDataURL={hotel.imageData.placeholder}
              className="transition-all duration-[2000ms] ease-in-out transform group-hover:scale-110"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
            <div className="flex items-center text-gray-500 mb-4">
              <MapPin size={16} className="mr-1" />
              <span className="text-sm">{hotel.location}</span>
            </div>
            <button className="w-full py-2 px-4 border border-[#00e1e3] text-[#00e1e3] rounded-full hover:bg-[#00e1e3] hover:text-white transition-colors duration-300">
              Learn more
            </button>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{hotel.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Image 
            src={hotel.imageData.src} 
            alt={hotel.name} 
            width={500}
            height={300}
            objectFit="cover"
          />
          <p>{hotel.description}</p>
          <p>Price: ${hotel.price} per night</p>
          <div>
            <h4 className="font-semibold">Amenities:</h4>
            <ul className="list-disc list-inside">
              {hotel.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const HotelsSection: React.FC<HotelsSectionProps> = ({ hotels }) => {
  if (hotels.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Hotels</h2>
          <p>No hotels found matching the selected criteria.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Popular Hotels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <CustomHotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  );
};