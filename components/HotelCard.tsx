import React from 'react';
import { MapPin } from 'lucide-react';

interface Hotel {
  name: string;
  location: string;
  image: string;
}

interface CustomHotelCardProps {
  hotel: Hotel;
}

const CustomHotelCard: React.FC<CustomHotelCardProps> = ({ hotel }) => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
    <div className="relative overflow-hidden group">
      <img 
        src={hotel.image} 
        alt={hotel.name} 
        className="w-full h-64 object-cover transition-all duration-[2000ms] ease-in-out transform group-hover:scale-110"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
      <div className="flex items-center text-gray-500 mb-4">
        <MapPin size={16} className="mr-1" />
        <span className="text-sm">{hotel.location}</span>
      </div>
      <button className="w-full py-2 px-4 border border-[#00e1e3] text-[#00e1e3] rounded-full hover:bg-[#00e1e3] hover:text-white transition-colors duration-300">
        Learn more
      </button>
    </div>
  </div>
);

interface HotelsSectionProps {
  hotels: Hotel[];
}

export const HotelsSection: React.FC<HotelsSectionProps> = ({ hotels }) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Hotels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel, index) => (
            <CustomHotelCard key={index} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  );
};