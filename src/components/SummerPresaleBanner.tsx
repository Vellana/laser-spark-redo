import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Tag } from "lucide-react";

const SummerPresaleBanner = () => {
  return (
    <section className="py-10 bg-gradient-to-b from-accent/10 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-card border-2 border-accent/40 rounded-2xl shadow-xl p-6 sm:p-8 text-center space-y-5 animate-pulse-subtle overflow-hidden">
            {/* Decorative corner accent */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-accent/10 rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-accent/10 rounded-tl-full" />

            <div className="relative space-y-4">
              {/* Badge row */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  <Tag className="w-3.5 h-3.5" />
                  Summer Pre-Sale
                </span>
                <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  June 7-20
                </span>
                <span className="inline-flex items-center gap-1.5 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-bold border border-accent/30">
                  Up to 40% Off Select Treatments
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Buy Now, Treat Later: Limited Time Offer
              </h2>

              {/* Subcopy */}
              <p className="text-muted-foreground max-w-xl mx-auto">
                Lock in summer savings on laser hair removal and CoolPeel packages.
                Schedule your treatments whenever you are ready.
              </p>

              {/* CTA */}
              <div className="pt-2">
                <Link to="/specials">
                  <Button
                    size="lg"
                    variant="accent"
                    className="px-8 py-5 text-base font-semibold transition-all hover:scale-105"
                  >
                    View Specials
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Fine print */}
              <p className="text-xs text-muted-foreground/70">
                Cannot be combined with other offers. See specials page for full details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummerPresaleBanner;
