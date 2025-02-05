import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { getPlaceholderImage } from '@/utils/images';
import { aclonica } from '@/utils/aclonica';
import { Metadata } from 'next';
import BackButton from './BackButton';

interface DetailedContent {
  overview: string;
  highlights: string[];
  activities: string;
}

interface IslandData {
  name: string;
  description: string;
  image: string;
  detailedContent: DetailedContent;
}

interface IslandDataMap {
  [key: string]: IslandData;
}

interface PageProps {
  params: {
    slug: string;
  };
}

// This data would typically come from a database or CMS
const islandData: IslandDataMap = {
  unguja: {
    name: "Unguja",
    description: "Unguja is often referred to as the best island in Zanzibar. It is the home of stone town and the amazing Jozani Forest, where you can see the rare red colobus monkey. It is full of beautiful beaches like Kendwa and Paje.",
    image: "/islands/Unguja.webp",
    detailedContent: {
      overview: "Unguja, commonly known as Zanzibar Island, is the main island of the Zanzibar archipelago. This tropical paradise combines historical richness with natural beauty, making it a perfect destination for both culture enthusiasts and beach lovers.",
      highlights: [
        "Stone Town - A UNESCO World Heritage site with fascinating architecture",
        "Jozani Forest - Home to the rare Red Colobus monkeys",
        "Pristine Beaches - Including famous Kendwa and Paje beaches",
        "Spice Tours - Experience the island's famous spice plantations",
      ],
      activities: "Visitors can enjoy snorkeling, diving, kitesurfing, spice tours, and historical walks through Stone Town. The island is also famous for its sunset dhow cruises and traditional fishing villages."
    }
  },
  // ... rest of the island data ...
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const island = islandData[params.slug];
  return {
    title: `${island.name} - Zanzibar Island Guide`,
    description: island.description,
  };
}

const IslandDetailPage = async ({ params }: PageProps) => {
  const island = islandData[params.slug];
  if (!island) return null;

  const imageData = await getPlaceholderImage(island.image);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[400px]">
        <Image
          src={imageData.src}
          alt={island.name}
          fill
          style={{ objectFit: 'cover' }}
          placeholder="blur"
          blurDataURL={imageData.placeholder}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className={`text-5xl text-white font-bold ${aclonica.className}`}>
            {island.name}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-gray-700 mb-6">{island.detailedContent.overview}</p>

            <h2 className="text-2xl font-bold mb-4">Highlights</h2>
            <ul className="list-disc pl-6 mb-6">
              {island.detailedContent.highlights.map((highlight, index) => (
                <li key={index} className="text-gray-700 mb-2">{highlight}</li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold mb-4">Activities</h2>
            <p className="text-gray-700">{island.detailedContent.activities}</p>
          </CardContent>
        </Card>

        <div className="text-center">
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default IslandDetailPage;