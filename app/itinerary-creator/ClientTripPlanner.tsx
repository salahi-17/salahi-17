"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format, addDays, differenceInDays, parse, eachDayOfInterval, startOfDay, isAfter, isBefore, isSameDay } from "date-fns";
import { CalendarIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import DaySelector from './DaySelector';
import ScheduleView from './ScheduleView';
import ActivitySelector from './ActivitySelector';
import CheckoutButton from './CheckoutButton';
import { City, Schedule, Activity, CityCategories, ScheduleItem } from './types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LazyImage from '@/components/LazyImage';
import { List, MapIcon } from 'lucide-react';
import MapView from './MapView';

interface ClientTripPlannerProps {
  initialCityData: Activity[];
  categories: string[];
  isAuthenticated: boolean;
  userId?: string;
}

type TimeSlot = 'Accommodation' | 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export default function ClientTripPlanner({ initialCityData, categories }: ClientTripPlannerProps) {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);

  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date>(tomorrow);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [tripDays, setTripDays] = useState<number>(2);
  const [selectedCity, setSelectedCity] = useState<City | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [schedule, setSchedule] = useState<Schedule>({});
  const [cityData, setCityData] = useState<City[]>([]);
  const [planName, setPlanName] = useState<string>("");
  const [itineraryId, setItineraryId] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'hotels' | 'activities'>('hotels');
  const [view, setView] = useState<'list' | 'map'>('list');
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [hotelDateRanges, setHotelDateRanges] = useState<{
    [hotelId: string]: {
      hotel: ScheduleItem;
      startDate: Date;
      endDate: Date;
    };
  }>({});

  const searchParams = useSearchParams();

  const getTimeSlotForOrder = (order: number): TimeSlot => {
    if (order < 0) return 'Accommodation';
    if (order < 10) return 'Morning';
    if (order < 20) return 'Afternoon';
    if (order < 30) return 'Evening';
    return 'Night';
  };

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setItineraryId(id);
      fetchItinerary(id);
      // Clean up localStorage when loading a saved itinerary
      localStorage.removeItem('unsavedItinerary');
    } else {
      // Load from local storage if no ID is provided
      try {
        const savedItinerary = localStorage.getItem('unsavedItinerary');
        if (savedItinerary) {
          const parsedItinerary = JSON.parse(savedItinerary);
          setPlanName(parsedItinerary.planName);
          setStartDate(new Date(parsedItinerary.startDate));
          setEndDate(new Date(parsedItinerary.endDate));
          setTripDays(parsedItinerary.tripDays);
          setSchedule(parsedItinerary.schedule);
          setSelectedDate(new Date(parsedItinerary.selectedDate));
        } else {
          // Initialize schedule with default dates
          const initialStartDate = today;
          const initialEndDate = today;
          setStartDate(initialStartDate);
          setEndDate(initialEndDate);
          setSelectedDate(initialStartDate);
          setTripDays(1);
          initializeSchedule(initialStartDate, initialEndDate);
        }
      } catch (error) {
        console.warn('Error loading from localStorage:', error);
        // Initialize with defaults if loading fails
        const initialStartDate = today;
        const initialEndDate = today;
        setStartDate(initialStartDate);
        setEndDate(initialEndDate);
        setSelectedDate(initialStartDate);
        setTripDays(1);
        initializeSchedule(initialStartDate, initialEndDate);
      }
    }
  }, [searchParams, cityData]);

  useEffect(() => {
    // Calculate total price whenever the schedule changes
    let price = 0;
    Object.values(schedule).forEach(day => {
      Object.values(day).forEach(timeSlot => {
        timeSlot.forEach(item => {
          price += item.price;
        });
      });
    });
    setTotalPrice(price);


  }, [schedule]);

  useEffect(() => {
    const groupedData = initialCityData.reduce((acc, activity) => {
      if (!acc[activity.location]) {
        acc[activity.location] = { name: activity.location, categories: {} };
      }
      if (!acc[activity.location].categories[activity.category]) {
        acc[activity.location].categories[activity.category] = [];
      }
      acc[activity.location].categories[activity.category].push(activity);
      return acc;
    }, {} as Record<string, City>);
    setCityData(Object.values(groupedData));
  }, [initialCityData]);

  useEffect(() => {
    const newHotelRanges: {
      [hotelId: string]: {
        hotel: ScheduleItem;
        startDate: Date;
        endDate: Date;
      };
    } = {};

    // Sort dates to process them in order
    const dates = Object.keys(schedule).sort();

    dates.forEach(dateStr => {
      const hotels = schedule[dateStr].Accommodation;
      hotels.forEach(hotel => {
        const currentDate = new Date(dateStr);

        if (newHotelRanges[hotel.id]) {
          // Check if this date is consecutive
          const prevEnd = newHotelRanges[hotel.id].endDate;
          if (currentDate.getTime() - prevEnd.getTime() === 86400000) { // One day in milliseconds
            newHotelRanges[hotel.id].endDate = currentDate;
          }
        } else {
          newHotelRanges[hotel.id] = {
            hotel,
            startDate: currentDate,
            endDate: currentDate
          };
        }
      });
    });

    setHotelDateRanges(newHotelRanges);
  }, [schedule]);

  const fetchItinerary = async (id: string) => {
    try {
      const response = await fetch(`/api/itineraries/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch itinerary');
      }
      const itinerary = await response.json();

      // Transform the fetched data to match the local schedule structure
      const newSchedule: Schedule = {};

      itinerary.days.forEach((day: any) => {
        const dateKey = format(new Date(day.date), 'yyyy-MM-dd');
        newSchedule[dateKey] = {
          Accommodation: [],
          Morning: [],
          Afternoon: [],
          Evening: [],
          Night: []
        };

        day.items.forEach((item: any) => {
          const activity: ScheduleItem = {
            id: item.activity.id,
            name: item.activity.name,
            category: item.activity.category,
            location: item.activity.location,
            description: item.activity.description,
            price: item.activity.price,
            amenities: item.activity.amenities,
            image: item.activity.image,
            createdAt: item.activity.createdAt,
            updatedAt: item.activity.updatedAt,
            type: item.activity.category,
            guestCount: 1,
            latitude: undefined,
            longitude: undefined,
            rating: null,
            images: []
          };

          const timeSlot = getTimeSlotForOrder(item.order);

          // Check if the activity is a hotel
          if (activity.category.toLowerCase() === 'hotel') {
            newSchedule[dateKey].Accommodation = [activity];
          } else {
            // Ensure the time slot exists before pushing
            if (newSchedule[dateKey][timeSlot]) {
              newSchedule[dateKey][timeSlot].push(activity);
            } else {
              console.warn(`Unexpected time slot: ${timeSlot}`);
            }
          }
        });
      });

      // Set the state
      setPlanName(itinerary.name);
      setStartDate(new Date(itinerary.startDate));
      setEndDate(new Date(itinerary.endDate));
      setTripDays(itinerary.days.length);
      setSchedule(newSchedule);
      setSelectedDate(new Date(itinerary.startDate));

      // Remove from local storage as we've loaded a saved itinerary
      localStorage.removeItem('unsavedItinerary');
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      toast({
        title: "Error",
        description: "Failed to load the itinerary. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    }
  };



  const handleSavePlan = async () => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to save your plan.",
        duration: 3000,
      });
      router.push('/auth/signin');
      return;
    }

    try {
      const days = Object.entries(schedule).map(([date, daySchedule]) => ({
        date,
        items: Object.entries(daySchedule).flatMap(([timeSlot, activities]) =>
          activities.map((activity, index) => ({
            activityId: activity.id,
            order: getOrderForTimeSlot(timeSlot as TimeSlot) + index,
            notes: activity.notes || null
          }))
        )
      }));

      const method = itineraryId ? 'PUT' : 'POST';
      const url = itineraryId ? `/api/itineraries/${itineraryId}` : '/api/itineraries';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: planName,
          startDate,
          endDate,
          days
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Itinerary ${itineraryId ? 'updated' : 'saved'} successfully`,
          duration: 3000,
        });
        localStorage.removeItem('unsavedItinerary');
        router.push('/profile');
      } else {
        throw new Error(`Failed to ${itineraryId ? 'update' : 'save'} plan`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || `Failed to ${itineraryId ? 'update' : 'save'} your plan. Please try again.`,
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  const initializeSchedule = (start: Date, end: Date) => {
    const newSchedule: Schedule = {};
    const dateRange = eachDayOfInterval({ start, end });

    dateRange.forEach(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      newSchedule[dateKey] = {
        Accommodation: [],
        Morning: [],
        Afternoon: [],
        Evening: [],
        Night: []
      };
    });

    setSchedule(newSchedule);
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const selectedStartDate = startOfDay(date);
    const currentStartDate = startOfDay(startDate);

    // Calculate the difference in days to shift the schedule
    const daysDifference = differenceInDays(selectedStartDate, currentStartDate);

    // If new start date is after current end date, adjust end date
    if (isAfter(selectedStartDate, endDate)) {
      const newEndDate = selectedStartDate;
      setEndDate(newEndDate);
      setTripDays(1);

      // Shift schedule to new date
      const newSchedule: Schedule = {};
      const newDateKey = format(selectedStartDate, 'yyyy-MM-dd');

      // Preserve only the first day's data if it exists
      if (Object.keys(schedule).length > 0) {
        const firstDayData = Object.values(schedule)[0];
        newSchedule[newDateKey] = firstDayData;
      } else {
        newSchedule[newDateKey] = {
          Accommodation: [],
          Morning: [],
          Afternoon: [],
          Evening: [],
          Night: []
        };
      }

      updateSchedule(newSchedule);
    } else {
      // Keep current end date but shift all schedule items
      const days = differenceInDays(endDate, selectedStartDate) + 1;
      setTripDays(days);

      // Create new schedule with shifted dates
      const newSchedule: Schedule = {};

      Object.entries(schedule).forEach(([dateKey, daySchedule]) => {
        const currentDate = new Date(dateKey);
        const newDate = addDays(currentDate, daysDifference);
        const newDateKey = format(newDate, 'yyyy-MM-dd');

        // Only keep data that falls within the new date range
        if (!isBefore(newDate, selectedStartDate) && !isAfter(newDate, endDate)) {
          newSchedule[newDateKey] = daySchedule;
        }
      });

      // Add empty slots for any new dates without data
      const dateRange = eachDayOfInterval({ start: selectedStartDate, end: endDate });
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
      });

      updateSchedule(newSchedule);
    }

    setStartDate(selectedStartDate);
    setSelectedDate(selectedStartDate);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const selectedEndDate = startOfDay(date);

    // Validate end date is not before start date
    if (isBefore(selectedEndDate, startDate)) {
      toast({
        title: "Invalid date selection",
        description: "End date cannot be before start date",
        duration: 3000,
        variant: "destructive",
      });
      return;
    }

    setEndDate(selectedEndDate);
    const days = differenceInDays(selectedEndDate, startDate) + 1;
    setTripDays(days);

    // Create new schedule preserving existing data
    const newSchedule: Schedule = { ...schedule };

    // Add empty slots for new dates
    const dateRange = eachDayOfInterval({ start: startDate, end: selectedEndDate });
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
    });

    // Remove only dates that are now out of range
    Object.keys(newSchedule).forEach(dateKey => {
      const currentDate = new Date(dateKey);
      if (currentDate < startDate || currentDate > selectedEndDate) {
        delete newSchedule[dateKey];
      }
    });

    updateSchedule(newSchedule);
  };

  const removeDay = (dayToRemove: number) => {
    if (tripDays > 1) {
      const dateToRemove = addDays(startDate, dayToRemove - 1);
      const dateKeyToRemove = format(dateToRemove, 'yyyy-MM-dd');
      const newEndDate = addDays(endDate, -1);

      setEndDate(newEndDate);
      setTripDays(prevDays => prevDays - 1);

      // Remove the specific day and shift subsequent days
      const newSchedule = { ...schedule };
      delete newSchedule[dateKeyToRemove];

      // Shift all subsequent days back by one
      Object.keys(newSchedule)
        .sort()
        .forEach(dateKey => {
          if (new Date(dateKey) > dateToRemove) {
            const prevDateKey = format(addDays(new Date(dateKey), -1), 'yyyy-MM-dd');
            newSchedule[prevDateKey] = newSchedule[dateKey];
            delete newSchedule[dateKey];
          }
        });

      updateSchedule(newSchedule);

      // If the selected date was removed or is after the removed date,
      // update the selected date
      if (selectedDate >= dateToRemove) {
        setSelectedDate(addDays(selectedDate, -1));
      }
    }
  };

  const handleDaySelect = (day: number) => {
    setSelectedDate(addDays(startDate, day - 1));
  };

  const updateSchedule = (newSchedule: Schedule) => {
    setSchedule(newSchedule);
    if (!itineraryId) {
      try {
        const itineraryToSave = {
          planName,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          selectedDate: selectedDate.toISOString(),
          tripDays,
          schedule: newSchedule,
        };
        
        try {
          localStorage.setItem('unsavedItinerary', JSON.stringify(itineraryToSave));
        } catch (error: any) {
          // If quota exceeded, try to clear old data first
          if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            // Clear any old itineraries
            localStorage.removeItem('unsavedItinerary');
            
            // Try saving again
            try {
              localStorage.setItem('unsavedItinerary', JSON.stringify(itineraryToSave));
            } catch (retryError) {
              // If still failing, save minimal data
              const minimalItinerary = {
                planName,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                selectedDate: selectedDate.toISOString(),
                tripDays,
                // Only save essential schedule data
                schedule: Object.fromEntries(
                  Object.entries(newSchedule).map(([date, daySchedule]) => [
                    date,
                    {
                      ...daySchedule,
                      // Only save IDs and essential info for each activity
                      Accommodation: daySchedule.Accommodation.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        guestCount: item.guestCount
                      })),
                      Morning: daySchedule.Morning.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        guestCount: item.guestCount
                      })),
                      Afternoon: daySchedule.Afternoon.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        guestCount: item.guestCount
                      })),
                      Evening: daySchedule.Evening.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        guestCount: item.guestCount
                      })),
                      Night: daySchedule.Night.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        guestCount: item.guestCount
                      }))
                    }
                  ])
                )
              };
              localStorage.setItem('unsavedItinerary', JSON.stringify(minimalItinerary));
            }
          }
          // If error persists, log it but don't break the app
          console.warn('Could not save to localStorage:', error);
        }
      } catch (error) {
        console.warn('Error updating schedule:', error);
      }
    }
  };

  // Make sure this function is defined in your component
  const getOrderForTimeSlot = (timeSlot: TimeSlot): number => {
    switch (timeSlot) {
      case 'Accommodation': return -1;
      case 'Morning': return 0;
      case 'Afternoon': return 10;
      case 'Evening': return 20;
      case 'Night': return 30;
    }
  };

  const handleHotelDateChange = (hotelId: string, startDate: Date, endDate: Date) => {
    // Update the schedule with the new hotel dates
    const newSchedule = { ...schedule };
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    dateRange.forEach(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      if (newSchedule[dateKey]) {
        const hotel = Object.values(schedule)
          .flatMap(day => day.Accommodation)
          .find(h => h.id === hotelId);

        if (hotel) {
          newSchedule[dateKey].Accommodation = [hotel];
        }
      }
    });

    updateSchedule(newSchedule);
  };

  const handleHotelDrop = (e: React.DragEvent<HTMLDivElement>, dropDate: string) => {
    e.preventDefault();
    try {
      const item = JSON.parse(e.dataTransfer.getData("application/json"));
      if (item.category.toLowerCase() === 'hotel') {
        const newSchedule = { ...schedule };
        newSchedule[dropDate] = {
          ...newSchedule[dropDate],
          Accommodation: [{
            ...item,
            price: item.totalPrice,
            guestCount: item.guestCount
          }]
        };
        updateSchedule(newSchedule);
      }
    } catch (error) {
      console.error("Error handling hotel drop:", error);
    }
  };

  const ScheduleList = ({ schedule, selectedDate }: { schedule: Schedule; selectedDate: Date }) => {
    return (
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {Object.entries(schedule).map(([date, daySchedule]) => {
            const allItems = [
              ...daySchedule.Accommodation.map(item => ({ ...item, timeSlot: 'Accommodation' })),
              ...daySchedule.Morning.map(item => ({ ...item, timeSlot: 'Morning' })),
              ...daySchedule.Afternoon.map(item => ({ ...item, timeSlot: 'Afternoon' })),
              ...daySchedule.Evening.map(item => ({ ...item, timeSlot: 'Evening' })),
              ...daySchedule.Night.map(item => ({ ...item, timeSlot: 'Night' }))
            ];

            if (allItems.length === 0) return null;

            return (
              <div key={date} className="space-y-2">
                <h3 className="text-sm font-medium">Day {differenceInDays(new Date(date), startDate) + 1}</h3>
                {allItems.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="relative h-20 rounded-lg overflow-hidden"
                  >
                    <LazyImage
                      src={item.image}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 p-2 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-white text-sm font-medium">{item.name}</span>
                        <span className="text-white text-xs">{item.timeSlot}</span>
                      </div>
                      <div className="text-white text-xs">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <ScrollBar />
      </ScrollArea>
    );
  };

  return (
    <div className="flex h-[calc(100vh-130px)] w-full bg-gray-100">
      {/* Left Panel */}
      <div className="w-64 bg-white flex flex-col ">
        {/* Itinerary Status/List */}
        <div className="p-4 max-h-[296px]"> {/* Fixed height to show approximately 3 items */}
          <ScrollArea className="h-full pr-4">
            {activeTab === 'hotels' ? (
              <div className="space-y-2">
                {Object.keys(hotelDateRanges).length > 0 ? (
                  Object.values(hotelDateRanges).map(({ hotel, startDate, endDate }) => (
                    <div
                      key={hotel.id}
                      className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{hotel.name}</p>
                          <p className="text-xs text-gray-500">
                            {format(startDate, 'MMM dd')}
                            {!isSameDay(startDate, endDate) && ` - ${format(endDate, 'MMM dd')}`}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          ${(hotel.price * differenceInDays(addDays(endDate, 1), startDate)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-sm">
                      No hotels selected. Please book a hotel first.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Activities List
              <div className="space-y-2">
                {Object.entries(schedule).some(([_, day]) =>
                  ['Morning', 'Afternoon', 'Evening', 'Night'].some(timeSlot =>
                    day[timeSlot].length > 0
                  )
                ) ? (
                  Object.entries(schedule).map(([date, day]) => (
                    ['Morning', 'Afternoon', 'Evening', 'Night'].map(timeSlot => (
                      day[timeSlot].map((activity, index) => (
                        <div
                          key={`${activity.id}-${timeSlot}-${index}`}
                          className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{activity.name}</p>
                              <p className="text-xs text-gray-500">
                                Day {differenceInDays(new Date(date), startDate) + 1} - {timeSlot}
                              </p>
                            </div>
                            <p className="text-sm font-medium">${activity.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))
                    ))
                  ))
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-sm">
                      No activities selected
                    </p>
                  </div>
                )}
              </div>
            )}
            <ScrollBar />
          </ScrollArea>
        </div>

        {/* Date Selection */}
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Trip Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, "MMM dd, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateSelect}
                    disabled={(date) => date < startOfDay(today)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Trip End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, "MMM dd, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateSelect}
                    disabled={(date) => date < startDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Days Section */}
        <div className="flex-1 overflow-hidden flex flex-col ">
          <div className="p-4 flex items-center justify-between">
            <h2 className="font-semibold">Trip Days</h2>

          </div>
          <div className="flex-1 px-4 ">
            <DaySelector
              tripDays={tripDays}
              startDate={startDate}
              selectedDate={selectedDate}
              handleDaySelect={handleDaySelect}
              removeDay={removeDay}
            />
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                const newEndDate = addDays(endDate, 1);
                setEndDate(newEndDate);
                setTripDays(prevDays => prevDays + 1);

                // Initialize new day in schedule
                const newDateKey = format(newEndDate, 'yyyy-MM-dd');
                const newSchedule = {
                  ...schedule,
                  [newDateKey]: {
                    Accommodation: [],
                    Morning: [],
                    Afternoon: [],
                    Evening: [],
                    Night: []
                  }
                }
                updateSchedule(newSchedule);
              }}
              className=" mt-3 w-full"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Day
            </Button>
          </div>
        </div>

        {/* Total Price and Checkout */}
        <div className=" p-4">
          <div className="mb-2">
            <p className="text-lg font-semibold">Total Price: ${totalPrice.toFixed(2)}</p>
          </div>
          <CheckoutButton
            totalPrice={totalPrice}
            planName={planName}
            schedule={schedule}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-white">
          <div className="flex justify-between items-center">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'hotels' | 'activities')}>
              <TabsList className="grid w-[400px] grid-cols-2 bg-primary opacity-80 text-neutral">
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('list')}
              >
                <List className="h-4 w-4 mr-2" />
                List View
              </Button>
              <Button
                variant={view === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('map')}
              >
                <MapIcon className="h-4 w-4 mr-2" />
                Map View
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <ScheduleView
            selectedDate={selectedDate}
            startDate={startDate}
            endDate={endDate}
            schedule={schedule}
            updateSchedule={updateSchedule}
            planName={planName}
            onPlanNameChange={setPlanName}
            onSavePlan={handleSavePlan}
            activeTab={activeTab}
          />

          <div className="flex-1">
            {view === 'list' ? (
              <ActivitySelector
                cityData={cityData}
                schedule={schedule}
                activeTab={activeTab}
                startDate={startDate}
                endDate={endDate}
                categories={categories}
                onDateChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
              />
            ) : (
              <MapView
                cityData={cityData}
                activeTab={activeTab}
                selectedCity={selectedCity}
                selectedCategory={selectedCategory}
                onCityChange={(value) => {
                  if (value === 'All') {
                    setSelectedCity('All');
                  } else {
                    const found = cityData.find(city => city.name === value);
                    setSelectedCity(found || 'All');
                  }
                }}
                onCategoryChange={setSelectedCategory}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}