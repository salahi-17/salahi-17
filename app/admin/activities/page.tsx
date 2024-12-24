// app/admin/activities/page.tsx
"use client";
import { useState, useEffect } from "react";
import ActivityUploadForm from "./ActivityUploadForm";
import ActivityCard from "./ActivityCard";
import { useToast } from "@/components/ui/use-toast";
import UpdateActivityDialog from "./UpdateActivityDialog";
import { Activity } from "@/types";
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

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/activities");
      if (response.ok) {
        const data = await response.json();
        const parsedActivities: Activity[] = data.map((activity: any) => ({
          ...activity,
          createdAt: new Date(activity.createdAt),
          updatedAt: new Date(activity.updatedAt),
          images: activity.images.map((image: any) => ({
            ...image,
            createdAt: new Date(image.createdAt),
            updatedAt: new Date(image.updatedAt)
          }))
        }));
        setActivities(parsedActivities);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch activities",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
  };

  const handleDeleteConfirm = (id: string) => {
    setActivityToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!activityToDelete) return;
    try {
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
        throw new Error();
      }
    } catch (error) {
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
    fetchActivities();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Activities</h1>

      {/* Create Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Activity</h2>
        <ActivityUploadForm onSubmitSuccess={handleSubmitSuccess} />
      </div>

      {/* Activities Grid */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Activities</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onEdit={handleEdit}
                onDelete={handleDeleteConfirm}
              />
            ))}
          </div>
        )}
      </div>

      {/* Update Dialog */}
      <UpdateActivityDialog
        activity={editingActivity}
        isOpen={!!editingActivity}
        onClose={() => setEditingActivity(null)}
        onSubmitSuccess={handleSubmitSuccess}
      />

      {/* Delete Confirmation Dialog */}
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