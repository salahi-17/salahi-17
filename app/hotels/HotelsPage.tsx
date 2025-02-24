'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { HotelsSection } from '@/components/HotelCard';
import { AmenitiesCarousel } from '@/components/AmenitiesCarousel';
import { aclonica } from '@/utils/aclonica';
import TestimonialsSection from '@/components/HotelsTestimonials';
import BlogSection from '@/components/BlogSection';
import { BlogPost } from '@/lib/blogs';
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

interface HotelsPageProps {
  initialHotels: Hotel[];
  heroImageData: {
    src: string;
    placeholder: string;
  };
  blogs: BlogPost[];
}

export default async function HotelsPage({ initialHotels, heroImageData, blogs }: HotelsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(initialHotels);
  
  const amenities = [
    { name: "Hot Tub", image: "/hotels/hot-tub.webp" },
    { name: "Apartments", image: "/hotels/apartments.webp" },
    { name: "Pool", image: "/hotels/pool.webp" },
    { name: "Spa", image: "/hotels/spa.webp" },
    { name: "Sea View", image: "/hotels/sea-view.webp" },
    { name: "Family Friendly", image: "/hotels/family-friendly.webp" },
  ];

  useEffect(() => {
    const amenity = searchParams.get('amenity');
    if (amenity) {
      const filtered = initialHotels.filter(hotel => 
        hotel.amenities.some(hotelAmenity => 
          hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
        )
      );
      setFilteredHotels(filtered);
    } else {
      setFilteredHotels(initialHotels);
    }
  }, [searchParams, initialHotels]);

  const handleAmenityClick = (amenity: string) => {
    const currentAmenity = searchParams.get('amenity');
    if (currentAmenity === amenity) {
      // If the same amenity is clicked, remove the filter
      router.push('/hotels');
    } else {
      // Apply the new filter
      router.push(`/hotels?amenity=${encodeURIComponent(amenity)}`);
    }
  };


  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[500px] mb-12">
        <Image
          src={heroImageData.src}
          alt="Zanzibar Hotels"
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL={heroImageData.placeholder}
          priority
        />        
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
          <h1 className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl md:text-7xl font-bold text-white text-center drop-shadow-lg ${aclonica.className}`}>
            Hotels
          </h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <AmenitiesCarousel amenities={amenities} onAmenityClick={handleAmenityClick} />
        <HotelsSection hotels={filteredHotels} />
        <TestimonialsSection />
        <BlogSection 
        blogs={blogs}
        title="Stay in Zanzibar"
        category="hotels"
      />
      </div>
    </>
  );
}