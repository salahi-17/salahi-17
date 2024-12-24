import React from 'react';
import { addDays, differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DaySelectorProps {
  tripDays: number;
  startDate: Date;
  selectedDate: Date;
  handleDaySelect: (day: number) => void;
  removeDay: (day: number) => void;
}

export default function DaySelector({ tripDays, startDate, selectedDate, handleDaySelect, removeDay }: DaySelectorProps) {
  return (
    <ScrollArea className="h-[155px] pr-4 day-selector">
      <nav className="flex flex-col gap-2">
        {Array.from({ length: Math.max(tripDays, 1) }, (_, i) => i + 1).map((day) => (
          <div key={day} className="flex items-center justify-between h-12">
            <Button
              variant={differenceInDays(selectedDate, addDays(startDate, day - 1)) === 0 ? "default" : "ghost"}
              className="justify-between w-full"
              onClick={() => handleDaySelect(day)}
            >
              <span className='text-lg'>Day {day}</span>
              {day !== 1 && (
                <TrashIcon
                  className="h-4 w-4 ml-2 text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDay(day);
                  }}
                />
              )}
            </Button>
          </div>
        ))}
      </nav>
    </ScrollArea>
  );
}