import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getPlaceholderImage } from '@/utils/images';

export const HeroSection = async () => {
  const imageWithPlaceholder = await getPlaceholderImage("/home/humphrey-muleba-e6dRLBx6Kg8-unsplash-scaled.jpeg");

  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      <Image
        src={imageWithPlaceholder.src}
        alt="Beautiful Zanzibar beach"
        fill
        style={{ objectFit: "cover" }}
        quality={100}
        placeholder="blur"
        blurDataURL={imageWithPlaceholder.placeholder}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
        <div className="text-center max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Welcome to Zafiri
          </h1>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button variant="outline" size="lg" className="self-start rounded-none border-2 text-white border-white bg-transparent hover:text-white hover:bg-white/10">
              Itinerary creator
            </Button>
            <Button variant="outline" size="lg" className="self-start rounded-none border-2 text-white border-white bg-transparent hover:text-white hover:bg-white/10">
              Enquire now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};