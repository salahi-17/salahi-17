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

type TimeSlot = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export default function ClientTripPlanner({ initialCityData, categories }: ClientTripPlannerProps) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 1));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tripDays, setTripDays] = useState<number>(1);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<Schedule>({});
  const [cityData, setCityData] = useState<City[]>([]);
  const [planName, setPlanName] = useState<string>("");
  const [itineraryId, setItineraryId] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const searchParams = useSearchParams();

  const getTimeSlotForOrder = (order: number): 'Morning' | 'Afternoon' | 'Evening' | 'Night' => {
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
    }
  }, [searchParams]);

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
            type: item.activity.category
          };

          const timeSlot = getTimeSlotForOrder(item.order);
          newSchedule[dateKey][timeSlot].push(activity);
        });
      });

      // Set the state
      setPlanName(itinerary.name);
      setStartDate(new Date(itinerary.startDate));
      setEndDate(new Date(itinerary.endDate));
      setTripDays(itinerary.days.length);
      setSchedule(newSchedule);
      setSelectedDate(new Date(itinerary.startDate));

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
    const draft = {
      planName,
      startDate,
      selectedDate,
      tripDays,
      schedule,
    };
    localStorage.setItem('itineraryDraft', JSON.stringify(draft));
  }, [planName, startDate, selectedDate, tripDays, schedule]);

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
            order: getOrderForTimeSlot(timeSlot) + index,
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
        localStorage.removeItem('itineraryDraft');
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

  const getOrderForTimeSlot = (timeSlot: string): number => {
    switch (timeSlot) {
      case 'Morning': return 0;
      case 'Afternoon': return 10;
      case 'Evening': return 20;
      case 'Night': return 30;
      default: return 0;
    }
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      const daysDifference = differenceInDays(date, startDate);
      setStartDate(date);
      setEndDate(addDays(date, tripDays - 1));
      setSelectedDate(date);

      const newSchedule: Schedule = {};
      Object.entries(schedule).forEach(([dateKey, daySchedule]) => {
        const oldDate = parse(dateKey, 'yyyy-MM-dd', new Date());
        const newDate = addDays(oldDate, daysDifference);
        newSchedule[format(newDate, 'yyyy-MM-dd')] = daySchedule;
      });
      setSchedule(newSchedule);
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
  };

  const isItemScheduled = (item: ScheduleItem, timeSlot: string): boolean => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return schedule[dateKey]?.[timeSlot]?.some(scheduledItem => scheduledItem.name === item.name) || false;
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <aside className="bg-white px-4 py-6 flex flex-col gap-6 w-52">
        <div className="flex flex-col items-center justify-between">
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
        </ScrollArea>
      </aside>
      <ScheduleView
        selectedDate={selectedDate}
        startDate={startDate}
        schedule={schedule}
        updateSchedule={updateSchedule}
      />
      <div className="flex-1 p-6 overflow-auto bg-white shadow-md m-6 rounded-lg">
        <div className="mb-6 flex space-x-4">
          <Select onValueChange={(value: string) => setSelectedCategory(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value: string) => setSelectedCity(cityData.find(city => city.name === value) || null)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {cityData.map(city => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ActivitySelector
          selectedCity={selectedCity}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  );
}
