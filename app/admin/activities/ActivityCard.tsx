// app/admin/activities/ActivityCard.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { Activity } from "@/types";
import {  DollarSign, MapPin, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

export default function ActivityCard({ activity, onEdit, onDelete }: ActivityCardProps) {
  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <Image 
          src={activity.image} 
          alt={activity.name} 
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white font-semibold text-xl">{activity.name}</h3>
          <span className="text-white/90 text-sm">{activity.category}</span>
        </div>
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{activity.location}</span>
        </div>
        
        {activity.price > 0 && (
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <span>${activity.price.toFixed(2)}</span>
          </div>
        )}
        
        <p className="text-gray-600 text-sm line-clamp-2">{activity.description}</p>
        
        <div className="flex flex-wrap gap-1">
          {activity.amenities.slice(0, 3).map((amenity:string, index:number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {activity.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{activity.amenities.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-4 bg-gray-50">
        <Button variant="outline" size="sm" onClick={() => onEdit(activity)}>
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(activity.id)}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}