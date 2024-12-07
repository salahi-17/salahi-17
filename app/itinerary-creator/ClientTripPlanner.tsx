"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format, addDays, differenceInDays, parse } from "date-fns";
import { CalendarIcon, PlusIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import DaySelector from './DaySelector';
import ScheduleView from './ScheduleView';
import ActivitySelector from './ActivitySelector';
import CheckoutButton from './CheckoutButton';
import { City, Schedule, Activity, CityCategories, ScheduleItem } from './types';

interface ClientTripPlannerProps {
  initialCityData: Activity[];
  categories: string[];
  isAuthenticated: boolean;
  userId?: string;
}

type TimeSlot = 'Accommodation' | 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export default function ClientTripPlanner({ initialCityData, categories }: ClientTripPlannerProps) {
  const today = new Date();
  const tomorrow = addDays(today, 1);

  const [currentTab, setCurrentTab] = useState<'hotels' | 'activities'>('hotels');
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

  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

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
    const category = searchParams.get('category');
    const area = searchParams.get('area');

    if (id) {
      setItineraryId(id);
      fetchItinerary(id);
    } else {
      // Load from local storage if no ID is provided
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
        initializeSchedule(today, tomorrow);
      }
    }

    if (category) {
      setSelectedCategory(category);
    }

    if (area && cityData.length > 0) {
      const foundCity = cityData.find(city => city.name.toLowerCase() === area.toLowerCase());
      setSelectedCity(foundCity || 'All');
    }
  }, [searchParams, cityData])

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
            guestCount: 1
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
    const days = differenceInDays(end, start) + 1;
    const newSchedule: Schedule = {};
    for (let i = 0; i < days; i++) {
      const currentDate = addDays(start, i);
      newSchedule[format(currentDate, 'yyyy-MM-dd')] = {
        Accommodation: [],
        Morning: [],
        Afternoon: [],
        Evening: [],
        Night: []
      };
    }
    setSchedule(newSchedule);
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setStartDate(date);
      setSelectedDate(date);
      if (endDate <= date) {
        const newEndDate = addDays(date, 1);
        setEndDate(newEndDate);
        initializeSchedule(date, newEndDate);
      } else {
        initializeSchedule(date, endDate);
      }
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date && date > startDate) {
      setEndDate(date);
      const days = differenceInDays(date, startDate) + 1;
      setTripDays(days);
      initializeSchedule(startDate, date);
    }
  };

  const addDay = () => {
    setTripDays(prevDays => {
      const newTripDays = prevDays + 1;
      setEndDate(addDays(startDate, newTripDays - 1));
      return newTripDays;
    });
  };

  const removeDay = (dayToRemove: number) => {
    if (tripDays > 1) {
      setTripDays(prevDays => {
        const newTripDays = prevDays - 1;
        setEndDate(addDays(startDate, newTripDays - 1));
        setSchedule(prevSchedule => {
          const newSchedule: Schedule = {};
          Object.entries(prevSchedule).forEach(([dateKey, daySchedule]) => {
            const currentDate = parse(dateKey, 'yyyy-MM-dd', startDate);
            const dayNumber = differenceInDays(currentDate, startDate) + 1;
            if (dayNumber < dayToRemove) {
              newSchedule[dateKey] = daySchedule;
            } else if (dayNumber > dayToRemove) {
              const newDate = addDays(currentDate, -1);
              newSchedule[format(newDate, 'yyyy-MM-dd')] = daySchedule;
            }
          });
          return newSchedule;
        });
        setSelectedDate(startDate);
        return newTripDays;
      });
    }
  };

  const handleDaySelect = (day: number) => {
    setSelectedDate(addDays(startDate, day - 1));
  };

  const updateSchedule = (newSchedule: Schedule) => {
    setSchedule(newSchedule);
    if (!itineraryId) {
      const itineraryToSave = {
        planName,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        selectedDate: selectedDate.toISOString(),
        tripDays,
        schedule: newSchedule,
      };
      localStorage.setItem('unsavedItinerary', JSON.stringify(itineraryToSave));
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

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <aside className="bg-white px-4 py-6 flex flex-col gap-6 w-52">
        <div className="flex flex-col items-center justify-between gap-4">
          <h2 className="text-sm font-semibold">Trip Start Date</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(startDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <h2 className="text-sm font-semibold">Trip End Date</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(endDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateSelect}
                initialFocus
                disabled={(date) => date <= startDate}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label htmlFor="planName" className="block text-sm font-medium text-gray-700">Plan Name</label>
          <input
            type="text"
            id="planName"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <Button onClick={handleSavePlan}>Save Plan</Button>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <DaySelector
            tripDays={tripDays}
            startDate={startDate}
            selectedDate={selectedDate}
            handleDaySelect={handleDaySelect}
            removeDay={removeDay}
          />
          <Button
            variant="ghost"
            className="justify-start w-full my-1"
            onClick={addDay}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Day
          </Button>
          <div className="mt-auto">
            <p className="text-lg font-semibold mb-2">Total Price: ${totalPrice.toFixed(2)}</p>
            <CheckoutButton
              totalPrice={totalPrice}
              planName={planName}
              schedule={schedule}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </ScrollArea>
      </aside>
      <ScheduleView
        selectedDate={selectedDate}
        startDate={startDate}
        schedule={schedule}
        updateSchedule={updateSchedule}
      />
      <div className="flex-1 p-6 overflow-auto bg-white shadow-md m-6 rounded-lg">
        <ActivitySelector
          cityData={cityData}
        />
      </div>
    </div>
  );
}