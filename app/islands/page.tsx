import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPlaceholderImage } from '@/utils/images';
import { aclonica } from '@/utils/aclonica';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Explore Zanzibar's Islands - Unguja, Pemba, and More",
  description: "Discover Zanzibar’s archipelago with Zafiri. Visit the iconic islands of Unguja and Pemba, and uncover hidden gems across 50 breathtaking islands.",
};

const IslandsPage = async () => {
  const islands = [
    {
      name: "Unguja",
      description: "Unguja is often referred to as the best island in Zanzibar. It is the home of stone town and the amazing Jozani Forest, where you can see the rare red colobus monkey. It is full of beautiful beaches like Kendwa and Paje.",
      image: "/islands/Unguja.webp"
    },
    {
      name: "Pemba",
      description: "Pemba is a hidden masterpiece littered with mangroves, hidden beaches, lagoons and tidal sandbanks. Pemba has many luxury hotels and resorts, and it's less touristy than Unguja. It can be accessed by local ferry or flights.",
      image: "/islands/Pemba.webp"
    },
    {
      name: "Mnemba",
      description: "Mnemba Island is a beautiful private island surrounded by coral reef that hosts a wide range of marine life. Located on the Northeast coast of Unguja, it only has one resort on the entire island offering a luxurious and exclusive getaway.",
      image: "/islands/Mnemba.webp"
    },
    {
      name: "Changuu",
      description: "Changuu Island or more famously known as Prison Island is a tropical paradise off the coast of Stone Town. Prison Island contains an abundance of great scenery including the beautiful beach and amazing wildlife.",
      image: "/islands/Prison-Island.webp"
    }
  ];

  const heroImageData = await getPlaceholderImage("/islands/islands-hero.jpg");
  const bottomHeroImageData = await getPlaceholderImage("/islands/zafiri-island.png");

  const islandsWithPlaceholders = await Promise.all(
    islands.map(async (island) => {
      const imageData = await getPlaceholderImage(island.image);
      return { ...island, imageData };
    })
  );

  return (
    <div>
      <div className="relative h-[500px] mb-12">
        <Image
          src={heroImageData.src}
          alt="Zanzibar Islands"
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL={heroImageData.placeholder}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
          <h1 className={`text-4xl md:text-7xl font-bold mb-4 drop-shadow-lg ${aclonica.className}`}>Islands</h1>
          <p className="text-center max-w-2xl mb-6">
            Zanzibar is an archipelago consisting of 50 beautiful islands. The two main islands, also the two largest, are Unguja Island and Pemba.
          </p>
          <Button variant="outline" className="border-white text-black">
            Where to visit
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {islandsWithPlaceholders.map((island, index) => (
          <Card key={index} className="mb-8 overflow-hidden bg-white">
            <div className="flex flex-col md:flex-row">
              {index % 2 === 0 ? (
                <>
                  <div className="relative w-full md:w-1/2 h-64 md:h-auto">
                    <Image
                      src={island.imageData.src}
                      alt={island.name}
                      layout="fill"
                      objectFit="cover"
                      placeholder="blur"
                      blurDataURL={island.imageData.placeholder}
                    />
                  </div>
                  <CardContent className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-4 text-primary">{island.name}</h2>
                    <p className="mb-4">{island.description}</p>
                  </CardContent>
                </>
              ) : (
                <>
                  <CardContent className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-4 text-primary">{island.name}</h2>
                    <p className="mb-4">{island.description}</p>
                    <Button variant="default" className="self-start text-white">
                      Explore more
                    </Button>
                  </CardContent>
                  <div className="relative w-full md:w-1/2 h-64 md:h-auto">
                    <Image
                      src={island.imageData.src}
                      alt={island.name}
                      layout="fill"
                      objectFit="cover"
                      placeholder="blur"
                      blurDataURL={island.imageData.placeholder}
                    />
                  </div>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IslandsPage;