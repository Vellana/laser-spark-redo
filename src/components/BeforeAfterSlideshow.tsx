import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import beforeAfter1 from "@/assets/coolpeel-before-after-1.webp";
import beforeAfter2 from "@/assets/coolpeel-before-after-2.webp";
import beforeAfter3 from "@/assets/coolpeel-before-after-3.webp";
import beforeAfter4 from "@/assets/coolpeel-before-after-4.webp";
import beforeAfter5 from "@/assets/coolpeel-before-after-5.webp";

const slides = [
  {
    image: beforeAfter1,
    alt: "CoolPeel before and after results showing improved skin texture and reduced fine lines",
    caption: "Improved skin texture after CoolPeel treatment",
  },
  {
    image: beforeAfter2,
    alt: "CO2 laser resurfacing before and after showing reduced wrinkles and sun damage",
    caption: "Reduced wrinkles and sun damage",
  },
  {
    image: beforeAfter3,
    alt: "Skin rejuvenation results with CoolPeel CO2 laser treatment",
    caption: "Visible skin rejuvenation results",
  },
  {
    image: beforeAfter4,
    alt: "Before and after CoolPeel treatment showing smoother skin",
    caption: "Smoother, more youthful skin",
  },
  {
    image: beforeAfter5,
    alt: "CoolPeel results demonstrating improved skin tone and clarity",
    caption: "Enhanced skin tone and clarity",
  },
];

const BeforeAfterSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="mt-16 max-w-4xl mx-auto">
      <h3 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-4">
        Before & After Results
      </h3>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        See real results from our CoolPeel and CO2 laser resurfacing treatments. Individual results may vary.
      </p>

      <div 
        className="relative rounded-2xl overflow-hidden shadow-medium bg-card"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Main Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-contain bg-secondary/30"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-md"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-md"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Caption */}
        <div className="p-4 text-center bg-card">
          <p className="text-foreground font-medium">{slides[currentSlide].caption}</p>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 pb-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-accent w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        Results vary. Some "after" photos may show mild redness consistent with normal healing.
      </p>

      {/* View More Button */}
      <div className="text-center mt-6">
        <Link to="/gallery?tab=beforeAfter">
          <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary">
            View More Results
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BeforeAfterSlideshow;
