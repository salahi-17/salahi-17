'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";

interface ActivityProps {
  activity: {
    title: string;
    location: string;
    image: string;
    category: string;
    area: string;
    imageData: {
      src: string;
      placeholder: string;
    };
  };
}

const ActivityCard: React.FC<ActivityProps> = ({ activity }) => {
  const router = useRouter();

  const handleClick = () => {
    const category = encodeURIComponent(activity.category);
    const area = encodeURIComponent(activity.area);
    router.push(`/activities/${category}/${area}`);
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <div className="relative h-48">
        <Image
          src={activity.imageData.src}
          alt={activity.title}
          fill
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL={activity.imageData.placeholder}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold">{activity.title}</h3>
        <p className="text-sm text-gray-600">{activity.location}</p>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;