import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Heart, Clock } from "lucide-react";

const CoolPeel = () => {
  const benefits = [
    {
      icon: Sparkles,
      title: "Revolutionary Technology",
      description: "Advanced Cool Peel laser resurfaces skin with minimal downtime",
    },
    {
      icon: Zap,
      title: "Quick Treatment",
      description: "Sessions typically take 30 minutes or less",
    },
    {
      icon: Heart,
      title: "Gentle & Comfortable",
      description: "No prolonged redness or peeling like traditional treatments",
    },
    {
      icon: Clock,
      title: "Fast Recovery",
      description: "Return to normal activities immediately after treatment",
    },
  ];

  return (
    <section id="cool-peel" className="py-20 bg-gradient-to-br from-accent/5 to-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
                Featured Technology
              </span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Experience Cool Peel<br />
              <span className="text-accent">The Future of Skin Rejuvenation</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Cool Peel is a revolutionary CO2 laser treatment that delivers powerful results 
              without the extended downtime of traditional laser resurfacing. Perfect for 
              addressing fine lines, sun damage, uneven texture, and achieving a radiant glow.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 shadow-gold"
              >
                Book Cool Peel Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-accent text-accent hover:bg-accent hover:text-primary font-semibold px-8"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-medium">
              <img
                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070"
                alt="Cool Peel laser treatment"
                className="w-full h-[600px] object-cover"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/30 rounded-2xl -z-10" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-2xl -z-10" />
          </div>
        </div>

        {/* Cool Peel Treatment Areas */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            What Cool Peel Treats
          </h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              "Fine Lines & Wrinkles",
              "Sun Damage",
              "Age Spots",
              "Uneven Texture",
              "Enlarged Pores",
            ].map((area) => (
              <Card key={area} className="border-accent/20 hover:border-accent transition-all">
                <CardContent className="p-6 text-center">
                  <p className="font-medium text-foreground">{area}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoolPeel;