// app/admin/activities/ActivityUploadForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

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

interface ActivityUploadFormProps {
  activity?: Activity;
  onSubmitSuccess: () => void;
}

export default function ActivityUploadForm({ activity, onSubmitSuccess }: ActivityUploadFormProps) {
  const [name, setName] = useState(activity?.name || "");
  const [category, setCategory] = useState(activity?.category || "");
  const [location, setLocation] = useState(activity?.location || "");
  const [description, setDescription] = useState(activity?.description || "");
  const [price, setPrice] = useState(activity?.price.toString() || "");
  const [amenities, setAmenities] = useState(activity?.amenities.join(", ") || "");
  const [image, setImage] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (activity) {
      setName(activity.name);
      setCategory(activity.category);
      setLocation(activity.location);
      setDescription(activity.description);
      setPrice(activity.price.toString());
      setAmenities(activity.amenities.join(", "));
    }
  }, [activity]);

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const validateForm = () => {
    if (!name || !category || !location || !description || !amenities) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return false;
    }
    if (isNaN(parseFloat(price))) {
      toast({
        title: "Validation Error",
        description: "Price must be a valid number",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", toTitleCase(name));
    formData.append("category", toTitleCase(category));
    formData.append("location", toTitleCase(location));
    formData.append("description", description);
    formData.append("price", price);
    formData.append("amenities", JSON.stringify(amenities.split(",").map(item => toTitleCase(item.trim()))));
    if (image) {
      formData.append("image", image);
    }

    const url = activity ? `/api/admin/activities/${activity.id}` : "/api/admin/activities";
    const method = activity ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Activity ${activity ? 'updated' : 'created'} successfully`,
        });
        onSubmitSuccess();
      } else {
        throw new Error(`Failed to ${activity ? 'update' : 'create'} activity`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${activity ? 'update' : 'create'} activity`,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} defaultValue={0} />
      </div>
      <div>
        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
        <Input id="amenities" value={amenities} onChange={(e) => setAmenities(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="image">Image</Label>
        <Input id="image" type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        {activity && <p className="text-sm text-gray-500 mt-1">Leave empty to keep the current image</p>}
      </div>
      <Button type="submit">{activity ? 'Update' : 'Create'} Activity</Button>
    </form>
  );
}