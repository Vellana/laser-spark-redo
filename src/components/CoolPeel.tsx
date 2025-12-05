import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Zap, Heart, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import tetraProLogo from "@/assets/tetra-pro-logo.png";

const CoolPeel = () => {
  const [activeTab, setActiveTab] = useState<"coolpeel" | "dekapulse">("coolpeel");
  const [expandedBenefit, setExpandedBenefit] = useState<string | null>(null);

  const benefits = [
    {
      icon: Sparkles,
      title: "Revolutionary Technology",
      description: "Advanced CO2 laser resurfaces skin with customizable intensity",
      details: "The Tetra Pro CO2 platform resurfacing technology allows customizable intensity and offers two modes—CoolPeel for minimal downtime and Deka Pulse for deeper resurfacing—to stimulate collagen production and rejuvenate skin.",
    },
    {
      icon: Zap,
      title: "Quick Treatment",
      description: "Sessions typically take 30 minutes or less",
      details: "Most resurfacing sessions take about 30 minutes or less, providing convenience for busy schedules.",
    },
    {
      icon: Heart,
      title: "Safe & Effective",
      description: "Suitable for all skin types with proven results",
      details: "The Tetra laser has proven safety for all skin types and produces lasting results by stimulating collagen and improving skin texture.",
    },
    {
      icon: Clock,
      title: "Flexible Recovery",
      description: "Choose your downtime: minimal (CoolPeel) or moderate (Deka Pulse)",
      details: "Patients can choose between minimal downtime (CoolPeel) and moderate downtime (Deka Pulse) depending on the desired results and lifestyle.",
    },
  ];

  const preTreatmentInstructions = [
    "Avoid sun exposure and tanning beds for at least 2 weeks before treatment.",
    "Discontinue retinoids, glycolic acids, and other exfoliating products 5-7 days prior.",
    "Arrive with clean, makeup-free skin.",
    "Inform your provider of any medications, supplements, or recent skin treatments.",
    "Avoid aspirin, ibuprofen, and blood-thinning supplements for 1 week before treatment.",
    "Stay well-hydrated in the days leading up to your appointment.",
  ];

  const coolPeelPostInstructions = [
    "Keep a thin layer of Aquaphor or approved ointment on the treated area for up to three days to keep skin moist.",
    "Avoid makeup and sunscreen for the first 48 hours.",
    "Sleep with a clean pillowcase and keep your head elevated for the first night.",
    "Avoid applying active skincare ingredients (retinol, exfoliants) for one week.",
    "Avoid direct sunlight for 48 hours; then apply broad-spectrum SPF 50 daily.",
    "Resume retinol products after seven days once skin has fully healed.",
    "Avoid strenuous exercise, hot tubs, steam rooms, or saunas for at least 24 hours.",
    "Use clean face masks for the first 72 hours and watch for signs of infection, such as increased redness, swelling, or fever, and contact your provider if they occur.",
  ];

  const dekaPostInstructions = [
    "Apply cold compresses and keep the treated area moisturized with a gentle, fragrance-free moisturizer.",
    "Cleanse the skin gently with a mild cleanser; avoid scrubbing or exfoliating.",
    "Avoid sun exposure, heat, hot showers, and workouts for at least 24 hours; for deeper resurfacing, avoid these activities for 7–10 days.",
    "Do not pick at peeling or flaking skin; allow it to shed naturally.",
    "Avoid swimming pools, hot tubs, and saunas until the skin has fully healed.",
    "Wait 7-10 days before resuming makeup or active skincare products.",
    "Contact your provider if you experience signs of infection or unusual discomfort.",
  ];

  const toggleBenefit = (title: string) => {
    setExpandedBenefit(expandedBenefit === title ? null : title);
  };

  return (
    <section id="cool-peel" className="py-20 bg-gradient-to-br from-accent/5 to-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Content Side */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
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
                <div key={benefit.title} className="space-y-2">
                  <button
                    onClick={() => toggleBenefit(benefit.title)}
                    className="flex gap-3 w-full text-left group"
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${expandedBenefit === benefit.title ? "bg-accent text-primary" : "bg-accent/20 text-accent group-hover:bg-accent/30"}`}>
                        <benefit.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </button>
                  {expandedBenefit === benefit.title && (
                    <div className="ml-13 pl-[52px] animate-in fade-in slide-in-from-top-2 duration-200">
                      <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg border border-border">
                        {benefit.details}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center lg:justify-start items-center">
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
            <div className="relative rounded-2xl overflow-hidden shadow-medium bg-white/95 p-12 flex items-center justify-center">
              <img
                src={tetraProLogo}
                alt="Cartessa Tetra Pro CO2 laser system for CoolPeel and DEKA Pulse skin resurfacing treatments"
                className="w-full max-w-md h-auto object-contain"
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

        {/* Care Instructions Tabs - Dynamic based on selected treatment */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            {activeTab === "coolpeel" ? "CoolPeel" : "Deka Pulse"} Care Instructions
          </h3>

          <Tabs defaultValue="pre-treatment" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="pre-treatment" className="text-base py-3">
                Pre-Treatment
              </TabsTrigger>
              <TabsTrigger value="post-treatment" className="text-base py-3">
                Post-Treatment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pre-treatment" className="animate-in fade-in duration-300">
              <Card className={activeTab === "coolpeel" ? "border-accent/40" : "border-primary/40"}>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeTab === "coolpeel" ? "bg-accent/20" : "bg-primary/20"}`}>
                      <Clock className={`w-5 h-5 ${activeTab === "coolpeel" ? "text-accent" : "text-primary"}`} />
                    </div>
                    <h4 className="text-xl font-bold text-foreground">Pre-Treatment Instructions</h4>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    {preTreatmentInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className={`mt-0.5 ${activeTab === "coolpeel" ? "text-accent" : "text-primary"}`}>•</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="post-treatment" className="animate-in fade-in duration-300">
              <Card className={activeTab === "coolpeel" ? "border-accent/40" : "border-primary/40"}>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeTab === "coolpeel" ? "bg-accent/20" : "bg-primary/20"}`}>
                      {activeTab === "coolpeel" ? (
                        <Heart className="w-5 h-5 text-accent" />
                      ) : (
                        <TrendingUp className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <h4 className="text-xl font-bold text-foreground">
                      {activeTab === "coolpeel" ? "CoolPeel" : "Deka Pulse"} Post-Treatment Care
                    </h4>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    {(activeTab === "coolpeel" ? coolPeelPostInstructions : dekaPostInstructions).map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className={`mt-0.5 ${activeTab === "coolpeel" ? "text-accent" : "text-primary"}`}>•</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default CoolPeel;
