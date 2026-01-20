import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Zap, Shield, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import SEO from "@/components/SEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import MedicalProcedureSchema from "@/components/MedicalProcedureSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import CherryFinancingBadge from "@/components/CherryFinancingBadge";
import clarityImage from "@/assets/Homepage_Clarityiibox.jpg";
import { Helmet } from "react-helmet-async";

// Laser Hair Removal FAQ Schema
const LaserHairRemovalSchema = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How many laser hair removal sessions do I need?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most patients need 8-10 laser hair removal sessions spaced 6-8 weeks apart for optimal results. The exact number depends on your hair type, skin tone, and treatment area."
        }
      },
      {
        "@type": "Question",
        "name": "Is laser hair removal safe for all skin types?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, the Lutronic Clarity II laser we use at Virginia Laser Specialists is safe for all skin types and tones thanks to its dual-wavelength Alexandrite and Nd:YAG technology."
        }
      },
      {
        "@type": "Question",
        "name": "How much does laser hair removal cost in Tysons, VA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Laser hair removal pricing varies by treatment area. Single sessions range from $100 for small areas like chin or upper lip to $1,850 for full body. We offer 25% off package deals of 5 sessions. Visit our pricing page for details."
        }
      },
      {
        "@type": "Question",
        "name": "What should I do after laser hair removal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "After laser hair removal, apply cool compresses to reduce redness, wear loose clothing, avoid sun exposure for 24-48 hours, skip hot baths and saunas, and avoid fragranced products on the treated area. Seek medical advice if you experience severe redness, swelling, or blistering."
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};

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
  "Apply cool compresses to reduce redness and swelling for the first 24-48 hours as needed.",
  "Wear loose, breathable clothing over treated areas to avoid irritation.",
  "Avoid direct sun exposure to treated areas for 24-48 hours; when outdoors, cover or use SPF 30+ sunscreen.",
  "No hot baths, saunas, hot tubs, or swimming pools for 24-48 hours post-treatment.",
  "Avoid fragranced lotions, perfumed products, or harsh soaps on the treated area for 24-48 hours.",
  "Do not scrub, exfoliate, or wax the treated area for at least one week.",
  "Avoid tanning beds, spray tans, or self-tanners for one week after treatment.",
  "Seek medical advice if you experience severe redness, swelling, blistering, or signs of infection.",
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
        title="Laser Hair Removal Tysons & Northern Virginia | Lutronic Clarity II | Safe for All Skin Types"
        description="Best laser hair removal in Tysons, McLean, Vienna & Falls Church VA. Lutronic Clarity II dual-wavelength Alexandrite & Nd:YAG laser with cryogen cooling. Safe for all skin types. 25% off packages. Free consultation. Call 703-547-4499."
        canonicalUrl="/laser-hair-removal"
      />
      <LocalBusinessSchema />
      <LaserHairRemovalSchema />
      <MedicalProcedureSchema
        name="Laser Hair Removal in Tysons, VA"
        description="Permanent hair reduction using the dual-wavelength Lutronic Clarity II laser with Alexandrite and Nd:YAG technology. Safe for all skin types and tones with cryogen cooling for comfort."
        bodyLocation="Face, underarms, legs, arms, bikini area, back, chest, and full body"
        preparation="Shave treatment area 24 hours before. Avoid sun exposure, waxing, and tweezing for 4-6 weeks prior."
        followup="8-10 sessions spaced 6-8 weeks apart for optimal permanent hair reduction results"
        howPerformed="The Lutronic Clarity II laser delivers dual-wavelength energy (755nm Alexandrite and 1064nm Nd:YAG) with integrated cryogen cooling to target hair follicles while protecting surrounding skin."
        outcome="Long-lasting hair reduction with up to 90% permanent hair removal after completing full treatment series"
        url="/laser-hair-removal"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Laser Hair Removal", url: "/laser-hair-removal" }
      ]} />
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
          alt="Laser hair removal with Lutronic Clarity II dual-wavelength Alexandrite and Nd:YAG lasers with cryogen cooling for minimal downtime at Virginia Laser Specialists"
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
                Full body packages available. <Link to="/pricing" className="text-accent hover:underline">View all pricing</Link> | 
                Interested in skin rejuvenation? Try our <Link to="/laser-skin-resurfacing" className="text-accent hover:underline">CoolPeel laser resurfacing</Link> treatment.
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
              <CherryFinancingBadge className="mt-4" />
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

        {/* Pre & Post Treatment Care Guide with Tabs */}
        <section className="py-12 sm:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Laser Hair Removal Care Guide
                </h2>
                <p className="text-muted-foreground">
                  For your safety and the best results, please follow these instructions
                </p>
              </div>
              
              <Tabs defaultValue="pre-treatment" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
                  <TabsTrigger value="pre-treatment" className="text-sm sm:text-base font-semibold data-[state=active]:bg-accent data-[state=active]:text-primary">
                    Pre-Treatment
                  </TabsTrigger>
                  <TabsTrigger value="post-treatment" className="text-sm sm:text-base font-semibold data-[state=active]:bg-accent data-[state=active]:text-primary">
                    Post-Treatment
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="pre-treatment">
                  <Card className="border-accent/40">
                    <CardContent className="p-6 sm:p-8">
                      <h3 className="font-semibold text-lg text-foreground mb-4">Before Your Treatment:</h3>
                      <ul className="space-y-4">
                        {preTreatmentInstructions.map((instruction, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-accent font-bold mt-0.5">•</span>
                            <span className="text-muted-foreground leading-relaxed">{instruction}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="post-treatment">
                  <Card className="border-primary/40">
                    <CardContent className="p-6 sm:p-8">
                      <h3 className="font-semibold text-lg text-foreground mb-4">After Your Treatment:</h3>
                      <ul className="space-y-4">
                        {postTreatmentInstructions.map((instruction, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-primary font-bold mt-0.5">•</span>
                            <span className="text-muted-foreground leading-relaxed">{instruction}</span>
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

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Book your free consultation today and take the first step toward smooth, hair-free skin.
            </p>
            <CherryFinancingBadge className="mb-6 bg-primary-foreground/10 border-primary-foreground/20" />
            <div>
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
