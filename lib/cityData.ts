// lib/cityData.ts
import { prisma } from '@/lib/prisma';
export type MediaType = 'IMAGE' | 'VIDEO';

export interface ActivityMedia {
  id: string;
  url: string;
  type: MediaType;
  activityId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  price: number;
  amenities: string[];
  image: string;
  images: ActivityMedia[];
  rating: number | null;
  latitude: number | null;
  longitude: number | null;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface City {
  name: string;
  categories: CityCategories;
}

export interface CityCategories {
  [category: string]: Activity[];
}

export interface Schedule {
  [date: string]: {
    [timeSlot: string]: Activity[];
  };
}

export async function getCityData(): Promise<{cities: City[], categories: string[]}> {
  // Fetch all activities with their related images
  const activities = await prisma.activity.findMany({
    include: {
      images: true
    }
  });

  // Get unique categories
  const categories = activities.reduce<string[]>((acc, activity) => {
    if (!acc.includes(activity.category)) {
      acc.push(activity.category);
    }
    return acc;
  }, []);

  // Group activities by location (city)
  const citiesMap = activities.reduce<Record<string, City>>((acc, activity) => {
    if (!acc[activity.location]) {
      acc[activity.location] = {
        name: activity.location,
        categories: {},
      };
    }

    // Transform the Prisma activity into our Activity type
    const transformedActivity: Activity = {
      id: activity.id,
      name: activity.name,
      category: activity.category,
      location: activity.location,
      description: activity.description,
      price: activity.price,
      amenities: activity.amenities,
      image: activity.image,
      rating: activity.rating ? Number(activity.rating) : null,
      latitude: activity.latitude,
      longitude: activity.longitude,
      totalRatings: activity.totalRatings,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
      images: activity.images.map(img => ({
        id: img.id,
        url: img.url,
        type: img.type,
        activityId: img.activityId,
        createdAt: img.createdAt,
        updatedAt: img.updatedAt
      }))
    };

    // Add activity to the appropriate category
    if (!acc[activity.location].categories[activity.category]) {
      acc[activity.location].categories[activity.category] = [];
    }
    acc[activity.location].categories[activity.category].push(transformedActivity);
    
    return acc;
  }, {});

  // Convert the map to an array of City objects
  const cities = Object.values(citiesMap);
  return { cities, categories };
}