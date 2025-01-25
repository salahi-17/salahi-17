import { PrismaClient } from '@prisma/client';
import { getPlaceholderImage } from '@/utils/images';
import HotelsPage from './HotelsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Zanzibar Hotels - Luxury Stays with Zafiri",
  description: "Find the best hotels in Zanzibar with Zafiri. From beachfront resorts to budget-friendly options, we’ve got your perfect stay covered",
};

const prisma = new PrismaClient();

async function getHotels() {
  const hotels = await prisma.activity.findMany({
    where: {
      category: 'Hotel',
    },
  });

  return Promise.all(
    hotels.map(async (hotel) => {
      const imageData = await getPlaceholderImage(hotel.image);
      return { ...hotel, imageData };
    })
  );
}

export default async function HotelsPageWrapper() {
  const initialHotels = await getHotels();
  const heroImageData = await getPlaceholderImage("/hotels/hotels-hero.png");

  return <HotelsPage initialHotels={initialHotels} heroImageData={heroImageData} />;
}