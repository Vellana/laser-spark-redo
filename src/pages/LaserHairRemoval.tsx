import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Zap, Shield, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import clarityImage from "@/assets/Homepage_Clarityiibox.jpg";

const LaserHairRemoval = () => {
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

  const treatmentAreas = [
    "Face & Chin", "Upper Lip", "Underarms", "Arms (Half/Full)",
    "Legs (Half/Full)", "Bikini Line", "Brazilian", "Back",
    "Chest", "Abdomen", "Shoulders", "Neck"
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
        <section className="relative py-20 bg-gradient-to-br from-primary/10 to-background overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
                  Gold Standard Technology
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                  Laser Hair Removal
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Experience permanent hair reduction with the Lutronic Clarity II laser—the gold standard 
                  in laser hair removal. Our dual wavelength system is safe for all skin types and tones, 
                  delivering exceptional results with minimal discomfort.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://www.vagaro.com/virginialaserspecialists/services" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8">
                      Book Free Consultation
                    </Button>
                  </a>
                  <Link to="/pricing">
                    <Button size="lg" variant="outline" className="border-2 font-semibold px-8">
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
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
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                The Lutronic Clarity II Difference
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The Lutronic Clarity II laser is the gold standard for laser hair removal. Its dual wavelength 
                system means that it is safe for use on all skin types and tones. It is also exceptionally 
                capable of treating a variety of skin issues, from hyperpigmentation to spider veins to 
                angiomas and broken capillaries.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Why Choose Us for Laser Hair Removal
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-foreground mb-8">
                Treatment Areas
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {treatmentAreas.map((area) => (
                  <div key={area} className="flex items-center gap-2 bg-background p-3 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{area}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-muted-foreground mt-6">
                Full body packages available. <Link to="/pricing" className="text-accent hover:underline">View all pricing</Link>
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                Ready for Smooth, Hair-Free Skin?
              </h2>
              <p className="text-lg text-muted-foreground">
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
