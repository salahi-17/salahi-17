import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import MapLocationPicker from "./MapLocationPicker";
import { MediaType } from "@prisma/client";
import { X, Upload, Loader2 } from "lucide-react";

interface Activity {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  price: number;
  amenities: string[];
  image: string;
  images: { id: string; url: string; type: MediaType }[];
  rating: number | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ActivityUploadFormProps {
  activity?: Activity;
  onSubmitSuccess: () => void;
}

interface MediaUploadStatus {
  file: File;
  progress: number;
  isUploading: boolean;
}

export default function ActivityUploadForm({ activity, onSubmitSuccess }: ActivityUploadFormProps) {
  const [name, setName] = useState(activity?.name || "");
  const [category, setCategory] = useState(activity?.category || "");
  const [location, setLocation] = useState(activity?.location || "");
  const [description, setDescription] = useState(activity?.description || "");
  const [price, setPrice] = useState(activity?.price.toString() || "");
  const [amenities, setAmenities] = useState(activity?.amenities.join(", ") || "");
  const [rating, setRating] = useState(activity?.rating?.toString() || "");
  const [latitude, setLatitude] = useState<number | null>(activity?.latitude || null);
  const [longitude, setLongitude] = useState<number | null>(activity?.longitude || null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [existingMedia, setExistingMedia] = useState(activity?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const [mediaUploads, setMediaUploads] = useState<MediaUploadStatus[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = () => {
    setName("");
    setCategory("");
    setLocation("");
    setDescription("");
    setPrice("");
    setAmenities("");
    setRating("");
    setLatitude(null);
    setLongitude(null);
    setMediaFiles([]);
    setExistingMedia([]);
    setMediaUploads([]);
    formRef.current?.reset();
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
    if (!activity && mediaFiles.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one image is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newUploads = files.map(file => ({
      file,
      progress: 0,
      isUploading: true
    }));

    setMediaUploads(prev => [...prev, ...newUploads]);
    setMediaFiles(prev => [...prev, ...files]);

    // Start uploading each file
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Simulate progress updates
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setMediaUploads(prev => prev.map((upload, i) =>
            i === index + prev.length - files.length
              ? { ...upload, progress: Math.min(progress, 100) }
              : upload
          ));

          if (progress >= 100) {
            clearInterval(interval);
            setMediaUploads(prev => prev.map((upload, i) =>
              i === index + prev.length - files.length
                ? { ...upload, isUploading: false }
                : upload
            ));
          }
        }, 500);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if any media is still uploading
    if (mediaUploads.some(upload => upload.isUploading)) {
      toast({
        title: "Please wait",
        description: "Media files are still uploading",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("amenities", JSON.stringify(amenities.split(",").map(item => item.trim())));
    formData.append("rating", rating || "0");
    formData.append("latitude", latitude?.toString() || "");
    formData.append("longitude", longitude?.toString() || "");

    mediaFiles.forEach((file, index) => {
      formData.append(`media`, file);
    });

    formData.append("existingMedia", JSON.stringify(existingMedia));

    try {
      const url = activity ? `/api/admin/activities/${activity.id}` : "/api/admin/activities";
      const response = await fetch(url, {
        method: activity ? "PUT" : "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Activity ${activity ? 'updated' : 'created'} successfully`,
        });
        resetForm();
        onSubmitSuccess();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${activity ? 'update' : 'create'} activity`,
        variant: "destructive",
      });
    }
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingMedia = (mediaId: string) => {
    setExistingMedia(prev => prev.filter(media => media.id !== mediaId));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>

      <div>
        <Label>Map Location</Label>
        <MapLocationPicker
          latitude={latitude}
          longitude={longitude}
          onLocationSelect={(lat, lng) => {
            console.log(lat, lng)
            setLatitude(lat);
            setLongitude(lng);
          }}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
        <Input id="amenities" value={amenities} onChange={(e) => setAmenities(e.target.value)} required />
      </div>

      <div>
        <Label>Media Files</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {existingMedia.map((media) => (
            <Card key={media.id} className="relative">
              {media.type === 'IMAGE' ? (
                <img src={media.url} alt="" className="w-full h-32 object-cover rounded-md" />
              ) : (
                <video src={media.url} className="w-full h-32 object-cover rounded-md" />
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1"
                onClick={() => removeExistingMedia(media.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}

          {mediaUploads.map((upload, index) => (
            <Card key={index} className="relative">
              {upload.file.type.startsWith('image/') ? (
                <img src={URL.createObjectURL(upload.file)} alt="" className="w-full h-32 object-cover rounded-md" />
              ) : (
                <video src={URL.createObjectURL(upload.file)} className="w-full h-32 object-cover rounded-md" />
              )}
              {upload.isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-full max-w-[80%]">
                    <div className="bg-white rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                    <p className="text-white text-xs mt-2 text-center">{Math.round(upload.progress)}%</p>
                  </div>
                </div>
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1"
                onClick={() => removeMediaFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}

          <label className="border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer h-32">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-sm font-semibold text-gray-600">Add Media</span>
            </div>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaSelect}
              className="hidden"
              multiple
            />
          </label>
        </div>
      </div>

      <Button
        type="submit"
        disabled={mediaUploads.some(upload => upload.isUploading)}
      >
        {activity ? 'Update' : 'Create'} Activity
      </Button>

    </form>
  );
}