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
import { Sparkles, Clock, CheckCircle, Star, Calendar, Shield, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Helmet } from "react-helmet-async";
import coolPeelImage from "@/assets/Homepage_CoolPeelbox.jpg";
import tetraProLogo from "@/assets/tetra-pro-logo.png";

// CoolPeel Tysons/Vienna local SEO schema markup
const CoolPeelTysonsSchema = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://virginialaserspecialists.com/#business",
        "name": "Virginia Laser Specialists",
        "description": "Virginia Laser Specialists offers CoolPeel CO2 laser resurfacing treatments in Tysons and Vienna, VA. Expert skin rejuvenation with minimal downtime using advanced Cartessa Tetra Pro technology.",
        "url": "https://virginialaserspecialists.com",
        "telephone": "703-547-4499",
        "email": "info@virginialaserspecialists.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "8230 Boone Blvd, Suite 320",
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
        "areaServed": [
          "Tysons, VA",
          "Vienna, VA",
          "Fairfax, VA",
          "McLean, VA",
          "Falls Church, VA",
          "Arlington, VA",
          "Reston, VA"
        ],
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "17:00"
          }
        ],
        "priceRange": "$$",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "156"
        },
        "image": "https://virginialaserspecialists.com/favicon.png",
        "sameAs": [
          "https://www.instagram.com/virginialaserspecialists/"
        ]
      },
      {
        "@type": "MedicalProcedure",
        "@id": "https://virginialaserspecialists.com/coolpeel-co2-laser-tysons-va#procedure",
        "name": "CoolPeel CO2 Laser Resurfacing in Tysons, VA",
        "procedureType": "NoninvasiveProcedure",
        "description": "CoolPeel is a revolutionary CO2 laser treatment available in Tysons and Vienna, VA that delivers the benefits of traditional CO2 laser resurfacing with minimal downtime. Uses the Cartessa Tetra Pro laser platform for skin rejuvenation, fine line reduction, and texture improvement.",
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
            "name": "Where can I get CoolPeel near me in Tysons or Vienna, VA?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Virginia Laser Specialists offers CoolPeel CO2 laser resurfacing at 8230 Boone Blvd, Suite 320, Tysons, VA 22182. We serve Tysons, Vienna, McLean, Fairfax, Falls Church, and the greater Northern Virginia area. Call 703-547-4499 to schedule your free consultation."
            }
          },
          {
            "@type": "Question",
            "name": "How long is the recovery after CoolPeel treatment?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "CoolPeel recovery is typically 1-3 days. Most patients experience mild redness similar to a sunburn, which subsides quickly. You can usually return to normal activities within 24-48 hours."
            }
          },
          {
            "@type": "Question",
            "name": "Who is a good candidate for CoolPeel in Tysons, VA?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "CoolPeel is ideal for anyone looking to improve skin texture, reduce fine lines, minimize sun damage, or address uneven skin tone with minimal downtime. It works well on all skin types and is perfect for busy professionals in the Tysons/Vienna area."
            }
          },
          {
            "@type": "Question",
            "name": "How many CoolPeel sessions are needed?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most patients see optimal results with 3 CoolPeel sessions spaced about 1 month apart. However, some patients notice improvements after just one treatment."
            }
          },
          {
            "@type": "Question",
            "name": "What is the cost of CoolPeel in Tysons, VA?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "CoolPeel pricing varies based on treatment area. Virginia Laser Specialists offers competitive pricing and package deals. Visit our pricing page or schedule a free consultation for an accurate quote."
            }
          },
          {
            "@type": "Question",
            "name": "What's the difference between CoolPeel and traditional CO2 laser resurfacing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Traditional CO2 lasers deliver heat deep into the skin, requiring 1-2 weeks of recovery. CoolPeel uses advanced technology to deliver high energy in ultra-short pulses, treating only the superficial skin layer without heating surrounding tissue. This means you get CO2 laser benefits with minimal downtime."
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
    question: "Where can I get CoolPeel near me in Tysons or Vienna, VA?",
    answer: "Virginia Laser Specialists offers CoolPeel CO2 laser resurfacing at 8230 Boone Blvd, Suite 320, Tysons, VA 22182. We serve Tysons, Vienna, McLean, Fairfax, Falls Church, Arlington, Reston, and the greater Northern Virginia area. Call 703-547-4499 to schedule your free consultation."
  },
  {
    question: "How long is the recovery after CoolPeel treatment?",
    answer: "CoolPeel recovery is typically 1-3 days. Most patients experience mild redness similar to a sunburn, which subsides quickly. You can usually return to normal activities within 24-48 hours, and many patients return to work the next day."
  },
  {
    question: "Who is a good candidate for CoolPeel in Tysons, VA?",
    answer: "CoolPeel is ideal for anyone looking to improve skin texture, reduce fine lines, minimize sun damage, or address uneven skin tone with minimal downtime. It works well on all skin types and is perfect for busy professionals in the Tysons and Vienna area who can't afford extended recovery time."
  },
  {
    question: "How many CoolPeel sessions are needed for best results?",
    answer: "Most patients see optimal results with 3 CoolPeel sessions spaced about 1 month apart. However, some patients notice significant improvements after just one treatment. During your consultation at our Tysons office, we'll create a personalized treatment plan based on your specific goals."
  },
  {
    question: "Is CoolPeel painful?",
    answer: "Most patients describe CoolPeel as very tolerable. We apply a topical numbing cream before treatment to ensure your comfort. During the procedure, you may feel a warm sensation, but it's generally well-tolerated without significant discomfort."
  },
  {
    question: "What's the difference between CoolPeel and traditional CO2 laser resurfacing?",
    answer: "Traditional CO2 lasers deliver heat deep into the skin, requiring 1-2 weeks of recovery. CoolPeel uses advanced technology to deliver high energy in ultra-short pulses, treating only the superficial skin layer without heating surrounding tissue. This means you get CO2 laser benefits with minimal downtime."
  },
  {
    question: "How much does CoolPeel cost in Tysons, VA?",
    answer: "CoolPeel pricing at Virginia Laser Specialists varies based on the treatment area. We offer competitive pricing and package deals for multiple sessions. Please visit our pricing page or schedule a free consultation to discuss your specific needs and get an accurate quote."
  },
  {
    question: "When will I see results from CoolPeel?",
    answer: "You'll notice initial improvements within 1-2 weeks as your skin heals and begins producing new collagen. Results continue to improve over the following 2-3 months as collagen remodeling occurs. Many patients report their skin looks best 3-6 months after their final treatment."
  }
];

const CoolPeelTysons = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title="CoolPeel CO₂ Laser Resurfacing in Tysons & Vienna, VA | Virginia Laser Specialists"
        description="Get CoolPeel CO2 laser resurfacing near you in Tysons & Vienna, VA. Minimal downtime, advanced Cartessa Tetra Pro technology. Reduce fine lines, improve skin texture. Schedule your CoolPeel consultation today!"
        canonicalUrl="/coolpeel-co2-laser-tysons-va"
      />
      <CoolPeelTysonsSchema />
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 to-background overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <span className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
                  CoolPeel Near Me • Tysons & Vienna, VA
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                  CoolPeel CO₂ Laser Resurfacing in Tysons, VA
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Experience the next generation of skin rejuvenation at Virginia Laser Specialists. 
                  CoolPeel delivers powerful CO₂ laser benefits with minimal downtime—perfect for 
                  busy professionals in Tysons, Vienna, and Northern Virginia.
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
                  alt="CoolPeel CO2 laser resurfacing treatment results at Virginia Laser Specialists in Tysons, VA"
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
                  alt="Cartessa Tetra Pro CO2 laser platform for CoolPeel treatments in Tysons VA"
                  className="h-16 mx-auto mb-6"
                />
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  What is CoolPeel CO₂ Laser Resurfacing?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  CoolPeel is a revolutionary CO₂ laser treatment that uses the Cartessa Tetra Pro platform 
                  to deliver high-energy pulses in ultra-short bursts. This advanced technology treats only 
                  the superficial skin layer without heating the surrounding tissue, resulting in dramatic 
                  improvements with minimal recovery time. Available now at our Tysons, VA location.
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
                    <h3 className="text-xl font-bold text-foreground mb-4">Ideal Candidates in Tysons & Vienna</h3>
                    <p className="text-muted-foreground mb-4">
                      CoolPeel treatment is perfect for Northern Virginia residents who want to address:
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
                Benefits of CoolPeel CO₂ Laser Resurfacing
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover why CoolPeel is the preferred choice for skin rejuvenation in Tysons, Vienna, and Northern Virginia
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
                What to Expect at Your CoolPeel Appointment
              </h2>
              
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Free Consultation</h3>
                    <p className="text-muted-foreground">
                      Your journey begins with a free consultation at our Tysons office where we assess your skin concerns, 
                      discuss your goals, and create a personalized CoolPeel treatment plan. We'll explain the 
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
                      20-30 minutes. This ensures your comfort throughout the CoolPeel procedure. We'll also 
                      take pre-treatment photos to track your progress.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">CoolPeel Treatment</h3>
                    <p className="text-muted-foreground">
                      The CoolPeel CO₂ laser treatment typically takes 15-30 minutes for a full face. You may 
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
                    <h3 className="text-xl font-bold text-foreground mb-2">Minimal Recovery</h3>
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

        {/* Before/After Gallery */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                CoolPeel Before & After Results
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See the transformative results our Tysons and Vienna patients have achieved with CoolPeel
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
                CoolPeel Post-Treatment Instructions
              </h2>
              
              <Card className="border-accent/40">
                <CardContent className="p-6 sm:p-8">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Apply a thin layer of Aquaphor to the treated area and reapply as needed for the first 48-72 hours.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Avoid makeup and sunscreen for 48 hours post-treatment.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Keep your head elevated while sleeping; use a clean pillowcase and change it frequently.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Do not apply active skin-care products (AHAs, BHAs, retinols, vitamin C serums) for one week.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Avoid strenuous exercise for 24 hours post-treatment.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Stay out of hot tubs, saunas, and swimming pools for at least one week.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground font-medium">Watch for signs of infection (increasing redness, swelling, warmth, fever, or discharge). Contact your provider immediately if any occur.</span>
                    </li>
                  </ul>
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
                Frequently Asked Questions About CoolPeel in Tysons, VA
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

        {/* Location Map Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Visit Us for CoolPeel in Tysons, VA
                </h2>
                <p className="text-lg text-muted-foreground">
                  Conveniently located in Tysons, serving Vienna, McLean, Fairfax, Falls Church, and Northern Virginia
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <Card className="border-accent/40">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">Our Location</h3>
                        <p className="text-muted-foreground">
                          8230 Boone Blvd, Suite 320<br />
                          Tysons, VA 22182
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">Contact Us</h3>
                        <p className="text-muted-foreground">
                          <a href="tel:703-547-4499" className="hover:text-accent transition-colors">
                            (703) 547-4499
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">Hours</h3>
                        <p className="text-muted-foreground">
                          Monday - Friday: 9:00 AM - 5:00 PM<br />
                          Saturday & Sunday: Closed
                        </p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h3 className="font-bold text-foreground mb-3">Areas We Serve</h3>
                      <div className="flex flex-wrap gap-2">
                        {["Tysons", "Vienna", "McLean", "Fairfax", "Falls Church", "Arlington", "Reston"].map((area) => (
                          <span key={area} className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Embedded Google Map */}
                <div className="h-[400px] rounded-xl overflow-hidden shadow-medium">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3106.5835844744707!2d-77.23373892358055!3d38.91983394785829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b64a89e9d5c7af%3A0x8e0d9b9b9b9b9b9b!2s8230%20Boone%20Blvd%2C%20Tysons%2C%20VA%2022182!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Virginia Laser Specialists Location in Tysons, VA"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Internal Links Section */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-foreground text-center mb-6">
                Explore Our Other Services
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/laser-skin-resurfacing" className="text-accent hover:underline font-medium">
                  Laser Skin Resurfacing →
                </Link>
                <Link to="/laser-hair-removal" className="text-accent hover:underline font-medium">
                  Laser Hair Removal →
                </Link>
                <Link to="/pricing" className="text-accent hover:underline font-medium">
                  View Pricing →
                </Link>
                <Link to="/gallery" className="text-accent hover:underline font-medium">
                  Before & After Gallery →
                </Link>
                <Link to="/contact" className="text-accent hover:underline font-medium">
                  Contact Us →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Ready for CoolPeel in Tysons, VA?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Schedule your free CoolPeel consultation today at Virginia Laser Specialists and discover how our 
              advanced CO₂ laser technology can rejuvenate your skin with minimal downtime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://www.vagaro.com/virginialaserspecialists/services" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8">
                  Book Your Free Consultation
                </Button>
              </a>
              <a href="tel:703-547-4499">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8">
                  Call (703) 547-4499
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

export default CoolPeelTysons;
