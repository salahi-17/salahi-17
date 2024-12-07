import React from 'react';
import { format, differenceInDays } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { Schedule, ScheduleItem } from './types';

interface ScheduleViewProps {
  selectedDate: Date;
  startDate: Date;
  schedule: Schedule;
  updateSchedule: (newSchedule: Schedule) => void;
  planName: string;
  onPlanNameChange: (newName: string) => void;
  onSavePlan: () => void;
}

export default function ScheduleView({ selectedDate, startDate, schedule, updateSchedule, planName, onPlanNameChange, onSavePlan }: ScheduleViewProps) {
  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, timeSlot: string) => {
    e.preventDefault();
    try {
      const item = JSON.parse(e.dataTransfer.getData("application/json")) as ScheduleItem;
      if (item.category.toLowerCase() !== 'hotel') { // Only handle non-hotel items
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
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
          newSchedule[dateKey] = {
            ...newSchedule[dateKey],
            [timeSlot]: [...existingItems, {
              ...item,
              price: item.totalPrice,
              guestCount: item.guestCount
            }]
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
    <div className="flex flex-col w-96 h-full bg-white">
      {/* Scrollable content */}
      <div className="flex-1 overflow-hidden">
        <div className="px-4 pt-6">
          <h1 className="text-2xl font-bold">
            Day {differenceInDays(selectedDate, startDate) + 1}
          </h1>
        </div>

        <ScrollArea className="h-[calc(100vh-160px)] px-4">
          <div className="grid gap-4 py-6">
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
                      <div key={index} className="relative mb-2 rounded overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-24 object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-2">
                          <div className="flex justify-between items-start">
                            <span className="text-white text-shadow">{item.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeScheduleItem(timeSlot, index)}
                            >
                              <TrashIcon className="h-4 w-4 text-white" />
                            </Button>
                          </div>
                          <div className="text-white text-sm">
                            <p>Guests: {item.guestCount}</p>
                            {item.price > 0 && <p>Total: ${item.price.toFixed(2)}</p>}
                          </div>
                        </div>
                      </div>
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
        </ScrollArea>
      </div>

      {/* Fixed bottom section */}
      <div className="border-t bg-white p-4 flex items-center gap-4 w-full">
        <input
          type="text"
          value={planName}
          onChange={(e) => onPlanNameChange(e.target.value)}
          placeholder="Enter Plan Name"
          className="flex-1 px-3 py-2 border rounded-md text-sm"
        />
        <Button onClick={onSavePlan}>
          Save Plan
        </Button>
      </div>
    </div>
  );
}