import React, { useState } from 'react';
import { Activity, City } from './types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ActivitySelectorProps {
  selectedCity: City | 'All';
  selectedCategory: string;
  cityData: City[];
}

export default function ActivitySelector({ selectedCity, selectedCategory, cityData }: ActivitySelectorProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [guestCount, setGuestCount] = useState<number>(1);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Activity, category: string) => {
    if (item.price > 0) {
      e.dataTransfer.setData("application/json", JSON.stringify({
        ...item,
        type: category,
        guestCount,
        totalPrice: item.price * guestCount,
        isHotel: category.toLowerCase() === 'hotel'
      }));
      if (e.currentTarget.classList.contains('activity-card')) {
        e.currentTarget.classList.add('dragging');
      }
    } else {
      e.preventDefault();
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.classList.contains('activity-card')) {
      e.currentTarget.classList.remove('dragging');
    }
  };

  const getActivities = () => {
    let allActivities: { activity: Activity; category: string }[] = [];

    if (selectedCity === 'All') {
      cityData.forEach(city => {
        Object.entries(city.categories).forEach(([category, activities]) => {
          if (selectedCategory === 'All' || category === selectedCategory) {
            activities.forEach(activity => {
              allActivities.push({ activity, category });
            });
          }
        });
      });
    } else {
      Object.entries(selectedCity.categories).forEach(([category, activities]) => {
        if (selectedCategory === 'All' || category === selectedCategory) {
          activities.forEach(activity => {
            allActivities.push({ activity, category });
          });
        }
      });
    }

    return allActivities;
  };

  const activities = getActivities();

  if (activities.length === 0) return <p>No activities found for the selected criteria.</p>;

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-xl font-semibold mb-4 capitalize">
        {selectedCategory === 'All' ? 'All Categories' : selectedCategory} in {selectedCity === 'All' ? 'All Locations' : selectedCity.name}
      </h3>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map(({ activity: item, category }, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div
                className={`activity-card bg-white shadow-lg rounded-lg overflow-hidden ${item.price > 0 ? 'cursor-move' : 'cursor-not-allowed'} hover:shadow-xl transition-shadow`}
                draggable={item.price > 0}
                onDragStart={(e) => handleDragStart(e, item, category)}
                onDragEnd={handleDragEnd}
                onClick={() => setSelectedActivity(item)}
              >
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h4 className="font-semibold text-xl mb-2">{item.name}</h4>
                  <p className="text-sm text-gray-600">{category}</p>
                  {item.price > 0 && <p className="text-sm font-bold">${item.price.toFixed(2)}</p>}
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{item.name}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <img src={item.image} alt={item.name} className="w-full h-64 object-cover rounded mb-2" />
                <p className="font-semibold">{item.description}</p>
                <p className="font-semibold">Location: {item.location}</p>
                {item.price > 0 && (
                  <>
                    <p className="font-semibold">Base Price: ${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-4">
                      <label htmlFor="guestCount" className="font-semibold">Number of Guests:</label>
                      <Select onValueChange={(value) => setGuestCount(Number(value))}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="font-semibold">Total Price: ${(item.price * guestCount).toFixed(2)}</p>
                  </>
                )}
                <p className="font-semibold">Amenities: {item.amenities.join(', ')}</p>
                <p className="font-semibold">Category: {category}</p>
                {item.price === 0 && (
                  <p className="text-red-500">This activity cannot be added to the itinerary.</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}