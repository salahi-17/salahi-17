"use client";

import { useState, useEffect } from "react";
import ActivityUploadForm from "./ActivityUploadForm";
import ActivityCard from "./ActivityCard";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MediaType } from "@prisma/client";

interface Media {
  id: string;
  url: string;
  type: MediaType;
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  price: number;
  amenities: string[];
  image: string;
  images: Media[];
  rating: number;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const response = await fetch("/api/admin/activities");
    if (response.ok) {
      const data = await response.json();
      const parsedActivities = data.map((activity: any) => ({
        ...activity,
        createdAt: new Date(activity.createdAt),
        updatedAt: new Date(activity.updatedAt)
      }));
      setActivities(parsedActivities);
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
  };

  const handleDeleteConfirm = (id: string) => {
    setActivityToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!activityToDelete) return;

    const response = await fetch(`/api/admin/activities/${activityToDelete}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setActivities(activities.filter(activity => activity.id !== activityToDelete));
      toast({
        title: "Success",
        description: "Activity deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete activity",
        variant: "destructive",
      });
    }

    setDeleteConfirmOpen(false);
    setActivityToDelete(null);
  };

  const handleSubmitSuccess = () => {
    setEditingActivity(undefined);
    fetchActivities();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Activities</h1>
      <ActivityUploadForm activity={editingActivity} onSubmitSuccess={handleSubmitSuccess} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {activities.map(activity => (
          <ActivityCard 
            key={activity.id} 
            activity={activity} 
            onEdit={handleEdit} 
            onDelete={handleDeleteConfirm} 
          />
        ))}
      </div>
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the activity.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}