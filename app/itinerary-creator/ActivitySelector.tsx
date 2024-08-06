import React from 'react';
import { Activity, City } from './types';

interface ActivitySelectorProps {
  selectedCity: City | null;
  selectedCategory: string | null;
}

export default function ActivitySelector({ selectedCity, selectedCategory }: ActivitySelectorProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Activity) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ ...item, type: selectedCategory }));
    if (e.currentTarget.classList.contains('activity-card')) {
      e.currentTarget.classList.add('dragging');
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.classList.contains('activity-card')) {
      e.currentTarget.classList.remove('dragging');
    }
  };

  if (!selectedCity || !selectedCategory) return null;

  const activities = selectedCity[selectedCategory as keyof Pick<City, 'attractions' | 'tours' | 'hotels'>];

  if (!Array.isArray(activities)) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-xl font-semibold mb-4 capitalize">{selectedCategory}</h3>
      <div className="grid grid-cols-2 gap-2">
      {activities.map((item, index) => (
        <div
          key={index}
          className="activity-card bg-gray-100 p-4 rounded cursor-move hover:bg-gray-200 transition-colors flex flex-col items-center w-96"
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragEnd={handleDragEnd}
        >
          <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded mb-2" />
          <h4 className="font-semibold text-center">{item.name}</h4>
          <p className="text-sm text-gray-600 text-center mt-1">{item.description}</p>
        </div>
      ))}
      </div>
    </div>
  );
}