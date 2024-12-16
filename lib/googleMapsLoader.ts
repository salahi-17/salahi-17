// Declare google maps types
declare global {
    interface Window {
      google: typeof google;
      initMap: () => void;
    }
  }
  
  let googleMapsPromise: Promise<void>;
  
  export const loadGoogleMaps = () => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key is missing');
      return Promise.reject(new Error('Google Maps API key is missing'));
    }
  
    if (!googleMapsPromise) {
      googleMapsPromise = new Promise((resolve) => {
        window.initMap = () => {
          resolve();
        };
  
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      });
    }
  
    return googleMapsPromise;
  };