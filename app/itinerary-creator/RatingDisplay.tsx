import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RatingDisplayProps {
  rating: number | null;
  className?: string;
}

export default function RatingDisplay({ rating, className = "" }: RatingDisplayProps) {
  if (rating == null) return null;

  return (
    <Badge 
      variant="secondary" 
      className={`flex items-center gap-1 ${className}`}
    >
      <Star className="h-4 w-4 fill-yellow-400" />
      {Number(rating).toFixed(1)}
    </Badge>
  );
}