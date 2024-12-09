import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton"; // You'll need to add this UI component

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function LazyImage({ src, alt, className }: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        // Check cache first
        const cachedImage = localStorage.getItem(`img_cache_${src}`);
        if (cachedImage) {
          if (isMounted) {
            setImageSrc(cachedImage);
            setIsLoading(false);
          }
          return;
        }

        // Load image
        const response = await fetch(src);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        if (isMounted) {
          setImageSrc(objectUrl);
          setIsLoading(false);
          
          // Cache the image
          try {
            localStorage.setItem(`img_cache_${src}`, objectUrl);
          } catch (error) {
            console.warn('Failed to cache image:', error);
          }
        }
      } catch (error) {
        console.error('Error loading image:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [src]);

  if (isLoading) {
    return <Skeleton className={className} />;
  }

  return (
    <img
      src={imageSrc || src}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
}