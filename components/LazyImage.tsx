// LazyImage.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        const cachedImage = localStorage.getItem(src);
        if (cachedImage) {
          if (isMounted) {
            setImageSrc(cachedImage);
            setLoading(false);
          }
          return;
        }

        const response = await fetch(src);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          if (isMounted) {
            const base64data = reader.result as string;
            setImageSrc(base64data);
            setLoading(false);
            try {
              localStorage.setItem(src, base64data);
            } catch (error) {
              console.warn('Failed to cache image:', error);
            }
          }
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error loading image:', error);
        if (isMounted) {
          setImageSrc(src); // Fallback to original source
          setLoading(false);
        }
      }
    };

    setLoading(true);
    loadImage();

    return () => {
      isMounted = false;
    };
  }, [src]);

  if (loading) {
    return <div className={`${className} bg-gray-200 animate-pulse`} />;
  }

  return (
    <img
      src={imageSrc || src}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
};

export default React.memo(LazyImage);