import React, { useState } from 'react';
import { Activity, City, Schedule } from './types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface ActivitySelectorProps {
  cityData: City[];
  schedule: Schedule;
}

export default function ActivitySelector({ cityData, schedule }: ActivitySelectorProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedTab, setSelectedTab] = useState<'hotels' | 'activities'>('hotels');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [selectedCity, setSelectedCity] = useState<City | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { toast } = useToast();

  const canAddActivities = () => {
    if (!schedule) return false;
    return Object.entries(schedule).every(([_, daySchedule]) => 
      daySchedule.Accommodation && daySchedule.Accommodation.length > 0
    );
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Activity, category: string) => {
    if (item.price <= 0) {
      e.preventDefault();
      return;
    }

    const isHotel = category.toLowerCase() === 'hotel';
    if (!isHotel && !canAddActivities()) {
      e.preventDefault();
      toast({
        title: "Hotels Required",
        description: "Please select hotels for all days before adding activities.",
        duration: 3000,
        variant: "destructive",
      });
      return;
    }

    e.dataTransfer.setData("application/json", JSON.stringify({
      ...item,
      type: category,
      guestCount,
      totalPrice: item.price * guestCount,
      isHotel: isHotel
    }));
    
    if (e.currentTarget.classList.contains('activity-card')) {
      e.currentTarget.classList.add('dragging');
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.classList.contains('activity-card')) {
      e.currentTarget.classList.remove('dragging');
    }
  };
  
  const getActivities = (type: 'hotels' | 'activities') => {
    let allActivities: { activity: Activity; category: string }[] = [];

    if (selectedCity === 'All') {
      cityData.forEach(city => {
        Object.entries(city.categories).forEach(([category, activities]) => {
          const isHotel = category.toLowerCase() === 'hotel';
          if (type === 'hotels' ? isHotel : !isHotel) {
            if (type === 'activities' && selectedCategory !== 'All' && category !== selectedCategory) {
              return;
            }
            activities.forEach(activity => {
              allActivities.push({ activity, category });
            });
          }
        });
      });
    } else {
      Object.entries(selectedCity.categories).forEach(([category, activities]) => {
        const isHotel = category.toLowerCase() === 'hotel';
        if (type === 'hotels' ? isHotel : !isHotel) {
          if (type === 'activities' && selectedCategory !== 'All' && category !== selectedCategory) {
            return;
          }
          activities.forEach(activity => {
            allActivities.push({ activity, category });
          });
        }
      });
    }

    return allActivities;
  };

  const renderActivityGrid = (activities: { activity: Activity; category: string }[]) => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {activities.map(({ activity: item, category }, index) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <div
              className={`activity-card bg-white shadow-lg rounded-lg overflow-hidden ${item.price > 0 ? 'cursor-move' : 'cursor-not-allowed'} hover:shadow-xl transition-shadow`}
              draggable={item.price > 0}
              onDragStart={(e) => handleDragStart(e, item, category)}
              onDragEnd={handleDragEnd}
              onClick={() => setSelectedActivity(item)}
            >
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className="font-semibold text-xl mb-2">{item.name}</h4>
                <p className="text-sm text-gray-600">{category}</p>
                {item.price > 0 && <p className="text-sm font-bold">${item.price.toFixed(2)}</p>}
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{item.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <img src={item.image} alt={item.name} className="w-full h-64 object-cover rounded mb-2" />
              <p className="font-semibold">{item.description}</p>
              <p className="font-semibold">Location: {item.location}</p>
              {item.price > 0 && (
                <>
                  <p className="font-semibold">Base Price: ${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-4">
                    <label htmlFor="guestCount" className="font-semibold">Number of Guests:</label>
                    <Select onValueChange={(value) => setGuestCount(Number(value))}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="font-semibold">Total Price: ${(item.price * guestCount).toFixed(2)}</p>
                </>
              )}
              <p className="font-semibold">Amenities: {item.amenities.join(', ')}</p>
              <p className="font-semibold">Category: {category}</p>
              {item.price === 0 && (
                <p className="text-red-500">This activity cannot be added to the itinerary.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <Tabs defaultValue="hotels" className="w-full" onValueChange={(value) => setSelectedTab(value as 'hotels' | 'activities')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hotels" className="mt-6">
          <div className="mb-6">
            <Select onValueChange={(value: string) => {
              if (value === 'All') {
                setSelectedCity('All');
              } else {
                const found = cityData.find(city => city.name === value);
                setSelectedCity(found || 'All');
              }
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Areas</SelectItem>
                {cityData.map(city => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {renderActivityGrid(getActivities('hotels'))}
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <div className="mb-6 flex space-x-4">
            <Select onValueChange={(value: string) => setSelectedCategory(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {Array.from(new Set(cityData.flatMap(city => 
                  Object.keys(city.categories).filter(cat => cat.toLowerCase() !== 'hotel')
                ))).map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value: string) => {
              if (value === 'All') {
                setSelectedCity('All');
              } else {
                const found = cityData.find(city => city.name === value);
                setSelectedCity(found || 'All');
              }
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Areas</SelectItem>
                {cityData.map(city => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {renderActivityGrid(getActivities('activities'))}
        </TabsContent>
      </Tabs>
    </div>
  );
}