import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  latitude: number | null;
  longitude: number | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  readonly?: boolean;
}

declare global {
  interface Window {
    google: typeof google;
  }
}

export default function Map({ latitude, longitude, onLocationSelect, readonly = true }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      // Ensure the DOM element exists
      const mapElement = mapRef.current;
      if (!mapElement) return;

      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places']
        });

        // Load the Maps JavaScript API
        const google = await loader.load();

        const lat = latitude ?? 0;
        const lng = longitude ?? 0;

        // Create the map instance
        const mapInstance = new google.maps.Map(mapElement, {
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

        // Create the marker
        const markerInstance = new google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          draggable: !readonly
        });

        if (!readonly && onLocationSelect) {
          // Map click handler
          mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
            const latLng = e.latLng;
            if (latLng) {
              markerInstance.setPosition(latLng);
              onLocationSelect(latLng.lat(), latLng.lng());
            }
          });

          // Marker drag handler
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
        console.error('Error loading Google Maps:', error);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      if (marker) {
        marker.setMap(null);
      }
      setMap(null);
      setMarker(null);
    };
  }, []); // Empty dependency array as we handle updates in a separate effect

  // Update marker position when coordinates change
  useEffect(() => {
    if (marker && map && latitude != null && longitude != null) {
      const position = new google.maps.LatLng(latitude, longitude);
      marker.setPosition(position);
      map.setCenter(position);
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