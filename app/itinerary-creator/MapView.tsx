import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Maximize2, MapPin } from "lucide-react";
import { Activity, City } from './types';
import ActivityDetailsDialog from './ActivityDetailsDialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@radix-ui/react-select';

interface MapViewProps {
  cityData: City[];
  activeTab: 'hotels' | 'activities';
  selectedCity: City | 'All';
  selectedCategory: string;
  onCityChange: (city: string) => void;
  onCategoryChange: (category: string) => void;
}

export default function MapView({
  cityData,
  activeTab,
  selectedCity,
  selectedCategory,
  onCityChange,
  onCategoryChange
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindows, setInfoWindows] = useState<google.maps.InfoWindow[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [guestCount, setGuestCount] = useState(1);

  const createMarkerIcon = (isSelected: boolean) => {
    const color = isSelected ? '#dbaa9b' : '#f59e0b';
    const scale = isSelected ? 1.2 : 1;
    
    return {
      path: 'M12 0C7.6 0 4 3.6 4 8c0 5.4 8 16 8 16s8-10.6 8-16c0-4.4-3.6-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z',
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 1,
      strokeColor: '#000000',
      strokeOpacity: 0.2,
      scale: scale * 1.5,
      anchor: new google.maps.Point(12, 24)
    };
  };

  const getFilteredActivities = () => {
    let activities: Activity[] = [];
    
    cityData.forEach(city => {
      if (selectedCity === 'All' || selectedCity.name === city.name) {
        Object.entries(city.categories).forEach(([category, categoryActivities]) => {
          const isHotel = category.toLowerCase() === 'hotel';
          if ((activeTab === 'hotels' && isHotel) || (activeTab === 'activities' && !isHotel)) {
            if (activeTab === 'activities' && selectedCategory !== 'All' && category !== selectedCategory) {
              return;
            }
            activities = [...activities, ...categoryActivities];
          }
        });
      }
    });
    
    return activities;
  };

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places']
        });

        const google = await loader.load();
        const activities = getFilteredActivities();
        
        const bounds = new google.maps.LatLngBounds();
        activities.forEach(activity => {
          if (activity.latitude && activity.longitude) {
            bounds.extend(new google.maps.LatLng(activity.latitude, activity.longitude));
          }
        });

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: bounds.getCenter(),
          zoom: 12,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        if (activities.length > 0) {
          mapInstance.fitBounds(bounds);
        }

        // Clear existing markers and info windows
        markers.forEach(marker => marker.setMap(null));
        infoWindows.forEach(infoWindow => infoWindow.close());

        const newMarkers: google.maps.Marker[] = [];
        const newInfoWindows: google.maps.InfoWindow[] = [];

        activities.forEach((activity) => {
          if (!activity.latitude || !activity.longitude) return;

          const marker = new google.maps.Marker({
            position: { lat: activity.latitude, lng: activity.longitude },
            map: mapInstance,
            icon: createMarkerIcon(false)
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="width: 200px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer;">
                <div style="width: 100%; height: 120px; position: relative;">
                  <img src="${activity.image}" alt="${activity.name}" 
                    style="width: 100%; height: 100%; object-fit: cover;" />
                  <div style="position: absolute; top: 0; left: 0; right: 0; padding: 8px 12px;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);">
                    <h3 style="margin: 0; color: white; font-size: 14px; font-weight: 600;">
                      ${activity.name}
                    </h3>
                  </div>
                </div>
              </div>
            `,
            pixelOffset: new google.maps.Size(0, -20)
          });

          marker.addListener('click', () => {
            // Close all other info windows
            newInfoWindows.forEach(w => w.close());
            newMarkers.forEach(m => m.setIcon(createMarkerIcon(false)));
            
            // Update this marker's icon
            marker.setIcon(createMarkerIcon(true));
            
            // Open this info window
            infoWindow.open(mapInstance, marker);
            
            // Set selected activity (but don't open dialog yet)
            setSelectedActivity(activity);
          });

          // Add click listener to the info window content
          google.maps.event.addListener(infoWindow, 'domready', () => {
            const content = infoWindow.getContent();
            if (content) {
              const container = document.querySelector('.gm-style-iw-d');
              if (container) {
                container.addEventListener('click', () => {
                  setShowDetailsDialog(true);
                });
              }
            }
          });

          newMarkers.push(marker);
          newInfoWindows.push(infoWindow);
        });

        setMarkers(newMarkers);
        setInfoWindows(newInfoWindows);
        setMap(mapInstance);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initializeMap();
  }, [cityData, activeTab, selectedCity, selectedCategory]);

  return (
    <div className="h-full flex flex-col">
    {/* Filters */}
    <div className="p-4 bg-white border-b">
      <div className="flex gap-4 items-center">
        <Select 
          value={selectedCity === 'All' ? 'All' : selectedCity.name}
          onValueChange={onCityChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Locations</SelectItem>
            {cityData.map(city => (
              <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeTab === 'activities' && (
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
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
        )}
      </div>
    </div>


      {/* Map */}
      <div className={`relative flex-1 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Activity Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        {selectedActivity && (
          <ActivityDetailsDialog
            item={selectedActivity}
            category={selectedActivity.category}
            guestCount={guestCount}
            onGuestCountChange={setGuestCount}
          />
        )}
      </Dialog>
    </div>
  );
}