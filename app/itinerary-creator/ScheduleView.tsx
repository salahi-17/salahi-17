import React, { useState, useEffect } from 'react';
import { format, differenceInDays, addDays, isBefore, isWithinInterval, startOfDay, isAfter, isSameDay, eachDayOfInterval } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { Schedule, ScheduleItem } from './types';
import { toast } from '@/components/ui/use-toast';
import { useInView } from 'react-intersection-observer';
import LazyImage from '@/components/LazyImage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";

interface HotelDateRange {
  from: Date;
  to: Date;
}

interface HotelBooking {
  hotelId: string;
  hotel: ScheduleItem;
  dateRange: HotelDateRange;
}

interface ScheduleViewProps {
  selectedDate: Date;
  startDate: Date;
  endDate: Date;
  schedule: Schedule;
  updateSchedule: (newSchedule: Schedule) => void;
  planName: string;
  onPlanNameChange: (newName: string) => void;
  onSavePlan: () => void;
  activeTab?: 'hotels' | 'activities';
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentHotel, setCurrentHotel] = useState<ScheduleItem | null>(null);
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>();

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

  // Initialize hotelBookings from schedule on component mount
  useEffect(() => {
    const bookings: HotelBooking[] = [];
    const processedHotels = new Map<string, { dates: Set<string>, hotel: ScheduleItem }>();

    // First, collect all dates for each hotel
    Object.entries(schedule).forEach(([dateStr, daySchedule]) => {
      daySchedule.Accommodation.forEach((hotel) => {
        if (!processedHotels.has(hotel.id)) {
          processedHotels.set(hotel.id, { 
            dates: new Set([dateStr]), 
            hotel 
          });
        } else {
          processedHotels.get(hotel.id)?.dates.add(dateStr);
        }
      });
    });

    // Create bookings for consecutive dates only
    processedHotels.forEach(({ dates, hotel }, hotelId) => {
      const sortedDates = Array.from(dates)
        .map(date => new Date(date))
        .sort((a, b) => a.getTime() - b.getTime());

      if (sortedDates.length > 0) {
        bookings.push({
          hotelId: hotelId,
          hotel,
          dateRange: {
            from: sortedDates[0],
            to: sortedDates[sortedDates.length - 1]
          }
        });
      }
    });

    setHotelBookings(bookings);
  }, [schedule]);

  const validateDateRange = (range: HotelDateRange, currentHotelId: string): boolean => {
    // For single day trips, enforce selecting only that day
    if (isSameDay(startDate, endDate)) {
      if (!isSameDay(range.from, startDate) || !isSameDay(range.to, startDate)) {
        toast({
          title: "Invalid date selection",
          description: "This is a single day trip. You can only select today's date.",
          variant: "destructive"
        });
        return false;
      }
      return true;
    }

    if (isBefore(range.to, range.from)) {
      toast({
        title: "Invalid date range",
        description: "End date cannot be before start date",
        variant: "destructive"
      });
      return false;
    }

    const tripStartDay = startOfDay(startDate);
    const tripEndDay = startOfDay(endDate);
    const rangeStartDay = startOfDay(range.from);
    const rangeEndDay = startOfDay(range.to);

    // Check if dates are within trip duration
    if (isBefore(rangeStartDay, tripStartDay) || isAfter(rangeEndDay, tripEndDay)) {
      toast({
        title: "Invalid date range",
        description: "Selected dates must be within the trip duration",
        variant: "destructive"
      });
      return false;
    }

    // Check for overlaps with other hotels, excluding the current hotel's bookings
    const hasOverlap = hotelBookings.some(booking => 
      booking.hotel.id !== currentHotelId && // Skip checking against the same hotel
      isOverlapping(range, booking.dateRange)
    );

    if (hasOverlap) {
      toast({
        title: "Date overlap",
        description: "Selected dates overlap with another hotel booking",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const isOverlapping = (range1: HotelDateRange, range2: HotelDateRange): boolean => {
    return (
      isWithinInterval(range1.from, { start: range2.from, end: range2.to }) ||
      isWithinInterval(range1.to, { start: range2.from, end: range2.to }) ||
      isWithinInterval(range2.from, { start: range1.from, end: range1.to }) ||
      isWithinInterval(range2.to, { start: range1.from, end: range1.to })
    );
  };

  const handleHotelDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData("application/json");
      if (!data) return;
      
      const item = JSON.parse(data) as ScheduleItem & { totalPrice?: number };
      if (item.category.toLowerCase() === 'hotel') {
        // Check if hotel already exists
        const existingBooking = hotelBookings.find(booking => booking.hotelId === item.id);
        if (existingBooking) {
          toast({
            title: "Hotel already added",
            description: "This hotel is already in your itinerary. You can modify its dates by clicking the date button.",
            duration: 3000,
          });
          return;
        }

        const hotel = {
          ...item,
          price: item.totalPrice || item.price,
          guestCount: item.guestCount || 1
        };

        // For single day trips, automatically add the hotel without showing calendar
        if (isSameDay(startDate, endDate)) {
          const newBooking: HotelBooking = {
            hotelId: hotel.id,
            hotel,
            dateRange: {
              from: startDate,
              to: startDate
            }
          };

          setHotelBookings(prev => [...prev, newBooking]);

          const dateKey = format(startDate, 'yyyy-MM-dd');
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
          newSchedule[dateKey].Accommodation = [hotel];
          updateSchedule(newSchedule);
        } else {
          setCurrentHotel(hotel);
          setSelectedDateRange(undefined);
          setIsCalendarOpen(true);
        }
      }
    } catch (error) {
      console.error("Error handling drop:", error);
      toast({
        title: "Error",
        description: "Failed to process hotel selection",
        variant: "destructive"
      });
    }
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range?.from || !currentHotel) return;

    // Update selected date range for the calendar
    setSelectedDateRange(range);

    // Only proceed with booking if we have both dates
    if (!range.to) return;

    const newRange: HotelDateRange = {
      from: startOfDay(range.from),
      to: startOfDay(range.to)
    };

    if (!validateDateRange(newRange, currentHotel.id)) return;

    // Remove any existing bookings for this hotel
    const newBookings = hotelBookings.filter(booking => 
      booking.hotel.id !== currentHotel.id
    );

    // Add new booking
    const newBooking: HotelBooking = {
      hotelId: currentHotel.id,
      hotel: currentHotel,
      dateRange: newRange
    };

    setHotelBookings([...newBookings, newBooking]);

    // Update schedule
    const newSchedule = { ...schedule };

    // First, clear this hotel from all dates
    Object.keys(newSchedule).forEach(dateKey => {
      if (newSchedule[dateKey]) {
        newSchedule[dateKey].Accommodation = 
          newSchedule[dateKey].Accommodation.filter(h => h.id !== currentHotel.id);
      }
    });

    // Add hotel to all dates in the range
    const allDates = eachDayOfInterval({
      start: newRange.from,
      end: newRange.to
    });

    allDates.forEach(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      if (!newSchedule[dateKey]) {
        newSchedule[dateKey] = {
          Accommodation: [],
          Morning: [],
          Afternoon: [],
          Evening: [],
          Night: []
        };
      }
      newSchedule[dateKey].Accommodation = [currentHotel];
    });

    updateSchedule(newSchedule);
    setIsCalendarOpen(false);
    setCurrentHotel(null);
    setSelectedDateRange(undefined);
  };

  const removeHotelBooking = (hotelId: string) => {
    // Get the booking being removed
    const bookingToRemove = hotelBookings.find(booking => booking.hotelId === hotelId);
    if (!bookingToRemove) return;

    // Remove from bookings state
    setHotelBookings(prev => prev.filter(booking => booking.hotelId !== hotelId));

    // Update schedule
    const newSchedule = { ...schedule };

    // Remove this hotel from all dates in the schedule
    Object.keys(newSchedule).forEach(dateKey => {
      if (newSchedule[dateKey]) {
        newSchedule[dateKey].Accommodation = 
          newSchedule[dateKey].Accommodation.filter(h => h.id !== bookingToRemove.hotel.id);
      }
    });

    updateSchedule(newSchedule);
  };

  const updateHotelDates = (hotelId: string, newRange: HotelDateRange) => {
    if (!validateDateRange(newRange, hotelId)) return;

    // Update bookings
    setHotelBookings(prev => prev.map(booking => 
      booking.hotelId === hotelId 
        ? { ...booking, dateRange: newRange }
        : booking
    ));

    // Update schedule
    const hotel = hotelBookings.find(b => b.hotelId === hotelId)?.hotel;
    if (!hotel) return;

    const newSchedule = { ...schedule };

    // First, remove hotel from all dates
    Object.keys(newSchedule).forEach(dateKey => {
      newSchedule[dateKey].Accommodation = 
        newSchedule[dateKey].Accommodation.filter(h => h.id !== hotelId);
    });

    // Then, add hotel to new date range
    const dateRange = eachDayOfInterval({ start: newRange.from, end: newRange.to });
    dateRange.forEach(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      if (!newSchedule[dateKey]) {
        newSchedule[dateKey] = {
          Accommodation: [],
          Morning: [],
          Afternoon: [],
          Evening: [],
          Night: []
        };
      }
      newSchedule[dateKey].Accommodation = [hotel];
    });

    updateSchedule(newSchedule);
  };

  if (activeTab === 'hotels') {
    return (
      <div className="flex flex-col w-96 h-full bg-white">
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-2xl font-bold">Hotels</h1>
          <p className="text-sm text-gray-500 mt-1">
            Select hotels for your stay
          </p>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg min-h-[200px] space-y-4 p-4"
            onDrop={handleHotelDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {hotelBookings.length > 0 ? (
              hotelBookings.map((booking) => (
                <div key={booking.hotelId} className="relative rounded-lg overflow-hidden bg-white shadow-md">
                  <LazyImage
                    src={booking.hotel.image}
                    alt={booking.hotel.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-3">
                    <div className="flex justify-between items-start">
                      <span className="text-white font-medium">{booking.hotel.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeHotelBooking(booking.hotelId)}
                      >
                        <TrashIcon className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-white text-sm">
                        ${booking.hotel.price.toFixed(2)} per night
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 bg-white/90 hover:bg-white"
                        onClick={() => {
                          setCurrentHotel(booking.hotel);
                          setSelectedDateRange({
                            from: booking.dateRange.from,
                            to: booking.dateRange.to
                          });
                          setIsCalendarOpen(true);
                        }}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {format(booking.dateRange.from, 'MMM dd')} - {format(booking.dateRange.to, 'MMM dd')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <PlusIcon className="h-12 w-12 mb-2" />
                <p>Drag and drop hotels here</p>
              </div>
            )}
          </div>
        </div>

        <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>
                {currentHotel ? (
                  <>Select dates for {currentHotel.name}</>
                ) : (
                  <>Select Hotel Dates</>
                )}
              </DialogTitle>
            </DialogHeader>
            <Calendar
              mode="range"
              selected={selectedDateRange}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              defaultMonth={startDate}
              disabled={(date) => 
                isBefore(date, startDate) || 
                isAfter(date, endDate)
              }
              initialFocus
            />
          </DialogContent>
        </Dialog>

        <div className="p-4 border-t">
          <Button 
            onClick={onSavePlan}
            className="w-full"
            disabled={hotelBookings.length === 0}
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