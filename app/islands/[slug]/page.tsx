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

const islandData: IslandDataMap = {
  unguja: {
    name: "Unguja",
    description: "Unguja is often referred to as the best island in Zanzibar. It is the home of stone town and the amazing Jozani Forest, where you can see the rare red colobus monkey. It is full of beautiful beaches like Kendwa and Paje.",
    image: "/islands/Unguja.webp",
    detailedContent: {
      overview: "Unguja, commonly known as Zanzibar Island, is the main island of the Zanzibar archipelago. This tropical paradise combines historical richness with natural beauty, making it a perfect destination for both culture enthusiasts and beach lovers. The island offers a unique blend of African, Arab, and European influences, visible in its architecture, cuisine, and culture.",
      highlights: [
        "Stone Town - A UNESCO World Heritage site with fascinating architecture and historical significance",
        "Jozani Forest - Home to the rare Red Colobus monkeys and unique flora",
        "Pristine Beaches - Including famous Kendwa and Paje beaches known for their white sand",
        "Spice Tours - Experience the island's famous spice plantations and learn about local agriculture",
        "Traditional Villages - Experience authentic local life and culture",
        "Forodhani Gardens - Evening food market and historical park in Stone Town"
      ],
      activities: "Visitors can enjoy a wide range of activities including snorkeling, diving, kitesurfing, spice tours, and historical walks through Stone Town. The island is also famous for its sunset dhow cruises, traditional fishing villages, and cultural tours. Water sports enthusiasts will find perfect conditions at beaches like Paje, while history buffs can explore the ancient ruins and architecture of Stone Town."
    }
  },
  pemba: {
    name: "Pemba",
    description: "Pemba is a hidden masterpiece littered with mangroves, hidden beaches, lagoons and tidal sandbanks. Pemba has many luxury hotels and resorts, and it's less touristy than Unguja. It can be accessed by local ferry or flights.",
    image: "/islands/Pemba.webp",
    detailedContent: {
      overview: "Pemba Island, known as 'The Green Island', is a natural wonder characterized by its lush, rolling hills and deep verdant valleys filled with clove plantations and other spices. Less visited than Unguja, Pemba offers an authentic island experience with pristine beaches, untouched coral reefs, and rich marine life.",
      highlights: [
        "Misali Island - A pristine conservation area with spectacular diving and snorkeling",
        "Ngezi Forest Reserve - Home to endemic flora and fauna",
        "Clove Plantations - World's largest producer of cloves",
        "Pristine Beaches - Secluded and untouched coastal areas",
        "Traditional Culture - Authentic local villages and customs",
        "Pemba Channel - Known for deep-sea fishing and marine life"
      ],
      activities: "The island offers world-class diving and snorkeling opportunities, with some of the healthiest coral reefs in the region. Visitors can explore mangrove forests by boat, visit local spice farms, experience traditional culture in villages, or simply relax on secluded beaches. Deep-sea fishing, kayaking, and bird watching are also popular activities."
    }
  },
  mnemba: {
    name: "Mnemba",
    description: "Mnemba Island is a beautiful private island surrounded by coral reef that hosts a wide range of marine life. Located on the Northeast coast of Unguja, it only has one resort on the entire island offering a luxurious and exclusive getaway.",
    image: "/islands/Mnemba.webp",
    detailedContent: {
      overview: "Mnemba Island is an exclusive private paradise surrounded by an oval reef offering some of the best snorkeling and diving in Zanzibar. This tiny island combines luxury with conservation, hosting an award-winning eco-lodge while protecting important marine and terrestrial habitats.",
      highlights: [
        "Pristine Coral Reef - Home to diverse marine life and perfect for diving",
        "Luxury Resort - Exclusive &Beyond Mnemba Island lodge",
        "Turtle Nesting - Important green turtle nesting site",
        "Private Beaches - Powder-white sand beaches with crystal clear waters",
        "Marine Conservation - Active conservation and research programs",
        "Exclusive Experience - Limited number of guests at any time"
      ],
      activities: "Guests can enjoy world-class diving and snorkeling in the surrounding coral reef, witness sea turtles nesting on the beaches, participate in marine conservation activities, or simply relax in absolute privacy. The resort offers kayaking, stand-up paddleboarding, and romantic beach dining experiences."
    }
  },
  changuu: {
    name: "Changuu",
    description: "Changuu Island or more famously known as Prison Island is a tropical paradise off the coast of Stone Town. Prison Island contains an abundance of great scenery including the beautiful beach and amazing wildlife.",
    image: "/islands/Prison-Island.webp",
    detailedContent: {
      overview: "Changuu, also known as Prison Island, is a small island northwest of Stone Town with a fascinating history. Originally intended as a prison for rebellious slaves in the 1860s and later as a quarantine station, it now serves as a tourist destination famous for its giant tortoise sanctuary and beautiful beaches.",
      highlights: [
        "Giant Tortoise Sanctuary - Home to Aldabra giant tortoises",
        "Historical Prison Building - 19th-century architecture and museum",
        "Pristine Beaches - Perfect for swimming and snorkeling",
        "Coral Reefs - Rich marine life in surrounding waters",
        "Historical Ruins - Including former quarantine station",
        "Beautiful Views - Panoramic views of Stone Town and Indian Ocean"
      ],
      activities: "Visitors can feed and interact with the giant tortoises, explore the historical prison building and museum, snorkel in the clear waters around the island, or relax on the peaceful beaches. The island is perfect for a day trip from Stone Town, offering both historical interest and natural beauty."
    }
  }
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