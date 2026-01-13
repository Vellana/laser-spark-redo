import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sparkles, Clock, CheckCircle, Star, Calendar, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import coolPeelImage from "@/assets/Homepage_CoolPeelbox.jpg";
import tetraProLogo from "@/assets/tetra-pro-logo.png";

// CoolPeel-specific schema markup
const CoolPeelSchema = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://virginialaserspecialists.com/#business",
        "name": "Virginia Laser Specialists",
        "description": "Virginia Laser Specialists offers CoolPeel CO2 laser resurfacing treatments in Baltimore, Maryland. Expert skin rejuvenation with minimal downtime.",
        "url": "https://virginialaserspecialists.com",
        "telephone": "(571) 250-5505",
        "email": "info@virginialaserspecialists.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "8150 Leesburg Pike, Suite 1200",
          "addressLocality": "Tysons",
          "addressRegion": "VA",
          "postalCode": "22182",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 38.9187,
          "longitude": -77.2311
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "17:00"
          }
        ],
        "priceRange": "$$",
        "image": "https://virginialaserspecialists.com/favicon.png",
        "sameAs": [
          "https://www.instagram.com/virginialaserspecialists/"
        ]
      },
      {
        "@type": "MedicalProcedure",
        "@id": "https://virginialaserspecialists.com/services/coolpeel#procedure",
        "name": "CoolPeel CO2 Laser Resurfacing",
        "procedureType": "NoninvasiveProcedure",
        "description": "CoolPeel is a revolutionary CO2 laser treatment that delivers the benefits of traditional CO2 laser resurfacing with minimal downtime. Uses the Cartessa Tetra Pro laser platform for skin rejuvenation, fine line reduction, and texture improvement.",
        "bodyLocation": "Face, neck, chest, hands",
        "followup": "1-3 days recovery, typically 3 sessions recommended",
        "howPerformed": "The CoolPeel laser delivers high energy in ultra-short pulses, targeting only the superficial layer of skin without heating the surrounding tissue, resulting in minimal downtime while still achieving significant results.",
        "preparation": "Avoid sun exposure, discontinue retinoids 2-7 days prior, stay hydrated",
        "status": "Available",
        "provider": {
          "@type": "LocalBusiness",
          "@id": "https://virginialaserspecialists.com/#business"
        },
        "relevantSpecialty": {
          "@type": "MedicalSpecialty",
          "name": "Dermatology"
        },
        "outcome": "Improved skin texture, reduced fine lines and wrinkles, diminished sun damage, enhanced collagen production"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How long is the recovery after CoolPeel?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "CoolPeel recovery is typically 1-3 days. Most patients experience mild redness similar to a sunburn, which subsides quickly. You can usually return to normal activities within 24-48 hours."
            }
          },
          {
            "@type": "Question",
            "name": "Who is a good candidate for CoolPeel?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "CoolPeel is ideal for anyone looking to improve skin texture, reduce fine lines, minimize sun damage, or address uneven skin tone with minimal downtime. It works well on all skin types."
            }
          },
          {
            "@type": "Question",
            "name": "How many CoolPeel sessions are needed?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most patients see optimal results with 3 CoolPeel sessions spaced about 1 month apart. However, some patients notice improvements after just one treatment."
            }
          }
        ]
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

const benefits = [
  {
    icon: Clock,
    title: "Minimal Downtime",
    description: "Return to your normal routine within 1-3 days with only mild redness"
  },
  {
    icon: Sparkles,
    title: "Improves Tone & Texture",
    description: "Achieve smoother, more even skin with a healthy, youthful glow"
  },
  {
    icon: CheckCircle,
    title: "Reduces Fine Lines",
    description: "Diminish the appearance of fine lines and early signs of aging"
  },
  {
    icon: Star,
    title: "Sun Damage Repair",
    description: "Reverse years of sun damage and reduce age spots"
  },
  {
    icon: Shield,
    title: "Stimulates Collagen",
    description: "Promote natural collagen production for long-lasting results"
  },
  {
    icon: Calendar,
    title: "Quick Treatment",
    description: "Sessions typically last 15-30 minutes for full face treatment"
  }
];

const faqs = [
  {
    question: "How long is the recovery after CoolPeel?",
    answer: "CoolPeel recovery is typically 1-3 days. Most patients experience mild redness similar to a sunburn, which subsides quickly. You can usually return to normal activities within 24-48 hours, and many patients return to work the next day."
  },
  {
    question: "Who is a good candidate for CoolPeel treatment in Baltimore?",
    answer: "CoolPeel is ideal for anyone looking to improve skin texture, reduce fine lines, minimize sun damage, or address uneven skin tone with minimal downtime. It works well on all skin types and is perfect for busy professionals who can't afford extended recovery time."
  },
  {
    question: "How many CoolPeel sessions are needed for best results?",
    answer: "Most patients see optimal results with 3 CoolPeel sessions spaced about 1 month apart. However, some patients notice significant improvements after just one treatment. During your consultation, we'll create a personalized treatment plan based on your specific goals."
  },
  {
    question: "Is CoolPeel painful?",
    answer: "Most patients describe CoolPeel as very tolerable. We apply a topical numbing cream before treatment to ensure your comfort. During the procedure, you may feel a warm sensation, but it's generally well-tolerated without significant discomfort."
  },
  {
    question: "What's the difference between CoolPeel and traditional CO2 laser?",
    answer: "Traditional CO2 lasers deliver heat deep into the skin, requiring 1-2 weeks of recovery. CoolPeel uses advanced technology to deliver high energy in ultra-short pulses, treating only the superficial skin layer without heating surrounding tissue. This means you get CO2 laser benefits with minimal downtime."
  },
  {
    question: "How much does CoolPeel cost in Baltimore?",
    answer: "CoolPeel pricing varies based on the treatment area. We offer competitive pricing and package deals for multiple sessions. Please visit our pricing page or schedule a free consultation to discuss your specific needs and get an accurate quote."
  },
  {
    question: "When will I see results from CoolPeel?",
    answer: "You'll notice initial improvements within 1-2 weeks as your skin heals and begins producing new collagen. Results continue to improve over the following 2-3 months as collagen remodeling occurs. Many patients report their skin looks best 3-6 months after their final treatment."
  }
];

const CoolPeel = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title="CoolPeel CO₂ Laser Resurfacing in Baltimore | Virginia Laser Specialists"
        description="Transform your skin with CoolPeel CO2 laser resurfacing in Baltimore. Minimal downtime, reduce fine lines, improve skin texture with advanced Cartessa Tetra Pro technology. Schedule your CoolPeel consultation today!"
        canonicalUrl="/services/coolpeel"
      />
      <CoolPeelSchema />
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 to-background overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <span className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
                  Advanced CO₂ Technology
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                  CoolPeel CO₂ Laser Resurfacing in Baltimore
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Experience the next generation of skin rejuvenation. CoolPeel delivers the powerful 
                  benefits of CO₂ laser treatment with minimal downtime—perfect for today's busy lifestyle.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a href="https://www.vagaro.com/virginialaserspecialists/services" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-primary font-semibold px-8">
                      Schedule Your Consultation
                    </Button>
                  </a>
                  <Link to="/pricing">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 font-semibold px-8">
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto lg:mx-0">
                <img 
                  src={coolPeelImage}
                  alt="CoolPeel CO2 laser resurfacing treatment results at Virginia Laser Specialists in Baltimore"
                  className="rounded-2xl shadow-medium w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* What is CoolPeel Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <img 
                  src={tetraProLogo}
                  alt="Cartessa Tetra Pro CO2 laser platform for CoolPeel treatments"
                  className="h-16 mx-auto mb-6"
                />
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  What is CoolPeel Treatment in Baltimore?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  CoolPeel is a revolutionary CO₂ laser treatment that uses the Cartessa Tetra Pro platform 
                  to deliver high-energy pulses in ultra-short bursts. This advanced technology treats only 
                  the superficial skin layer without heating the surrounding tissue, resulting in dramatic 
                  improvements with minimal recovery time.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-accent/40">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">How CoolPeel Works</h3>
                    <p className="text-muted-foreground mb-4">
                      Unlike traditional CO₂ lasers that deliver continuous heat deep into the skin, 
                      CoolPeel uses a unique approach:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Ultra-short energy pulses target the skin surface</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Controlled ablation removes damaged skin layers</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Minimal heat transfer to surrounding tissue</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Stimulates natural collagen production</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-accent/40">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">Ideal Candidates</h3>
                    <p className="text-muted-foreground mb-4">
                      CoolPeel treatment in Baltimore is perfect for individuals who want to address:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Fine lines and early wrinkles</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Sun damage and age spots</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Uneven skin texture and tone</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Large pores and dull skin</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">Mild acne scarring</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Benefits of CoolPeel Laser Resurfacing
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover why CoolPeel is the preferred choice for skin rejuvenation near Baltimore
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-border hover:border-accent/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What to Expect Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">
                What to Expect During Your CoolPeel Treatment
              </h2>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Consultation</h3>
                    <p className="text-muted-foreground">
                      Your journey begins with a free consultation where we assess your skin concerns, 
                      discuss your goals, and create a personalized treatment plan. We'll explain the 
                      procedure in detail and answer all your questions.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Preparation</h3>
                    <p className="text-muted-foreground">
                      On treatment day, we cleanse your skin and apply a topical numbing cream for 
                      20-30 minutes. This ensures your comfort throughout the procedure. We'll also 
                      take pre-treatment photos to track your progress.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Treatment</h3>
                    <p className="text-muted-foreground">
                      The CoolPeel treatment typically takes 15-30 minutes for a full face. You may 
                      feel a warm sensation as the laser works, but most patients find it very 
                      comfortable with the numbing cream in place.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-lg">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Recovery</h3>
                    <p className="text-muted-foreground">
                      After treatment, your skin will appear red, similar to a mild sunburn. This 
                      typically resolves within 1-3 days. We provide detailed aftercare instructions 
                      and skincare products to optimize your healing and results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Before/After Gallery Placeholder */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                CoolPeel Before & After Results
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See the transformative results our Baltimore-area patients have achieved with CoolPeel
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] bg-secondary/50 flex items-center justify-center">
                      <div className="text-center p-6">
                        <Sparkles className="w-12 h-12 text-accent mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">
                          Before & After {item}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Results may vary
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/gallery">
                <Button variant="outline" className="font-semibold">
                  View Full Gallery
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Aftercare Summary */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-8">
                CoolPeel Aftercare Summary
              </h2>
              
              <Card className="border-accent/40">
                <CardContent className="p-6 sm:p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-accent" />
                        Do's
                      </h3>
                      <ul className="space-y-3">
                        <li className="text-muted-foreground flex items-start gap-2">
                          <span className="text-accent">•</span>
                          Use gentle, hydrating cleanser twice daily
                        </li>
                        <li className="text-muted-foreground flex items-start gap-2">
                          <span className="text-accent">•</span>
                          Apply recommended moisturizer frequently
                        </li>
                        <li className="text-muted-foreground flex items-start gap-2">
                          <span className="text-accent">•</span>
                          Use SPF 30+ sunscreen after 24 hours
                        </li>
                        <li className="text-muted-foreground flex items-start gap-2">
                          <span className="text-accent">•</span>
                          Stay hydrated and get plenty of rest
                        </li>
                        <li className="text-muted-foreground flex items-start gap-2">
                          <span className="text-accent">•</span>
                          Sleep with head elevated if possible
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Don'ts
                      </h3>
                      <ul className="space-y-3">
                        <li className="text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Don't pick or peel flaking skin
                        </li>
                        <li className="text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Avoid direct sun exposure for 2+ weeks
                        </li>
                        <li className="text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          No exfoliating products for 5-7 days
                        </li>
                        <li className="text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Skip strenuous exercise for 48 hours
                        </li>
                        <li className="text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Avoid makeup for 2-5 days post-treatment
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-8">
                Frequently Asked Questions About CoolPeel
              </h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border border-border rounded-lg px-6 data-[state=open]:border-accent/40"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:text-accent">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Skin?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Schedule your free CoolPeel consultation today and discover how our 
              advanced CO₂ laser technology can rejuvenate your skin with minimal downtime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://www.vagaro.com/virginialaserspecialists/services" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8">
                  Book Your Free Consultation
                </Button>
              </a>
              <a href="tel:+15712505505">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8">
                  Call (571) 250-5505
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

export default CoolPeel;
