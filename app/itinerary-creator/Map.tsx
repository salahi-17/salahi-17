import { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '@/lib/googleMapsLoader';

interface MapProps {
  latitude: number | null;
  longitude: number | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  readonly?: boolean;
}

export default function Map({ latitude, longitude, onLocationSelect, readonly = true }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      try {
        await loadGoogleMaps();

        const lat = latitude || 0;
        const lng = longitude || 0;

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        const markerInstance = new google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          draggable: !readonly
        });

        if (!readonly && onLocationSelect) {
          // Add click listener to map
          mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
            const latLng = e.latLng;
            if (latLng) {
              markerInstance.setPosition(latLng);
              onLocationSelect(latLng.lat(), latLng.lng());
            }
          });

          // Add drag end listener to marker
          markerInstance.addListener('dragend', () => {
            const position = markerInstance.getPosition();
            if (position) {
              onLocationSelect(position.lat(), position.lng());
            }
          });
        }

        setMap(mapInstance);
        setMarker(markerInstance);
      } catch (error) {
        console.error('Failed to load Google Maps:', error);
      }
    };

    initializeMap();

    return () => {
      if (marker) {
        marker.setMap(null);
      }
      setMap(null);
      setMarker(null);
    };
  }, [mapRef]);

  // Update marker position when coordinates change
  useEffect(() => {
    if (marker && latitude && longitude) {
      const position = new google.maps.LatLng(latitude, longitude);
      marker.setPosition(position);
      map?.setCenter(position);
    }
  }, [latitude, longitude, marker, map]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg"
      style={{ minHeight: '200px' }}
    />
  );
}