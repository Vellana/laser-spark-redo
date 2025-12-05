import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, Zap, Shield, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEO from "@/components/SEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import clarityImage from "@/assets/Homepage_Clarityiibox.jpg";

interface TreatmentArea {
  name: string;
  summary: string;
  description: string;
  pricing: string;
  treatments: string;
}

const treatmentAreas: TreatmentArea[] = [
  {
    name: "Brazilian / Brozilian",
    summary: "Includes entire bikini area front, sides and back (labia and butt strip) – 8‑10 treatments recommended.",
    description: "Removes all or most pubic hair from front, sides and back, including the labia and area between the buttocks; Brozilian includes scrotum, perineum and around anus.",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Single $300; Package of 5 $1,125 (25% off)"
  },
  {
    name: "Underarms",
    summary: "Both underarms – 8‑10 treatments recommended.",
    description: "Includes both underarms for smooth, lasting results.",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Single $150; Package of 5 $562.50 (25% off)"
  },
  {
    name: "Legs (Half/Full)",
    summary: "Both legs, front and back (half or full) – 8‑10 treatments recommended.",
    description: "Includes both legs, front and back (half or full leg options available).",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Half-leg single $350; Package of 5 $1,312.50. Full-leg single $500; Package of 5 $1,875 (25% off)"
  },
  {
    name: "Back (Half/Full)",
    summary: "Half or full back – 8‑10 treatments recommended.",
    description: "Includes upper or lower back; full back covers the entire back area.",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Half-back single $250; Package of 5 $937.50. Full-back single $400; Package of 5 $1,500 (25% off)"
  },
  {
    name: "Chin",
    summary: "Front and under the chin – 8‑10 treatments recommended.",
    description: "Includes front and under chin (not the neck).",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Single $100; Package of 5 $375 (25% off)"
  },
  {
    name: "Face",
    summary: "Upper lip, chin, cheeks, sideburns, forehead and hairline – 8‑10 treatments recommended.",
    description: "Includes upper lip, chin, cheeks, sideburns, forehead and hairline.",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Single $250; Package of 5 $937.50 (25% off)"
  },
  {
    name: "Arms (Half/Full)",
    summary: "Both arms, front and back (half or full) – 8‑10 treatments recommended.",
    description: "Includes both arms front and back (half or full arm options available).",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Half-arms single $300; Package of 5 $1,125. Full-arms single $400; Package of 5 $1,500 (25% off)"
  },
  {
    name: "Chest",
    summary: "Upper torso (excludes shoulders and abdomen) – 8‑10 treatments recommended.",
    description: "Includes upper torso (doesn't include shoulders or abdomen).",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Single $250; Package of 5 $937.50"
  },
  {
    name: "Abdomen",
    summary: "Lower torso – 8‑10 treatments recommended.",
    description: "Includes lower torso (doesn't include chest).",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Single $250; Package of 5 $937.50"
  },
  {
    name: "Bikini Line",
    summary: "Hair removal along the top and sides of the bikini line – 8‑10 treatments recommended.",
    description: "Removes hair along and outside the top and sides of the bikini line.",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Single $250; Package of 5 $937.50"
  },
  {
    name: "Neck (Front or Back)",
    summary: "Front or back of the neck – 8‑10 treatments recommended.",
    description: "Front or back of neck (nape) but not chin.",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Single $100; Package of 5 $375"
  },
  {
    name: "Sideburns",
    summary: "Area in front of the ears, extending down toward the jawline – 8‑10 treatments recommended.",
    description: "Removes hair in front of the ears, extending down toward the jawline.",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Single $100; Package of 5 $375"
  },
  {
    name: "Upper Lip",
    summary: "Upper lip and corners of the mouth – 8‑10 treatments recommended.",
    description: "Removes hair from the upper lip and corners of mouth.",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Single $100; Package of 5 $375"
  },
  {
    name: "Shoulders",
    summary: "Base of the neck to top of the upper arms and back – 8‑10 treatments recommended.",
    description: "Removes hair from base of neck to top of upper arms and back.",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Single $100; Package of 5 $375"
  },
  {
    name: "Hands",
    summary: "Wrist to the tops of the fingers – 8‑10 treatments recommended.",
    description: "Removes hair from wrist to top of fingers.",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Single $100; Package of 5 $375"
  },
  {
    name: "Feet",
    summary: "Ankle to the tip of the toes – 8‑10 treatments recommended.",
    description: "Removes hair from ankle to toes.",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Single $100; Package of 5 $375"
  },
  {
    name: "Breasts",
    summary: "Breast area, including the areolas – 8‑10 treatments recommended.",
    description: "Removes hair on breasts including areolas.",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Single $100; Package of 5 $375"
  },
  {
    name: "Full Body",
    summary: "All desired areas from head to toe – 8‑10 treatments recommended.",
    description: "Removes hair from all desired areas (arms, legs, underarms, back, face, hands, feet).",
    treatments: "8–10 treatments every 6–8 weeks",
    pricing: "Single $1,850; Package of 5 $6,937.50"
  }
];

const preTreatmentInstructions = [
  "Avoid sun exposure to the treated area by covering or using sunscreen for a minimum of 2-4 weeks prior and post treatment.",
  "Avoid using spray tans or self-tanner for a minimum of 2 weeks prior to treatment.",
  "Please ensure the treatment area is hair-free before your appointment by shaving with a traditional razor (recommended within 24 hours of appointment).",
  "Avoid tweezing, sugaring, waxing, or electrolysis for 4-6 weeks prior to treatment. Shaving is fine 48 hours after treatment.",
  "The treatment area should be clean-shaven and thoroughly cleansed, removing any makeup, creams, oils, topical anesthetics, or bronzing products before treatment. Avoid skin care products with irritants such as Glycolic Acid or Retin-A on the treatment area for about 1-2 weeks before treatment.",
  "Please call before your appointment if you are taking a new medication that may cause photosensitivity, especially acne medication."
];

const postTreatmentInstructions = [
  "Avoid sun exposure to the treated area by covering or using sunscreen for a minimum of 2-4 weeks prior and post treatment.",
  "Avoid excessive heat, including hot water, saunas, hot tubs, for 48 hours post-treatment.",
  "Do not exercise rigorously for 24 hours post-treatment.",
  "Do not apply topical beauty products, including deodorant for 24 hours post-treatment.",
  "Questions, concerns or appointment scheduling: 703-547-4499"
];

const LaserHairRemoval = () => {
  const [selectedArea, setSelectedArea] = useState<TreatmentArea | null>(null);

  const benefits = [
    {
      icon: Shield,
      title: "Safe for All Skin Types",
      description: "Dual wavelength technology ensures effective treatment across all skin tones"
    },
    {
      icon: Zap,
      title: "Permanent Hair Reduction",
      description: "FDA-cleared technology for long-lasting smooth skin results"
    },
    {
      icon: Users,
      title: "Expert Technicians",
      description: "12+ years combined experience with advanced laser systems"
    },
    {
      icon: Clock,
      title: "Quick Sessions",
      description: "Most areas treated in 15-30 minutes with minimal discomfort"
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="Laser Hair Removal in Fairfax, VA | Virginia Laser Specialists"
        description="Permanent hair reduction using dual-wavelength Lutronic Clarity II laser. Safe for all skin types, experienced technicians, free consultation. Tysons/Fairfax area."
        canonicalUrl="/laser-hair-removal"
      />
      <LocalBusinessSchema />
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 bg-gradient-to-br from-primary/10 to-background overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <span className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
                  Gold Standard Technology
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground">
                  Laser Hair Removal
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Experience permanent hair reduction with the Lutronic Clarity II laser—the gold standard 
                  in laser hair removal. Our dual wavelength system is safe for all skin types and tones, 
                  delivering exceptional results with minimal discomfort.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a href="https://www.vagaro.com/virginialaserspecialists/services" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-primary font-semibold px-8">
                      Book Free Consultation
                    </Button>
                  </a>
                  <Link to="/pricing">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 font-semibold px-8">
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto lg:mx-0 max-w-md lg:max-w-none">
                <img 
                  src={clarityImage}
                  alt="Patient receiving laser hair removal treatment with Lutronic Clarity II at Virginia Laser Specialists"
                  className="rounded-2xl shadow-medium w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-12 sm:py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                The Lutronic Clarity II Difference
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                The Lutronic Clarity II laser is the gold standard for laser hair removal. Its dual wavelength 
                system means that it is safe for use on all skin types and tones. It is also exceptionally 
                capable of treating a variety of skin issues, from hyperpigmentation to spider veins to 
                angiomas and broken capillaries.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-12 sm:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-8 sm:mb-12">
              Why Choose Us for Laser Hair Removal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="text-center">
                  <CardContent className="pt-6 space-y-4">
                    <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                      <benefit.icon className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Treatment Areas */}
        <section className="py-12 sm:py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  Treatment Areas
                </h2>
                <p className="text-muted-foreground">Click on any area to see details and pricing</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {treatmentAreas.map((area) => (
                  <button
                    key={area.name}
                    onClick={() => setSelectedArea(area)}
                    className="flex flex-col items-start bg-background p-4 sm:p-5 rounded-lg hover:shadow-medium hover:border-accent/50 border border-border transition-all duration-300 hover:-translate-y-1 cursor-pointer text-left group h-full"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm sm:text-base text-foreground font-semibold">{area.name}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {area.summary}
                    </p>
                  </button>
                ))}
              </div>
              <p className="text-center text-muted-foreground mt-6">
                Full body packages available. <Link to="/pricing" className="text-accent hover:underline">View all pricing</Link>
              </p>
            </div>
          </div>
        </section>

        {/* Treatment Area Dialog */}
        <Dialog open={!!selectedArea} onOpenChange={() => setSelectedArea(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                {selectedArea?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                {selectedArea?.description}
              </DialogDescription>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Recommended Schedule</p>
                    <p className="text-sm text-muted-foreground">{selectedArea?.treatments}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Pricing</p>
                    <p className="text-sm text-muted-foreground">{selectedArea?.pricing}</p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <a href="https://www.vagaro.com/virginialaserspecialists/services" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold">
                    Book This Treatment
                  </Button>
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Pre & Post Treatment Guide */}
        <section className="py-12 sm:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-8 sm:mb-12">
                Laser Hair Removal Care Guide
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                For your safety and the best results, please follow these instructions:
              </p>
              
              <Tabs defaultValue="pre" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="pre" className="text-sm sm:text-base">Pre-Treatment</TabsTrigger>
                  <TabsTrigger value="post" className="text-sm sm:text-base">Post-Treatment</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pre">
                  <Card className="border-border">
                    <CardContent className="p-6 sm:p-8">
                      <h3 className="font-semibold text-foreground mb-4">Before Your Treatment:</h3>
                      <ul className="space-y-4">
                        {preTreatmentInstructions.map((instruction, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{instruction}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="post">
                  <Card className="border-border">
                    <CardContent className="p-6 sm:p-8">
                      <h3 className="font-semibold text-foreground mb-4">After Your Treatment:</h3>
                      <ul className="space-y-4">
                        {postTreatmentInstructions.map((instruction, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{instruction}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-center text-muted-foreground mt-6">
                        Questions, concerns or appointment scheduling: <a href="tel:703-547-4499" className="text-accent hover:underline">703-547-4499</a>
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-primary/10 to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Ready for Smooth, Hair-Free Skin?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Schedule your free consultation to discuss your goals and create a personalized treatment plan.
              </p>
              <a href="https://www.vagaro.com/virginialaserspecialists/services" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8">
                  Book Free Consultation
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LaserHairRemoval;
