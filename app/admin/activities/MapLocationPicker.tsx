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

export default function MapLocationPicker({ latitude, longitude, onLocationSelect }: MapLocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Initialize the map when dialog opens
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
    if (!mapElement) return;

    const map = new google.maps.Map(mapElement, {
      center: { lat: latitude || 0, lng: longitude || 0 },
      zoom: 12,
    });

    const marker = new google.maps.Marker({
      position: { lat: latitude || 0, lng: longitude || 0 },
      map,
      draggable: true
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
        <div id="map" className="w-full h-[400px] rounded-md"></div>
      </DialogContent>
    </Dialog>
  );
}