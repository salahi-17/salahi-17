import React from 'react';
import { format, differenceInDays } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
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
}

interface ScheduleItemCardProps {
  item: ScheduleItem;
  onRemove: () => void;
}

const ScheduleItemCard = React.memo(({ item, onRemove }: ScheduleItemCardProps) => {
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
              <p>Guests: {item.guestCount}</p>
              {item.price > 0 && <p>Total: ${item.price.toFixed(2)}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

ScheduleItemCard.displayName = 'ScheduleItemCard';

export default function ScheduleView({ selectedDate, startDate, schedule, updateSchedule, planName, onPlanNameChange, onSavePlan }: ScheduleViewProps) {
  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, timeSlot: string) => {
    e.preventDefault();
    try {
      const item = JSON.parse(e.dataTransfer.getData("application/json")) as ScheduleItem & { totalPrice?: number };
      if (item.category.toLowerCase() !== 'hotel') {
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        
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
  
          const finalPrice = item.totalPrice || item.price * (item.guestCount || 1);
  
          const newItem: ScheduleItem = {
            ...item,
            price: finalPrice,
            guestCount: item.guestCount || 1
          };
  
          newSchedule[dateKey] = {
            ...newSchedule[dateKey],
            [timeSlot]: [...existingItems, newItem]
          };
  
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

  return (
    <div className="flex flex-col w-96 h-full bg-white relative">
      <div className="px-4 pt-6 pb-4 border-b">
        <h1 className="text-2xl font-bold">
          Day {differenceInDays(selectedDate, startDate) + 1}
        </h1>
      </div>

      <div className="flex-1 overflow-auto px-4">
        <div className="py-4 space-y-4">
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="flex flex-col gap-2">
              <span className="font-semibold">{timeSlot}</span>
              <div
                className="border-2 border-dashed border-gray-300 p-2 rounded-md min-h-[120px]"
                onDrop={(e) => handleDrop(e, timeSlot)}
                onDragOver={handleDragOver}
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

      <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4 flex items-center gap-4">
        <input
          type="text"
          value={planName}
          onChange={(e) => onPlanNameChange(e.target.value)}
          placeholder="Enter Plan Name"
          className="flex-1 px-3 py-2 border rounded-md text-sm"
        />
        <Button onClick={onSavePlan} className="shrink-0">
          Save Plan
        </Button>
      </div>
      
      <div className="h-[72px]" />
    </div>
  );
}