import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  priority?: boolean;
}

const OptimizedImage = ({
  src,
  alt,
  className,
  aspectRatio = "auto",
  priority = false,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "",
  };

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "50px", threshold: 0.01 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div
      ref={imgRef}
      className={cn(
        "relative overflow-hidden bg-muted",
        aspectClasses[aspectRatio],
        className
      )}
    >
      {/* Skeleton placeholder */}
      <div
        className={cn(
          "absolute inset-0 bg-muted transition-opacity duration-500",
          isLoaded ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-shimmer" />
      </div>

      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
