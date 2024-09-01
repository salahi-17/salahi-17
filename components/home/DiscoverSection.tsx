import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { getPlaceholderImage } from '@/utils/images';
import Link from 'next/link';

const discoverItems = [
  { title: 'Zanzibar Cuisine', image: '/home/Spice-Tour.webp', href: '/food-and-culture' },
  { title: 'Culture & History', image: '/home/zanzibar-culture-and-history.webp', href: '/history' },
  { title: 'Activities', image: '/home/zanzibar-activities.webp', href: '/activities' },
  { title: 'Zanzibar Islands', image: '/home/zanzibar-islands.webp', href: '/islands' },
];

export const DiscoverSection = async () => {
  const itemsWithPlaceholders = await Promise.all(
    discoverItems.map(async (item) => {
      const imageData = await getPlaceholderImage(item.image);
      return { ...item, imageData };
    })
  );

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-10 text-center">Discover more</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
          {itemsWithPlaceholders.map((item, index) => (
            <Link
              href={item.href}
              key={index}
            >
              <Card
                className="w-full md:w-[350px] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full"
              >
                <CardContent className="p-0 relative aspect-square">
                  <Image
                    src={item.imageData.src}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                    placeholder="blur"
                    blurDataURL={item.imageData.placeholder}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity duration-300 hover:bg-opacity-40">
                    <h3 className="text-white text-3xl md:text-4xl font-bold text-center px-4">
                      {item.title}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};