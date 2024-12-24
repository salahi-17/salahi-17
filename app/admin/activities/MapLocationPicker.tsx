import { useState, useEffect } from 'react';
import { Map } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import maps from 'google-maps';

interface MapLocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

const ZANZIBAR_COORDINATES = { lat: -6.165917, lng: 39.202641 };

export default function MapLocationPicker({ latitude, longitude, onLocationSelect }: MapLocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);

  useEffect(() => {
    if (isOpen) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    }
  }, [isOpen]);

  const initializeMap = () => {
    const mapElement = document.getElementById('map');
    const searchInput = document.getElementById('pac-input') as HTMLInputElement;
    if (!mapElement || !searchInput) return;

    const initialLocation = latitude && longitude 
      ? { lat: latitude, lng: longitude }
      : ZANZIBAR_COORDINATES;

    const map = new google.maps.Map(mapElement, {
      center: initialLocation,
      zoom: 12,
    });

    const marker = new google.maps.Marker({
      position: initialLocation,
      map,
      draggable: true
    });

    // Initialize SearchBox
    const searchBoxInstance = new google.maps.places.SearchBox(searchInput);
    setSearchBox(searchBoxInstance);

    // Bias SearchBox results towards current map's viewport
    map.addListener('bounds_changed', () => {
      searchBoxInstance.setBounds(map.getBounds() as google.maps.LatLngBounds);
    });

    searchBoxInstance.addListener('places_changed', () => {
      const places = searchBoxInstance.getPlaces();
      if (places?.length === 0) return;

      const place = places![0];
      if (!place.geometry?.location) return;

      // Update map and marker
      map.setCenter(place.geometry.location);
      marker.setPosition(place.geometry.location);
      map.setZoom(15);

      onLocationSelect(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
    });

    marker.addListener('dragend', () => {
      const position = marker.getPosition();
      if (position) {
        onLocationSelect(position.lat(), position.lng());
      }
    });

    map.addListener('click', (e: google.maps.MouseEvent) => {
      marker.setPosition(e.latLng);
      onLocationSelect(e.latLng.lat(), e.latLng.lng());
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" className="w-full">
          <Map className="mr-2 h-4 w-4" />
          {latitude && longitude ? 'Change Location' : 'Select Location'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
        </DialogHeader>
        <div className="relative w-full">
          <input
            id="pac-input"
            className="w-full p-2 border rounded-md mb-2"
            type="text"
            placeholder="Search for a location..."
          />
        </div>
        <div id="map" className="w-full h-[400px] rounded-md"></div>
      </DialogContent>
    </Dialog>
  );
}