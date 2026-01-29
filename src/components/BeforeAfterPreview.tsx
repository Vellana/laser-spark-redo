import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import coolPeelBnA1 from "@/assets/coolpeel-before-after-1.webp";
import coolPeelBnA2 from "@/assets/coolpeel-before-after-2.webp";
import coolPeelBnA3 from "@/assets/coolpeel-before-after-3.webp";

const previewImages = [
  {
    src: coolPeelBnA1,
    alt: "CoolPeel CO2 laser resurfacing before and after showing reduced sun damage and improved skin texture",
    caption: "Reduced sun damage and improved skin clarity"
  },
  {
    src: coolPeelBnA2,
    alt: "CoolPeel laser treatment before and after showing reduced hyperpigmentation",
    caption: "Visible reduction in hyperpigmentation"
  },
  {
    src: coolPeelBnA3,
    alt: "CoolPeel CO2 laser before and after showing improved skin texture",
    caption: "Smoother skin texture after treatment"
  }
];

const BeforeAfterPreview = () => {
  return (
    <section className="py-12 sm:py-16 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
            Before & After Results
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            See real client transformations from CoolPeel and CO₂ laser resurfacing treatments. 
            Results vary by individual.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-6 sm:mb-8">
          {previewImages.map((image, index) => (
            <Card 
              key={index} 
              className="overflow-hidden group"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-2 sm:p-3 bg-card">
                <p className="text-xs text-muted-foreground text-center">{image.caption}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/gallery?tab=beforeAfter">
            <Button size="lg" variant="outline" className="border-2 border-accent text-accent hover:bg-accent/10 font-semibold text-sm sm:text-base px-6 sm:px-8">
              View More Results <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterPreview;
