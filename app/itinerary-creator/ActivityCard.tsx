import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import { Activity } from './types';
import LazyImage from '@/components/LazyImage';
import { useInView } from 'react-intersection-observer';

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

  const isHotel = category.toLowerCase() === 'hotel';

  return (
    <Card
      ref={ref}
      className={`activity-card group cursor-pointer overflow-hidden
      ${item.price > 0 ? 'cursor-move' : 'cursor-not-allowed'}
      hover:shadow-xl transition-all duration-300`} 
      draggable={item.price > 0}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      {inView && (
        <>
          <div className="relative h-48">
            <LazyImage
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {item.rating && (
              <Badge
                variant="secondary"
                className="absolute top-2 right-2 flex items-center gap-1 bg-white/90"
              >
                <Star className="h-4 w-4 fill-yellow-400" />
                {item.rating.toFixed(1)}
              </Badge>
            )}
          </div>
          <div className="p-4 space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-lg">{item.name}</h4>
              <Badge>{category}</Badge>
            </div>

            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="truncate">{item.location}</span>
            </div>

            {isHotel ? (
              <div className="space-y-1">
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                <p className="font-bold text-lg">${item.price.toFixed(2)} <span className="text-sm font-normal text-gray-500">per night</span></p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {item.amenities.slice(0, 2).map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {item.amenities.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.amenities.length - 2} more
                    </Badge>
                  )}
                </div>
                {item.price > 0 && (
                  <p className="font-bold">${item.price.toFixed(2)} <span className="text-sm font-normal text-gray-500">per person</span></p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
});

ActivityCard.displayName = 'ActivityCard';

export default ActivityCard;