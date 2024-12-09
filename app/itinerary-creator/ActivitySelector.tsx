import React, { useState } from 'react';
import { Activity, City, Schedule } from './types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useInView } from 'react-intersection-observer';
import LazyImage from '@/components/LazyImage';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

interface ActivitySelectorProps {
  cityData: City[];
  schedule: Schedule;
  activeTab: 'hotels' | 'activities';
  startDate: Date;
  endDate: Date;
  categories: string[];
  onDateChange: (start: Date, end: Date) => void;
}

interface ActivityCardProps {
  item: Activity;
  category: string;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick: () => void;
}

const ActivityCard = React.memo(({ item, category, onDragStart, onDragEnd, onClick }: ActivityCardProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`activity-card bg-white shadow-lg rounded-lg overflow-hidden 
        ${item.price > 0 ? 'cursor-move' : 'cursor-not-allowed'} 
        hover:shadow-xl transition-shadow`}
      draggable={item.price > 0}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      {inView && (
        <>
          <LazyImage
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h4 className="font-semibold text-xl mb-2">{item.name}</h4>
            <p className="text-sm text-gray-600">{category}</p>
            {item.price > 0 && <p className="text-sm font-bold">${item.price.toFixed(2)}</p>}
          </div>
        </>
      )}
    </div>
  );
});

ActivityCard.displayName = 'ActivityCard';

interface ActivitySelectorProps {
  cityData: City[];
  schedule: Schedule;
}

export default function ActivitySelector({
  cityData,
  schedule,
  activeTab,
  startDate,
  endDate,
  categories,
  onDateChange
}: ActivitySelectorProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [selectedCity, setSelectedCity] = useState<City | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchLocation, setSearchLocation] = useState("");
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

    const dragData = {
      ...item,
      category,
      type: category,
      guestCount,
      totalPrice: item.price * guestCount,
      isHotel: isHotel
    };

    e.dataTransfer.setData("application/json", JSON.stringify(dragData));

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
              if (searchLocation === "" ||
                activity.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
                activity.location.toLowerCase().includes(searchLocation.toLowerCase())) {
                allActivities.push({ activity, category });
              }
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
            if (searchLocation === "" ||
              activity.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
              activity.location.toLowerCase().includes(searchLocation.toLowerCase())) {
              allActivities.push({ activity, category });
            }
          });
        }
      });
    }

    return allActivities;
  };

  const renderActivityGrid = (activities: { activity: Activity; category: string }[]) => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {activities.map(({ activity: item, category }, index) => (
        <Dialog key={`${item.id}-${index}`}>
          <DialogTrigger asChild>
            <ActivityCard
              item={item}
              category={category}
              onDragStart={(e: any) => handleDragStart(e, item, category)}
              onDragEnd={handleDragEnd}
              onClick={() => setSelectedActivity(item)}
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{item.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <LazyImage
                src={item.image}
                alt={item.name}
                className="w-full h-64 object-cover rounded mb-2"
              />
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
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex-1 overflow-auto px-6 py-4">
        {activeTab === 'hotels' ? (
          <div className="space-y-6">
            {/* Filters for hotels */}
            <div className="flex gap-4">
              <div>
                <span className="text-sm text-gray-600">Where to?</span>
                {/* Location selector */}
                <div>
                  <Select
                    value={selectedCity === 'All' ? 'All' : selectedCity.name}
                    onValueChange={(value) => {
                      if (value === 'All') {
                        setSelectedCity('All');
                      } else {
                        const found = cityData.find(city => city.name === value);
                        setSelectedCity(found || 'All');
                      }
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Locations</SelectItem>
                      {cityData.map(city => (
                        <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-600">Travelers</span>
                <Select value={guestCount.toString()} onValueChange={(v) => setGuestCount(Number(v))}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue>
                      {guestCount} {guestCount === 1 ? 'Traveler' : 'Travelers'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Budget</span>
                <QuestionMarkCircledIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>


            <h2 className="text-xl font-semibold">
              Hotels in {selectedCity === 'All' ? 'All Locations' : selectedCity.name}
            </h2>

            {/* Use the same renderActivityGrid for hotels */}
            {renderActivityGrid(getActivities('hotels'))}
          </div>
        ) : (
          // Activities View
          <div className="space-y-6">
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {Array.from(new Set(cityData.flatMap(city =>
                    Object.keys(city.categories).filter(cat => cat.toLowerCase() !== 'hotel')
                  ))).map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedCity === 'All' ? 'All' : selectedCity.name}
                onValueChange={(value) => {
                  if (value === 'All') {
                    setSelectedCity('All');
                  } else {
                    const found = cityData.find(city => city.name === value);
                    setSelectedCity(found || 'All');
                  }
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select an area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Locations</SelectItem>
                  {cityData.map(city => (
                    <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <h2 className="text-xl font-semibold">
              {selectedCategory === 'All' ? 'All Activities' : selectedCategory} in {selectedCity === 'All' ? 'All Locations' : selectedCity.name}
            </h2>

            {renderActivityGrid(getActivities('activities'))}
          </div>
        )}
      </div>
    </div>
  );
}