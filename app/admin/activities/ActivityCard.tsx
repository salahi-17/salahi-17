// app/admin/activities/ActivityCard.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Activity {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  price: number;
  amenities: string[];
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

export default function ActivityCard({ activity, onEdit, onDelete }: ActivityCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{activity.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image src={activity.image} alt={activity.name} width={300} height={200} className="object-cover mb-2" />
        <p><strong>Category:</strong> {activity.category}</p>
        <p><strong>Location:</strong> {activity.location}</p>
        {activity.price > 0 && <p><strong>Price:</strong> ${activity.price.toFixed(2)}</p>}
        <p><strong>Description:</strong> {activity.description}</p>
        <p><strong>Amenities:</strong> {activity.amenities.join(", ")}</p>
      </CardContent>
      <CardFooter className="space-x-2">
        <Button onClick={() => onEdit(activity)}>Edit</Button>
        <Button variant="destructive" onClick={() => onDelete(activity.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}