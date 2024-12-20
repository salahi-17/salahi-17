import React, { useState } from 'react';
import { format, differenceInDays, addDays, isBefore, isWithinInterval, startOfDay, isAfter, isSameDay } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { Schedule, ScheduleItem } from './types';
import { toast } from '@/components/ui/use-toast';
import { useInView } from 'react-intersection-observer';
import LazyImage from '@/components/LazyImage';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ScheduleViewProps {
  selectedDate: Date;
  startDate: Date;
  endDate: Date;  // Make sure endDate is in props
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



interface HotelDates {
  [hotelId: string]: {
    from: Date;
    to: Date;
  };
}

interface DateRange {
  from: Date;
  to: Date;
}

interface HotelBooking {
  hotelId: string;
  dates: DateRange;
  bookingId: string;
}



export default function ScheduleView({
  selectedDate,
  startDate,
  endDate,
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
  const [currentDate, setCurrentDate] = useState<DateRange>({
    from: startDate,
    to: startDate
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentHotel, setCurrentHotel] = useState<string | null>(null);

  const handleHotelDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData("application/json");
      if (!data) return;
      
      const item = JSON.parse(data) as ScheduleItem & { totalPrice?: number };
      if (item.category.toLowerCase() === 'hotel') {
        setCurrentHotel(item.id);
        setIsCalendarOpen(true);
        
        // Initialize the hotel in schedule
        const newSchedule = { ...schedule };
        const dateKey = format(startDate, 'yyyy-MM-dd');
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
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range?.from || !range?.to || !currentHotel) return;

    if (isBefore(range.to, range.from)) {
      toast({
        title: "Invalid date range",
        description: "End date cannot be before start date",
        variant: "destructive"
      });
      return;
    }

    if (isBefore(range.from, startDate) || isAfter(range.to, endDate)) {
      toast({
        title: "Invalid date range",
        description: "Selected dates must be within the plan duration",
        variant: "destructive"
      });
      return;
    }

    // Check for overlaps
    if (Object.entries(schedule).some(([dateKey]) => {
      const date = new Date(dateKey);
      return isWithinInterval(date, { start: range.from, end: range.to }) &&
             schedule[dateKey].Accommodation.length > 0;
    })) {
      toast({
        title: "Date overlap",
        description: "Selected dates overlap with an existing booking",
        variant: "destructive"
      });
      return;
    }

    // Update schedule with new dates
    const newSchedule = { ...schedule };
    let currentDate = range.from;

    while (!isAfter(currentDate, range.to)) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      if (!newSchedule[dateKey]) {
        newSchedule[dateKey] = {
          Accommodation: [],
          Morning: [],
          Afternoon: [],
          Evening: [],
          Night: []
        };
      }

      const hotel = Object.values(schedule)
        .flatMap(day => day.Accommodation)
        .find(h => h.id === currentHotel);

      if (hotel) {
        newSchedule[dateKey].Accommodation = [hotel];
      }

      currentDate = addDays(currentDate, 1);
    }

    updateSchedule(newSchedule);
    setIsCalendarOpen(false);
    setCurrentHotel(null);
  };

  return (
    <div className="flex flex-col w-96 h-full bg-white">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold">Hotels</h1>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg min-h-[200px] space-y-4 p-4"
          onDrop={handleHotelDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {Object.values(schedule)
            .flatMap(day => day.Accommodation)
            .filter((hotel, index, self) => 
              self.findIndex(h => h.id === hotel.id) === index
            )
            .map((hotel) => (
              <div key={hotel.id} className="relative rounded-lg overflow-hidden">
                <LazyImage
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-2">
                  <div className="flex justify-between items-start">
                    <span className="text-white font-medium">{hotel.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newSchedule = { ...schedule };
                        Object.keys(newSchedule).forEach(dateKey => {
                          newSchedule[dateKey].Accommodation = 
                            newSchedule[dateKey].Accommodation.filter(h => h.id !== hotel.id);
                        });
                        updateSchedule(newSchedule);
                      }}
                    >
                      <TrashIcon className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-white text-sm">
                      Total: ${hotel.price.toFixed(2)}
                    </div>
                    {/* Find dates for this hotel */}
                    {Object.entries(schedule).some(([dateKey, day]) => 
                      day.Accommodation.some(h => h.id === hotel.id)
                    ) && (
                      <div className="text-white text-sm">
                        {Object.entries(schedule).reduce((dates, [dateKey, day]) => {
                          if (day.Accommodation.some(h => h.id === hotel.id)) {
                            if (!dates.start) dates.start = new Date(dateKey);
                            dates.end = new Date(dateKey);
                          }
                          return dates;
                        }, { start: null, end: null } as { start: Date | null, end: Date | null })
                        .start && format(
                          new Date(Object.entries(schedule).find(([_, day]) => 
                            day.Accommodation.some(h => h.id === hotel.id)
                          )![0]
                        ), 'MMM dd')} -
                        {format(
                          new Date(Object.entries(schedule).reverse().find(([_, day]) => 
                            day.Accommodation.some(h => h.id === hotel.id)
                          )![0]
                        ), 'MMM dd')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          {!Object.values(schedule).some(day => day.Accommodation.length > 0) && (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <PlusIcon className="h-12 w-12 mb-2" />
              <p>Drag and drop hotels here</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Dates</DialogTitle>
          </DialogHeader>
          <Calendar
            mode="range"
            selected={{
              from: currentDate.from,
              to: currentDate.to
            }}
            onSelect={(range: any) => handleDateSelect(range)}
            numberOfMonths={2}
            defaultMonth={startDate}
            fromDate={startDate}
            toDate={endDate}
          />
        </DialogContent>
      </Dialog>

      <div className="p-4 border-t">
        <Button 
          onClick={onSavePlan}
          className="w-full"
          disabled={!Object.values(schedule).some(day => day.Accommodation.length > 0)}
        >
          Confirm Hotels
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