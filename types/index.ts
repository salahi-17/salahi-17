// types/index.ts
import { MediaType } from "@prisma/client";

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