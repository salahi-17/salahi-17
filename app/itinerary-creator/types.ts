// app/itinerary-creator/types.ts

export interface Activity {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  price: number;
  amenities: string[];
  image: string;
}

export interface ScheduleItem extends Activity {
  type: string;
  notes?: string;
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
    [timeSlot: string]: ScheduleItem[];
  };
}
