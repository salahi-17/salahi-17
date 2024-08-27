// app/profile/SavedItineraries.tsx
"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Itinerary {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

export default function SavedItineraries({ initialItineraries = [] }: { initialItineraries?: Itinerary[] }) {
  const [itineraries, setItineraries] = useState(initialItineraries);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/itineraries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItineraries(itineraries.filter(itinerary => itinerary.id !== id));
        toast({
          title: "Success",
          description: "Itinerary deleted successfully",
          duration: 3000,
        });
      } else {
        throw new Error('Failed to delete itinerary');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the itinerary. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/itinerary-creator?id=${id}`);
  };

  if (itineraries.length === 0) {
    return <p>You haven't created any itineraries yet.</p>;
  }

  return (
    <div className="space-y-4">
      {itineraries.map((itinerary) => (
        <div key={itinerary.id} className="border p-4 rounded-md">
          <h3 className="font-bold">{itinerary.name}</h3>
          <p>Start: {itinerary.startDate.toLocaleDateString()}</p>
          <p>End: {itinerary.endDate.toLocaleDateString()}</p>
          <div className="mt-2 space-x-2">
            <Button onClick={() => handleEdit(itinerary.id)}>Edit</Button>
            <Button variant="destructive" onClick={() => handleDelete(itinerary.id)}>Delete</Button>
          </div>
        </div>
      ))}
    </div>
  );
}