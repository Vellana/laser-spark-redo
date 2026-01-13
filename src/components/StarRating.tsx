import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating?: number;
  className?: string;
}

const StarRating = ({ rating = 4.5, className = "" }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-accent text-accent" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-5 h-5 text-accent/30" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-5 h-5 fill-accent text-accent" />
            </div>
          </div>
        )}
        {[...Array(5 - Math.ceil(rating))].map((_, i) => (
          <Star key={`empty-${i}`} className="w-5 h-5 text-accent/30" />
        ))}
      </div>
      <span className="text-sm font-medium text-muted-foreground">
        {rating} / 5
      </span>
    </div>
  );
};

export default StarRating;
