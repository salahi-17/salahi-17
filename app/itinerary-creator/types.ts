// app/itinerary-creator/types.ts

import { ActivityMedia } from "@prisma/client";

export interface Activity {
  latitude: any;
  longitude: any;
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  price: number;
  amenities: string[];
  image: string;
  rating: number | null;
  images: ActivityMedia[];
}

export interface ScheduleItem extends Activity {
  type: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  guestCount: number;
  totalPrice?: number; 
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
    [timeSlot: string]: ScheduleItem[];
  };
}

