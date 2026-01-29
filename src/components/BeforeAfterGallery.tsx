import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import FadeInSection from "@/components/FadeInSection";

import coolPeelBnA1 from "@/assets/coolpeel-before-after-1.webp";
import coolPeelBnA2 from "@/assets/coolpeel-before-after-2.webp";
import coolPeelBnA3 from "@/assets/coolpeel-before-after-3.webp";
import coolPeelBnA4 from "@/assets/coolpeel-before-after-4.webp";
import coolPeelBnA5 from "@/assets/coolpeel-before-after-5.webp";

export interface BeforeAfterImage {
  src: string;
  alt: string;
  caption: string;
}

export const beforeAfterImages: BeforeAfterImage[] = [
  {
    src: coolPeelBnA1,
    alt: "CoolPeel CO2 laser resurfacing before and after showing reduced sun damage and improved skin texture on female patient face",
    caption: "CoolPeel treatment results: Reduced sun damage and improved skin clarity"
  },
  {
    src: coolPeelBnA2,
    alt: "CoolPeel laser treatment before and after showing reduced hyperpigmentation and age spots on female patient profile view",
    caption: "Visible reduction in hyperpigmentation and age spots after CoolPeel"
  },
  {
    src: coolPeelBnA3,
    alt: "CoolPeel CO2 laser before and after showing improved skin texture and reduced acne scarring on young female patient",
    caption: "Smoother skin texture and reduced blemishes after CoolPeel treatment"
  },
  {
    src: coolPeelBnA4,
    alt: "DEKA CO2 laser skin resurfacing before and after showing dramatic improvement in sun damage and wrinkles on mature female patient",
    caption: "CO₂ laser resurfacing results: Dramatic improvement in sun damage and skin laxity"
  },
  {
    src: coolPeelBnA5,
    alt: "CoolPeel treatment before and after showing reduced pore size and improved skin texture on female patient cheek area",
    caption: "Refined pores and improved overall skin texture after CoolPeel"
  }
];

interface BeforeAfterGalleryProps {
  images?: BeforeAfterImage[];
  showIntro?: boolean;
  showDisclaimer?: boolean;
}

const BeforeAfterGallery = ({ 
  images = beforeAfterImages, 
  showIntro = true,
  showDisclaimer = true 
}: BeforeAfterGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<BeforeAfterImage | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {showIntro && (
        <FadeInSection className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 px-4">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Before & After Results — CoolPeel + CO₂ Laser Resurfacing
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground">
            These are real client results from CoolPeel and CO₂ laser resurfacing treatments performed at our facility. 
            Individual results may vary based on skin type, treatment intensity, and adherence to aftercare instructions.
          </p>
        </FadeInSection>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {images.map((image, index) => (
          <FadeInSection key={index} delay={index * 100}>
            <Card 
              className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {/* Skeleton */}
                <div 
                  className={`absolute inset-0 bg-muted transition-opacity duration-500 ${loadedImages.has(index) ? 'opacity-0' : 'opacity-100'}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-shimmer" />
                </div>
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  onLoad={() => handleImageLoad(index)}
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${loadedImages.has(index) ? 'opacity-100' : 'opacity-0'}`}
                />
              </div>
              <div className="p-3 sm:p-4 bg-card">
                <p className="text-xs sm:text-sm text-muted-foreground text-center">{image.caption}</p>
              </div>
            </Card>
          </FadeInSection>
        ))}
      </div>

      {showDisclaimer && (
        <FadeInSection>
          <p className="text-xs sm:text-sm text-muted-foreground text-center italic mt-4 sm:mt-6 px-4">
            Results vary. Some "after" photos may show mild redness consistent with normal healing.
          </p>
        </FadeInSection>
      )}

      {/* Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-background/95 backdrop-blur-sm">
          <DialogTitle className="sr-only">
            {selectedImage?.caption || "Before and After Image"}
          </DialogTitle>
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 z-50 rounded-full bg-background/80 p-2 hover:bg-background transition-colors"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
          {selectedImage && (
            <div className="flex flex-col animate-fade-in">
              <div className="relative w-full">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
              <div className="p-4 bg-card border-t">
                <p className="text-center text-muted-foreground">{selectedImage.caption}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BeforeAfterGallery;
