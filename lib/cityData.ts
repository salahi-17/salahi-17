// lib/cityData.ts
import { prisma } from '@/lib/prisma';
import { City, Activity, CityCategories } from '@/app/itinerary-creator/types';

export async function getCityData(): Promise<{cities: City[], categories: string[]}> {
  // Fetch all activities from the database
  const activities = await prisma.activity.findMany();

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
    
    // Add activity to the appropriate category
    if (!acc[activity.location].categories[activity.category]) {
      acc[activity.location].categories[activity.category] = [];
    }

    acc[activity.location].categories[activity.category].push(activity);
    
    return acc;
  }, {});

  // Convert the map to an array of City objects
  const cities = Object.values(citiesMap);

  return { cities, categories };
}