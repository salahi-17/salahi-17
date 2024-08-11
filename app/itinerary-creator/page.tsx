"use client"
import React, { useState, useEffect } from 'react';
import { format, addDays, differenceInDays, parse } from "date-fns";
import { CalendarIcon, PlusIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DaySelector from './DaySelector';
import ScheduleView from './ScheduleView';
import ActivitySelector from './ActivitySelector';
import { City, Schedule, ScheduleItem } from './types';

export default function TripPlanner() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tripDays, setTripDays] = useState<number>(1);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<Schedule>({});
  const [cityData, setCityData] = useState<City[]>([]);
  useEffect(() => {
    const fetchCityData = async () => {
      // Simulating an API call
      const data: City[] = [
        {
          name: "New York City",
          attractions: [
            { name: "Central Park", description: "An urban oasis in the heart of Manhattan", image: "/api/placeholder/100/100" },
            { name: "Empire State Building", description: "Iconic skyscraper with observation deck", image: "/api/placeholder/100/100" },
            { name: "Metropolitan Museum of Art", description: "One of the world's largest art museums", image: "/api/placeholder/100/100" }
          ],
          tours: [
            { name: "Statue of Liberty Tour", description: "Visit the iconic symbol of freedom", image: "/api/placeholder/100/100" },
            { name: "NYC Sightseeing Tour", description: "See the best of New York City", image: "/api/placeholder/100/100" },
            { name: "Food Tour", description: "Taste the diverse flavors of NYC", image: "/api/placeholder/100/100" }
          ],
          hotels: [
            { name: "The Plaza", description: "Luxury hotel on Fifth Avenue", image: "/api/placeholder/100/100" },
            { name: "Mandarin Oriental", description: "High-end hotel with stunning views", image: "/api/placeholder/100/100" },
            { name: "The Ritz-Carlton", description: "Elegant hotel in Central Park", image: "/api/placeholder/100/100" }
          ]
        },
        // Add more cities here with the same structure
      ];
      setCityData(data);
    };

    fetchCityData();
  }, []);

  
  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      const daysDifference = differenceInDays(date, startDate);
      setStartDate(date);
      setSelectedDate(date);

      // Update the schedule with new dates
      const newSchedule: Schedule = {};
      Object.entries(schedule).forEach(([dateKey, daySchedule]) => {
        const oldDate = parse(dateKey, 'yyyy-MM-dd', new Date());
        const newDate = addDays(oldDate, daysDifference);
        newSchedule[format(newDate, 'yyyy-MM-dd')] = daySchedule;
      });
      setSchedule(newSchedule);
    }
  };

  const handleDaySelect = (day: number) => {
    setSelectedDate(addDays(startDate, day - 1));
  };

  const addDay = () => {
    setTripDays(prevDays => prevDays + 1);
  };

  const removeDay = (dayToRemove: number) => {
    if (tripDays > 1) {
      setTripDays(prevDays => {
        const newTripDays = prevDays - 1;
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
        </div>
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
              <SelectItem value="attractions">Attractions</SelectItem>
              <SelectItem value="tours">Tours</SelectItem>
              <SelectItem value="hotels">Hotels</SelectItem>
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
