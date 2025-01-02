import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Maximize2, MapPin } from "lucide-react";
import { Activity, City, Schedule } from './types';
import ActivityDetailsDialog from './ActivityDetailsDialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@radix-ui/react-select';

interface MapViewProps {
  cityData: City[];
  activeTab: 'hotels' | 'activities';
  selectedCity: City | 'All';
  selectedCategory: string;
  schedule: Schedule;  // This will be used to get itinerary items
  onCityChange: (value: string) => void;
  onCategoryChange: React.Dispatch<React.SetStateAction<string>>;
}

export default function MapView({
  cityData,
  activeTab,
  selectedCity,
  selectedCategory,
  schedule,
  onCityChange,
  onCategoryChange
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindows, setInfoWindows] = useState<google.maps.InfoWindow[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [activeInfoWindow, setActiveInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  const createMarkerIcon = (isSelected: boolean, isHotel: boolean) => {
    // Different colors for hotels and activities
    const color = isHotel ? '#4CAF50' : '#f59e0b';
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

  // Get all items from the schedule
  const getScheduleItems = () => {
    const items: Activity[] = [];
    
    Object.values(schedule).forEach(daySchedule => {
      // Add hotels
      items.push(...daySchedule.Accommodation);
      // Add other activities
      items.push(...daySchedule.Morning);
      items.push(...daySchedule.Afternoon);
      items.push(...daySchedule.Evening);
      items.push(...daySchedule.Night);
    });
    
    // Remove duplicates based on item id
    return Array.from(new Map(items.map(item => [item.id, item])).values());
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
        const scheduleItems = getScheduleItems();
        
        const bounds = new google.maps.LatLngBounds();
        let hasValidLocations = false;

        scheduleItems.forEach(item => {
          if (item.latitude && item.longitude) {
            bounds.extend(new google.maps.LatLng(item.latitude, item.longitude));
            hasValidLocations = true;
          }
        });

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: hasValidLocations ? bounds.getCenter() : { lat: 0, lng: 0 },
          zoom: hasValidLocations ? 12 : 2,
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

        if (hasValidLocations) {
          mapInstance.fitBounds(bounds);
        }

        // Clear existing markers and info windows
        markers.forEach(marker => marker.setMap(null));
        infoWindows.forEach(infoWindow => infoWindow.close());

        const newMarkers: google.maps.Marker[] = [];
        const newInfoWindows: google.maps.InfoWindow[] = [];

        scheduleItems.forEach((item) => {
          if (!item.latitude || !item.longitude) return;

          const isHotel = item.category.toLowerCase() === 'hotel';
          
          const marker = new google.maps.Marker({
            position: { lat: item.latitude, lng: item.longitude },
            map: mapInstance,
            icon: createMarkerIcon(false, isHotel)
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="width: 200px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer;">
                <div style="width: 100%; height: 120px; position: relative;">
                  <img src="${item.image}" alt="${item.name}" 
                    style="width: 100%; height: 100%; object-fit: cover;" />
                  <div style="position: absolute; top: 0; left: 0; right: 0; padding: 8px 12px;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);">
                    <h3 style="margin: 0; color: white; font-size: 14px; font-weight: 600;">
                      ${item.name}
                    </h3>
                    <span style="color: white; font-size: 12px; background: ${isHotel ? '#4CAF50' : '#f59e0b'}; 
                      padding: 2px 6px; border-radius: 4px; margin-top: 4px; display: inline-block;">
                      ${isHotel ? 'Hotel' : 'Activity'}
                    </span>
                  </div>
                </div>
              </div>
            `,
            pixelOffset: new google.maps.Size(0, -20)
          });

          // Show info window on hover
          marker.addListener('mouseover', () => {
            if (activeInfoWindow) {
              activeInfoWindow.close();
            }
            newInfoWindows.forEach(w => w.close());
            newMarkers.forEach(m => m.setIcon(createMarkerIcon(false, isHotel)));
            
            marker.setIcon(createMarkerIcon(true, isHotel));
            infoWindow.open(mapInstance, marker);
            setActiveInfoWindow(infoWindow);
          });

          // Open dialog on marker click
          marker.addListener('click', () => {
            setSelectedActivity(item);
            setShowDetailsDialog(true);
          });

          // Add click listener to the info window
          google.maps.event.addListener(infoWindow, 'domready', () => {
            const content = infoWindow.getContent();
            if (content) {
              const container = document.querySelector('.gm-style-iw-d');
              if (container) {
                container.addEventListener('click', () => {
                  setSelectedActivity(item);
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
  }, [schedule]); // Only re-render when schedule changes

  return (
    <div className="h-full flex flex-col">
      <div className="relative flex-1">
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