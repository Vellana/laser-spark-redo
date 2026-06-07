import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Sparkles, Zap } from "lucide-react";

const SummerPresaleBanner = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-accent/10 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Section heading */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              <Calendar className="w-3.5 h-3.5" />
              Summer Pre-Sale · June 7-20
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Limited-Time Summer Offers
            </h2>
            <p className="text-muted-foreground">
              Buy now, treat later. Two separate offers — pick the one for you.
            </p>
          </div>

          {/* Two offer cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Offer A: Laser Hair Removal */}
            <div className="relative bg-card border-2 border-accent/40 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col text-center md:text-left space-y-4 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-bl-full" />
              <div className="relative space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    <Zap className="w-3.5 h-3.5" />
                    Offer A
                  </span>
                  <span className="inline-flex items-center bg-accent/20 text-accent border border-accent/30 px-3 py-1 rounded-full text-xs font-bold">
                    40% OFF
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  40% Off Laser Hair Removal
                </h3>
                <p className="text-muted-foreground text-sm flex-1">
                  Save 40% on packages of 5 treatments with the Lutronic Clarity II —
                  safe and effective for all skin types. Monthly payments available
                  through Cherry.
                </p>
                <div className="pt-2">
                  <Link to="/specials">
                    <Button variant="accent" className="w-full sm:w-auto font-semibold">
                      View Offer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Offer B: CoolPeel */}
            <div className="relative bg-card border-2 border-primary/40 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col text-center md:text-left space-y-4 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full" />
              <div className="relative space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5" />
                    Offer B
                  </span>
                  <span className="inline-flex items-center bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-bold">
                    $500 OFF
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  $500 Off CoolPeel Packages
                </h3>
                <p className="text-muted-foreground text-sm flex-1">
                  Save $500 on a package of 3 CoolPeel treatments — powered by the
                  DEKA SmartXide CO2 laser for skin resurfacing with minimal downtime.
                  Monthly payments available through Cherry.
                </p>
                <div className="pt-2">
                  <Link to="/specials">
                    <Button variant="accent" className="w-full sm:w-auto font-semibold">
                      View Offer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Fine print */}
          <p className="text-xs text-muted-foreground/70 text-center">
            Offers cannot be combined with other discounts or promotions. Valid June 7-20, 2026.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SummerPresaleBanner;
