import React from 'react';
import { format, differenceInDays } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { Schedule, ScheduleItem } from './types';
import { toast } from '@/components/ui/use-toast';
import { useInView } from 'react-intersection-observer';
import LazyImage from '@/components/LazyImage';

interface ScheduleViewProps {
  selectedDate: Date;
  startDate: Date;
  schedule: Schedule;
  updateSchedule: (newSchedule: Schedule) => void;
  planName: string;
  onPlanNameChange: (newName: string) => void;
  onSavePlan: () => void;
  activeTab?: 'hotels' | 'activities';
}


interface ScheduleItemCardProps {
  item: ScheduleItem;
  onRemove: () => void;
}


export default function ScheduleView({ 
  selectedDate, 
  startDate, 
  schedule, 
  updateSchedule, 
  planName, 
  onPlanNameChange, 
  onSavePlan,
  activeTab = 'hotels' 
}: ScheduleViewProps) {
    const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  // In ScheduleView component
const handleDrop = (e: React.DragEvent<HTMLDivElement>, timeSlot: string) => {
  e.preventDefault();
  try {
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;
    
    const item = JSON.parse(data) as ScheduleItem & { totalPrice?: number };
    const isHotel = item.category.toLowerCase() === 'hotel';
    const dateKey = format(selectedDate, 'yyyy-MM-dd');

    if (isHotel && timeSlot === 'Accommodation') {
      // Handle hotel drop
      const newSchedule = { ...schedule };
      if (!newSchedule[dateKey]) {
        newSchedule[dateKey] = {
          Accommodation: [],
          Morning: [],
          Afternoon: [],
          Evening: [],
          Night: []
        };
      }

      newSchedule[dateKey].Accommodation = [{
        ...item,
        price: item.totalPrice || item.price,
        guestCount: item.guestCount || 1
      }];

      updateSchedule(newSchedule);
    } else if (!isHotel) {
      // Check if there's a hotel for this day
      const hasHotel = schedule[dateKey]?.Accommodation?.length > 0;
      if (!hasHotel) {
        toast({
          title: "Hotel Required",
          description: "Please select a hotel for this day before adding activities.",
          duration: 3000,
          variant: "destructive",
        });
        return;
      }

      // Handle activity drop
      const existingItems = schedule[dateKey]?.[timeSlot] || [];
      if (!existingItems.some(existingItem => existingItem.id === item.id)) {
        const newSchedule = { ...schedule };
        if (!newSchedule[dateKey]) {
          newSchedule[dateKey] = {
            Accommodation: [],
            Morning: [],
            Afternoon: [],
            Evening: [],
            Night: []
          };
        }

        newSchedule[dateKey][timeSlot] = [
          ...existingItems,
          {
            ...item,
            price: item.totalPrice || item.price,
            guestCount: item.guestCount || 1
          }
        ];

        updateSchedule(newSchedule);
      }
    }
  } catch (error) {
    console.error("Error handling drop:", error);
  }
};

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeScheduleItem = (timeSlot: string, index: number) => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const newSchedule = { ...schedule };
    newSchedule[dateKey][timeSlot] = newSchedule[dateKey][timeSlot].filter((_, i) => i !== index);
    updateSchedule(newSchedule);
  };

  if (activeTab === 'hotels') {
    return (
      <div className="flex flex-col w-96 h-full bg-white relative">
        <div className="px-4 pt-6 pb-4 ">
          <h1 className="text-2xl font-bold">
            Accommodation {differenceInDays(selectedDate, startDate) + 1}
          </h1>
        </div>

        {/* Accommodation drop area */}
        <div className="flex-1 overflow-auto p-4 pb-24">
             <div 
            className="border-2 border-dashed border-gray-300 p-4 rounded-md min-h-[200px] space-y-4"
            onDrop={(e) => handleDrop(e, 'Accommodation')}
            onDragOver={(e) => e.preventDefault()}
          >
            {schedule[format(selectedDate, 'yyyy-MM-dd')]?.Accommodation?.length > 0 ? (
              schedule[format(selectedDate, 'yyyy-MM-dd')].Accommodation.map((item, index) => (
                <ScheduleItemCard
                  key={`${item.id}-${index}`}
                  item={item}
                  onRemove={() => removeScheduleItem('Accommodation', index)}
                />
              ))
            ) : (
              <div className="text-gray-400 text-center py-2">
                Drag and drop accommodation
              </div>
            )}
          </div>
        </div>

        {/* Additional Days Button */}
        <div className="p-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {/* Add logic for multiple days selection */}}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add More Days
          </Button>
        </div>

        {/* Save Plan Button */}
        <div className="absolute bottom-0 left-0 right-0  bg-white p-4">
          <Button
            onClick={() => {
              // Add confirmation logic here
              onSavePlan();
            }}
            className="w-full"
          >
            Confirm accommodation
          </Button>
          <Button onClick={onSavePlan} className="w-full mt-2" variant="outline">
            Save Plan
          </Button>
        </div>
      </div>
    );
  }

  // Activities view
  return (
    <div className="flex flex-col w-96 h-full bg-white relative">
      <div className="px-4 pt-6 pb-4 ">
        <h1 className="text-2xl font-bold">
          Day {differenceInDays(selectedDate, startDate) + 1}
        </h1>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-32">
      <div className="py-4 space-y-4 border-t-2 border-gray-200 ">
          {['Morning', 'Afternoon', 'Evening', 'Night'].map((timeSlot) => (
            <div key={timeSlot} className="flex flex-col gap-2">
              <span className="font-semibold">{timeSlot}</span>
              <div
                className="border-2 border-dashed border-gray-300 p-2 rounded-md min-h-[120px]"
                onDrop={(e) => handleDrop(e, timeSlot)}
                onDragOver={(e) => e.preventDefault()}
              >
                {schedule[format(selectedDate, 'yyyy-MM-dd')]?.[timeSlot]?.length > 0 ? (
                  schedule[format(selectedDate, 'yyyy-MM-dd')][timeSlot].map((item, index) => (
                    <ScheduleItemCard
                      key={`${item.id}-${index}`}
                      item={item}
                      onRemove={() => removeScheduleItem(timeSlot, index)}
                    />
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-2">
                    Drag and drop activities here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t-2 border-gray-200 bg-white p-4">
        <input
          type="text"
          value={planName}
          onChange={(e) => onPlanNameChange(e.target.value)}
          placeholder="Plan Name"
          className="w-full mb-2 px-3 py-2 border rounded-md"
        />
        <Button onClick={onSavePlan} className="w-full">
          Save Plan
        </Button>
      </div>
    </div>
  );
}

const ScheduleItemCard = React.memo(({ item, onRemove }: { item: ScheduleItem; onRemove: () => void }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="relative mb-2 rounded overflow-hidden">
      {inView && (
        <>
          <LazyImage
            src={item.image}
            alt={item.name}
            className="w-full h-24 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-2">
            <div className="flex justify-between items-start">
              <span className="text-white text-shadow">{item.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
              >
                <TrashIcon className="h-4 w-4 text-white" />
              </Button>
            </div>
            <div className="text-white text-sm">
              {item.price > 0 && <p>Total: ${item.price.toFixed(2)}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

ScheduleItemCard.displayName = 'ScheduleItemCard';