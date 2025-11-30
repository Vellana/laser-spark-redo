import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const Technology = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Our Technology
            </h2>
          </div>

          <Card className="border-accent/20">
            <CardContent className="p-8 md:p-12 space-y-6">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Lutronic Clarity II Laser
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The Lutronic Clarity II laser is the gold standard for laser hair
                removal. Its dual wavelength system means that it is safe for use on
                all skin types and tones. It is also exceptionally capable of
                treating a variety of skin issues, from hyperpigmentation to spider
                veins to angiomas and broken capillaries.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-8">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">
                    Safe for All Skin Types
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Dual wavelength technology ensures effective treatment across all
                    skin tones
                  </p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">
                    Versatile Treatment
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Addresses hair removal, pigmentation, vascular issues, and more
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 mt-8">
            <CardContent className="p-8 md:p-12 space-y-6">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Cartessa Tetra Pro CO2 Laser
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The Tetra Pro offers advanced CO2 laser technology with two treatment modes:
                CoolPeel for minimal downtime skin rejuvenation, and Deka Pulse for deeper,
                more intensive resurfacing. This versatile system allows us to customize
                treatments based on your specific skin concerns and downtime preferences.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-8">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">
                    Dual Treatment Modes
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    CoolPeel (minimal downtime, 1-3 days) and Deka Pulse (deeper treatment, 5-10 days)
                  </p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">
                    Comprehensive Treatment
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Fine lines, wrinkles, sun damage, texture, scars, and skin laxity
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Technology;
