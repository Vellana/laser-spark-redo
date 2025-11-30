import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Heart, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const CoolPeel = () => {
  const [activeTab, setActiveTab] = useState<"coolpeel" | "dekapulse">("coolpeel");

  const benefits = [
    {
      icon: Sparkles,
      title: "Revolutionary Technology",
      description: "Advanced CO2 laser resurfaces skin with customizable intensity",
    },
    {
      icon: Zap,
      title: "Quick Treatment",
      description: "Sessions typically take 30 minutes or less",
    },
    {
      icon: Heart,
      title: "Safe & Effective",
      description: "Suitable for all skin types with proven results",
    },
    {
      icon: Clock,
      title: "Flexible Recovery",
      description: "Choose your downtime: minimal (CoolPeel) or moderate (Deka Pulse)",
    },
  ];

  return (
    <section id="cool-peel" className="py-20 bg-gradient-to-br from-accent/5 to-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Content Side */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
                Featured Technology
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Advanced Laser Resurfacing<br />
              <span className="text-accent">Choose Your Perfect Treatment</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              The Tetra Pro by Cartessa offers two powerful CO2 laser treatments: CoolPeel for
              minimal downtime and Deka Pulse for deeper, more dramatic results. Both stimulate
              collagen production for smoother, more youthful-looking skin.
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
              <a href="https://www.vagaro.com/virginialaserspecialists/services" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 shadow-gold"
                >
                  Book Consultation
                </Button>
              </a>
              <Link to="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-accent text-accent hover:bg-accent hover:text-primary font-semibold px-8"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-medium">
              <img
                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070"
                alt="CO2 laser resurfacing treatment"
                className="w-full h-[600px] object-cover"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/30 rounded-2xl -z-10" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-2xl -z-10" />
          </div>
        </div>

        {/* Treatment Comparison */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-foreground mb-4">
            Compare Our Treatments
          </h3>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Both treatments use the Cartessa Tetra Pro CO2 laser. Choose based on your skin concerns and preferred downtime.
          </p>

          {/* Custom Button Selector */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab("coolpeel")}
              className={`px-8 py-4 text-lg font-semibold rounded-lg border-2 transition-all duration-300 ${activeTab === "coolpeel"
                ? "border-accent bg-accent/10 text-accent shadow-md"
                : "border-border/50 bg-transparent text-muted-foreground hover:border-accent/50 hover:text-accent"
                }`}
            >
              CoolPeel
            </button>
            <button
              onClick={() => setActiveTab("dekapulse")}
              className={`px-8 py-4 text-lg font-semibold rounded-lg border-2 transition-all duration-300 ${activeTab === "dekapulse"
                ? "border-primary bg-primary/10 text-primary shadow-md"
                : "border-border/50 bg-transparent text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
            >
              Deka Pulse
            </button>
          </div>

          {/* Treatment Content */}
          <div className="max-w-6xl mx-auto">
            {activeTab === "coolpeel" && (
              <Card className="border-accent/40 animate-in fade-in duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-foreground mb-2">CoolPeel Treatment</h4>
                      <p className="text-accent font-semibold">Minimal Downtime • Gradual Results</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">Treatment Depth</h5>
                        <p className="text-muted-foreground">Superficial to moderate resurfacing</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">Best For</h5>
                        <p className="text-muted-foreground">Mild wrinkles, sun damage, uneven texture</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">Downtime</h5>
                        <p className="text-muted-foreground">Minimal - Redness for 1-3 days</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">Treatment Sessions</h5>
                        <p className="text-muted-foreground">Typically 3 sessions, spaced 1 month apart</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">Results Timeline</h5>
                        <p className="text-muted-foreground">Visible improvement in 1-2 weeks, continues improving over months</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">Ideal For</h5>
                        <p className="text-muted-foreground">Busy lifestyles, gradual improvement seekers</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                    <p className="text-sm text-foreground">
                      <strong>Perfect if:</strong> You want effective results without significant social downtime
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "dekapulse" && (
              <Card className="border-primary/40 animate-in fade-in duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-foreground mb-2">Deka Pulse Treatment</h4>
                      <p className="text-primary font-semibold">Deeper Treatment • Dramatic Results</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">Treatment Depth</h5>
                        <p className="text-muted-foreground">Deeper resurfacing for advanced skin concerns</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">Best For</h5>
                        <p className="text-muted-foreground">Deep wrinkles, scars, severe sun damage, significant aging issues</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">Downtime</h5>
                        <p className="text-muted-foreground">Moderate - Peeling & redness for 5-10 days</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">Treatment Sessions</h5>
                        <p className="text-muted-foreground">Usually sold as single treatment</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">Results Timeline</h5>
                        <p className="text-muted-foreground">Dramatic results, continues improving for 6+ months</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground mb-2">Ideal For</h5>
                        <p className="text-muted-foreground">Maximum results in one treatment</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-primary/10 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">
                      <strong>Perfect if:</strong> You're addressing more significant aging concerns and can accommodate recovery time
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoolPeel;