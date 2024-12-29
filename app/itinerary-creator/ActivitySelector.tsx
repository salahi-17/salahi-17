import React, { useState } from 'react';
import { Activity, City, Schedule } from './types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useInView } from 'react-intersection-observer';
import LazyImage from '@/components/LazyImage';
import ActivityDetailsDialog from './ActivityDetailsDialog';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';
import PriceFilter from './PriceFilter';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { isBefore, isAfter, format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

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
  hasExternalHotels: boolean;
  setHasExternalHotels: (value: boolean) => void;
}

export default function ActivitySelector({
  cityData,
  schedule,
  activeTab,
  startDate,
  endDate,
  categories,
  onDateChange,
  hasExternalHotels,
  setHasExternalHotels,
}: ActivitySelectorProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [selectedCity, setSelectedCity] = useState<City | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>();
  const { toast } = useToast();

  const canAddActivities = () => {
    return hasExternalHotels || Object.entries(schedule).every(([_, daySchedule]) =>
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
    
    // Add this check for hotels
    if (isHotel && !selectedDateRange?.from && !selectedDateRange?.to) {
      e.preventDefault();
      toast({
        title: "Date Selection Required",
        description: "Please select stay dates before adding a hotel.",
        duration: 3000,
        variant: "destructive",
      });
      return;
    }
  
    if (!isHotel && !canAddActivities()) {
      e.preventDefault();
  
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
      isHotel: isHotel,
      dateRange: isHotel ? selectedDateRange : undefined  // Add this line
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
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,320px))] gap-6 filters">
                {/* Location selector */}
                <div className="w-[320px]">
                  <span className="text-sm text-gray-600">Where to?</span>
                  <div className="mt-2">
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
                      <SelectTrigger className="w-full">
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

                {/* Travelers selector */}
                <div className="w-[320px]">
                  <span className="text-sm text-gray-600">Travelers</span>
                  <div className="mt-2">
                    <Select value={guestCount.toString()} onValueChange={(v) => setGuestCount(Number(v))}>
                      <SelectTrigger className="w-full">
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
                </div>

                <div className="w-[320px]">
                  <span className="text-sm text-gray-600">Stay Dates</span>
                  <div className="mt-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-transparent hover:bg-transparent"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDateRange?.from ? (
                            selectedDateRange.to ? (
                              `${format(selectedDateRange.from, "MMM dd")} - ${format(selectedDateRange.to, "MMM dd")}`
                            ) : (
                              format(selectedDateRange.from, "MMM dd")
                            )
                          ) : (
                            "Select dates"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={startDate}
                          selected={selectedDateRange}
                          onSelect={setSelectedDateRange}
                          numberOfMonths={2}
                          disabled={(date) =>
                            isBefore(date, startDate) ||
                            isAfter(date, endDate)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Budget filter component */}
                <PriceFilter
                  value={priceRange}
                  onChange={setPriceRange}
                  maxAllowedPrice={getPriceRanges(cityData).max} // Pass the maximum price from your data
                />

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