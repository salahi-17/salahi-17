import React, { useState } from 'react';
import { Activity, City, Schedule } from './types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useInView } from 'react-intersection-observer';
import LazyImage from '@/components/LazyImage';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import ActivityDetailsDialog from './ActivityDetailsDialog';
import { Button } from '@/components/ui/button';

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
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [hasExternalHotels, setHasExternalHotels] = useState(false);
  const { toast } = useToast();

  const canAddActivities = () => {
    if (hasExternalHotels) return true;
    if (!schedule) return false;
    return Object.entries(schedule).every(([_, daySchedule]) =>
      daySchedule.Accommodation && daySchedule.Accommodation.length > 0
    );
  };

  // Add a function to get unique amenities/themes from activities
  const getAllThemes = (cityData: City[]) => {
    const themesSet = new Set<string>();
    cityData.forEach(city => {
      Object.values(city.categories).forEach(activities => {
        activities.forEach(activity => {
          activity.amenities.forEach(amenity => themesSet.add(amenity));
        });
      });
    });
    return Array.from(themesSet).sort();
  };

  // Add a function to get price ranges for hotels
  const getPriceRanges = (cityData: City[]) => {
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    cityData.forEach(city => {
      if (city.categories.Hotel) {
        city.categories.Hotel.forEach(hotel => {
          minPrice = Math.min(minPrice, hotel.price);
          maxPrice = Math.max(maxPrice, hotel.price);
        });
      }
    });

    // Create price range brackets
    return {
      min: Math.floor(minPrice),
      max: Math.ceil(maxPrice),
    };
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Activity, category: string) => {
    if (item.price <= 0) {
      e.preventDefault();
      return;
    }
  
    const isHotel = category.toLowerCase() === 'hotel';
    if (!isHotel && !canAddActivities()) {
      e.preventDefault();
      
      // Create and show dialog for hotel requirement
      toast({
        title: "Hotels Required",
        description: (
          <div className="space-y-4">
            <p>Please select hotels for all days before adding activities.</p>
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-600">Already booked hotels elsewhere?</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setHasExternalHotels(true);
                  toast({
                    title: "External Hotels Added",
                    description: "You can now add activities to your itinerary.",
                    duration: 3000,
                  });
                }}
              >
                I have hotel bookings
              </Button>
            </div>
          </div>
        ),
        duration: 5000,
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

    cityData.forEach(city => {
      if (selectedCity === 'All' || selectedCity.name === city.name) {
        Object.entries(city.categories).forEach(([category, activities]) => {
          const isHotel = category.toLowerCase() === 'hotel';
          if (type === 'hotels' ? isHotel : !isHotel) {
            if (type === 'activities' && selectedCategory !== 'All' && category !== selectedCategory) {
              return;
            }

            activities.forEach(activity => {
              // Apply theme filter for activities
              if (type === 'activities' && selectedThemes.length > 0) {
                const hasSelectedTheme = selectedThemes.some(theme =>
                  activity.amenities.includes(theme)
                );
                if (!hasSelectedTheme) return;
              }

              // Apply price range filter for hotels
              if (type === 'hotels' && priceRange) {
                const [min, max] = priceRange;
                if (activity.price < min || activity.price > max) return;
              }

              if (searchLocation === "" ||
                activity.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
                activity.location.toLowerCase().includes(searchLocation.toLowerCase())) {
                allActivities.push({ activity, category });
              }
            });
          }
        });
      }
    });
    return allActivities;
  };


  const renderActivityGrid = (activities: { activity: Activity; category: string }[]) => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {activities.map(({ activity: item, category }, index) => (
        <Dialog key={`${item.id}-${index}`}>
          <DialogTrigger asChild>
            <div> {/* Wrap in div to avoid dialog trigger issues */}
              <ActivityCard
                item={item}
                category={category}
                onDragStart={(e) => handleDragStart(e, item, category)}
                onDragEnd={handleDragEnd}
                onClick={() => setSelectedActivity(item)}
              />
            </div>
          </DialogTrigger>
          <ActivityDetailsDialog
            item={{
              ...item,
              images: item.images
            }}
            category={category}
            guestCount={guestCount}
            onGuestCountChange={setGuestCount}
          />
        </Dialog>
      ))}
    </div>
  );

  return (
    <>
    {hasExternalHotels && (
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 ">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-700">Using externally booked hotels</p>
            <p className="text-xs text-blue-600">You can add activities without selecting hotels</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setHasExternalHotels(false)}
          >
            Remove
          </Button>
        </div>
      </div>
    )}
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex-1 overflow-auto px-6 py-4">
        {activeTab === 'hotels' ? (
          <div className="space-y-6">
            {/* Filters for hotels */}
            <div className="flex gap-4 filters">
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

              <div>
                <span className="text-sm text-gray-600">Budget</span>
                <Select
                  value={priceRange ? `${priceRange[0]}-${priceRange[1]}` : 'all'}
                  onValueChange={(value) => {
                    if (value === 'all') {
                      setPriceRange(null);
                    } else {
                      const [min, max] = value.split('-').map(Number);
                      setPriceRange([min, max]);
                    }
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Price</SelectItem>
                    {(() => {
                      const { min, max } = getPriceRanges(cityData);

                      // Calculate the range size based on min and max
                      const range = max - min;
                      const steps = 4; // Number of divisions we want
                      const increment = Math.ceil(range / steps);

                      // Generate ranges dynamically
                      const ranges: [number, number][] = [];
                      for (let i = min; i < max; i += increment) {
                        ranges.push([
                          i,
                          Math.min(i + increment - 1, max) // Ensure last range doesn't exceed max
                        ]);
                      }

                      return ranges.map(([rangeMin, rangeMax]) => (
                        <SelectItem
                          key={`${rangeMin}-${rangeMax}`}
                          value={`${rangeMin}-${rangeMax}`}
                        >
                          ${rangeMin} - ${rangeMax}
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
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

              <Select
                value={selectedThemes[0] || 'all'}
                onValueChange={(value) => setSelectedThemes(value === 'all' ? [] : [value])}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Themes</SelectItem>
                  {getAllThemes(cityData).map(theme => (
                    <SelectItem key={theme} value={theme}>{theme}</SelectItem>
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
    </>
  );
}