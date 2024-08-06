import React from 'react';
import { addDays, differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";

interface DaySelectorProps {
  tripDays: number;
  startDate: Date;
  selectedDate: Date;
  handleDaySelect: (day: number) => void;
  removeDay: (day: number) => void;
}

export default function DaySelector({ tripDays, startDate, selectedDate, handleDaySelect, removeDay }: DaySelectorProps) {
  return (
    <nav className="flex flex-col gap-2">
      {Array.from({ length: tripDays }, (_, i) => i + 1).map((day) => (
        <div key={day} className="flex items-center justify-between">
          <Button
            variant={differenceInDays(selectedDate, addDays(startDate, day - 1)) === 0 ? "default" : "ghost"}
            className="justify-between flex-grow"
            onClick={() => handleDaySelect(day)}
          >
            <span>
              Day {day}
            </span>
            {day !== 1 && (
              <TrashIcon
                className="h-4 w-4 ml-2 text-red-500 hover:text-red-700 flex-end"
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
  );
}