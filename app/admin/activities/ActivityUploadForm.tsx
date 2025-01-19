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
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  isUploading: boolean;
  type: 'image' | 'video';
  error?: string;
  loaded: boolean;
}

export default function ActivityUploadForm({ activity, onSubmitSuccess }: ActivityUploadFormProps) {
  const [name, setName] = useState(activity?.name || "");
  const [category, setCategory] = useState(activity?.category || "");
  const [location, setLocation] = useState(activity?.location || "");
  const [description, setDescription] = useState(activity?.description || "");
  const [price, setPrice] = useState(activity?.price?.toString() || "");
  const [amenities, setAmenities] = useState(activity?.amenities?.join(", ") || "");
  const [rating, setRating] = useState(activity?.rating?.toString() || "");
  const [latitude, setLatitude] = useState<number | null>(activity?.latitude || null);
  const [longitude, setLongitude] = useState<number | null>(activity?.longitude || null);
  const [existingMedia, setExistingMedia] = useState(activity?.images || []);
  const [mediaUploads, setMediaUploads] = useState<MediaUploadStatus[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      mediaUploads.forEach(upload => {
        URL.revokeObjectURL(upload.previewUrl);
      });
    };
  }, [mediaUploads]);

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
    setExistingMedia([]);
    // Cleanup preview URLs
    mediaUploads.forEach(upload => {
      URL.revokeObjectURL(upload.previewUrl);
    });
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

    if (!activity && mediaUploads.length === 0 && existingMedia.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one image is required",
        variant: "destructive",
      });
      return false;
    }

    // Check if any media is still loading or has errors
    const hasUnloadedMedia = mediaUploads.some(
      upload => !upload.loaded || upload.error
    );
    if (hasUnloadedMedia) {
      toast({
        title: "Media Loading",
        description: "Please wait for all media to finish loading",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      // Create initial upload status
      const upload: MediaUploadStatus = {
        id: Math.random().toString(36).substring(7),
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        isUploading: true,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        loaded: false
      };

      setMediaUploads(prev => [...prev, upload]);

      if (upload.type === 'image') {
        // Handle image loading
        const img = new Image();
        img.onload = () => {
          setMediaUploads(prev => 
            prev.map(u => 
              u.id === upload.id 
                ? { ...u, isUploading: false, loaded: true, progress: 100 }
                : u
            )
          );
        };
        img.onerror = () => {
          setMediaUploads(prev => 
            prev.map(u => 
              u.id === upload.id 
                ? { ...u, isUploading: false, error: 'Failed to load image', progress: 0 }
                : u
            )
          );
          URL.revokeObjectURL(upload.previewUrl);
        };
        img.src = upload.previewUrl;
      } else {
        // Handle video loading
        const video = document.createElement('video');
        video.onloadeddata = () => {
          setMediaUploads(prev => 
            prev.map(u => 
              u.id === upload.id 
                ? { ...u, isUploading: false, loaded: true, progress: 100 }
                : u
            )
          );
        };
        video.onerror = () => {
          setMediaUploads(prev => 
            prev.map(u => 
              u.id === upload.id 
                ? { ...u, isUploading: false, error: 'Failed to load video', progress: 0 }
                : u
            )
          );
          URL.revokeObjectURL(upload.previewUrl);
        };

        // Show loading progress for video
        video.addEventListener('progress', () => {
          if (video.buffered.length > 0) {
            const progress = (video.buffered.end(0) / video.duration) * 100;
            setMediaUploads(prev => 
              prev.map(u => 
                u.id === upload.id 
                  ? { ...u, progress: Math.round(progress) }
                  : u
              )
            );
          }
        });

        video.src = upload.previewUrl;
        video.load();
      }
    });
  };

  const removeMediaFile = (id: string) => {
    setMediaUploads(prev => {
      const uploadToRemove = prev.find(upload => upload.id === id);
      if (uploadToRemove) {
        URL.revokeObjectURL(uploadToRemove.previewUrl);
      }
      return prev.filter(upload => upload.id !== id);
    });
  };

  const removeExistingMedia = (mediaId: string) => {
    setExistingMedia(prev => prev.filter(media => media.id !== mediaId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
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

      // Add all media files
      mediaUploads.forEach(upload => {
        formData.append("media", upload.file);
      });

      // Add existing media information
      formData.append("existingMedia", JSON.stringify(existingMedia));

      const url = activity ? `/api/admin/activities/${activity.id}` : "/api/admin/activities";
      const response = await fetch(url, {
        method: activity ? "PUT" : "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast({
        title: "Success",
        description: `Activity ${activity ? 'updated' : 'created'} successfully`,
      });
      resetForm();
      onSubmitSuccess();
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: `Failed to ${activity ? 'update' : 'create'} activity`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
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
          <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
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
              {media.type === MediaType.IMAGE ? (
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

          {mediaUploads.map((upload) => (
            <Card key={upload.id} className="relative">
              {upload.type === 'image' ? (
                <img 
                  src={upload.previewUrl} 
                  alt="" 
                  className={`w-full h-32 object-cover rounded-md ${upload.isUploading ? 'opacity-50' : ''}`}
                />
              ) : (
                <video 
                  src={upload.previewUrl} 
                  className={`w-full h-32 object-cover rounded-md ${upload.isUploading ? 'opacity-50' : ''}`}
                />
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
                    <p className="text-white text-xs mt-2 text-center">
                      {Math.round(upload.progress)}%
                    </p>
                  </div>
                </div>
              )}
              
              {upload.error && (
                <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                  <p className="text-white text-xs px-2 text-center">{upload.error}</p>
                </div>
              )}

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1"
                onClick={() => removeMediaFile(upload.id)}
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
        disabled={isSubmitting || mediaUploads.some(upload => !upload.loaded || upload.isUploading)}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {activity ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          <>{activity ? 'Update' : 'Create'} Activity</>
        )}
      </Button>
    </form>
  );
}