import { DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react"; // Import X icon for close button
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin } from "lucide-react";
import { Activity } from './types';
import dynamic from 'next/dynamic';
import ImageGallery from "./ImageGallery";

const MapWithNoSSR = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg" />
    )
});

interface ActivityDetailsDialogProps {
    item: Activity;
    category: string;
    guestCount: number;
    onGuestCountChange: (count: number) => void;
}

export default function ActivityDetailsDialog({ item, category, guestCount, onGuestCountChange }: ActivityDetailsDialogProps) {
    const isHotel = category.toLowerCase() === 'hotel';
    return (
        <DialogContent className="max-w-7xl p-0">
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogClose>
            <div className="flex flex-col h-[90vh] overflow-hidden rounded-xl border ">
                {/* Gallery Section */}
                <div className="h-[50vh] bg-gray-100 ">
                    <ImageGallery
                        mainImage={item.image}
                        mediaItems={item.images} // This will now include all images including the main one
                    />
                </div>

                {/* Content Section */}
                <div className="flex flex-1 min-h-0 divide-x">
                    {/* Left side - Details */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="space-y-2 w-[70%]">
                                    <h2 className="text-2xl font-semibold mb-2">{item.name}</h2>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center text-gray-500">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            <span>{item.location}</span>
                                        </div>
                                        {item.rating && (
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                                                {Number(item.rating).toFixed(1)}
                                            </Badge>
                                        )}
                                        <Badge>{category}</Badge>
                                    </div>
                                    <p className="text-gray-600">{item.description}</p>
                                    {/* Amenities */}
                                    <div>
                                        <h3 className="font-semibold mb-3">Amenities</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {item.amenities.map((amenity, idx) => (
                                                <Badge key={idx} variant="outline">
                                                    {amenity}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Map */}
                                {item.latitude && item.longitude && (
                                    <div className="h-[200px] w-[30%] rounded-lg overflow-hidden">
                                        <MapWithNoSSR
                                            latitude={item.latitude}
                                            longitude={item.longitude}
                                            onLocationSelect={() => { }}
                                        />
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Right side - Booking */}
                    <div className="w-[320px] p-6 bg-gray-50">
                        <div className="space-y-6">
                            {/* Price */}
                            <div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold">${item.price.toFixed(2)}</span>
                                    <span className="text-gray-500">per person</span>
                                </div>
                            </div>

                            {/* Guest Selection */}
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">
                                    Number of Guests
                                </label>
                                <Select value={guestCount.toString()} onValueChange={(v) => onGuestCountChange(Number(v))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Total */}
                            <div className="pt-4 border-t">
                                <div className="flex justify-between mb-4">
                                    <span>Total</span>
                                    <span className="font-semibold">${(item.price * guestCount).toFixed(2)}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}