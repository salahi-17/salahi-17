import React, { useState } from 'react';
import { Activity, City } from './types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ActivitySelectorProps {
  selectedCity: City | 'All';
  selectedCategory: string;
  cityData: City[];
}

export default function ActivitySelector({ selectedCity, selectedCategory, cityData }: ActivitySelectorProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Activity, category: string) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ ...item, type: category }));
    if (e.currentTarget.classList.contains('activity-card')) {
      e.currentTarget.classList.add('dragging');
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
                className="activity-card bg-white shadow-lg rounded-lg overflow-hidden cursor-move hover:shadow-xl transition-shadow"
                draggable
                onDragStart={(e) => handleDragStart(e, item, category)}
                onDragEnd={handleDragEnd}
                onClick={() => setSelectedActivity(item)}
              >
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h4 className="font-semibold text-xl mb-2">{item.name}</h4>
                  <p className="text-sm text-gray-600">{category}</p>
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
                <p className="font-semibold">Price: ${item.price.toFixed(2)}</p>
                <p className="font-semibold">Amenities: {item.amenities.join(', ')}</p>
                <p className="font-semibold">Category: {category}</p>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}