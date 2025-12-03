import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

const Specials = () => {
  const specials = [
    {
      title: "New Client Special",
      description: "First-time clients receive 20% off their first laser hair removal session.",
      details: "Valid for any body area. Cannot be combined with other offers.",
      highlight: true,
    },
    {
      title: "Package Savings",
      description: "Save up to 25% when you purchase a package of 5 sessions.",
      details: "See our pricing page for detailed package pricing on all treatment areas.",
    },
    {
      title: "Refer a Friend",
      description: "Refer a friend and you both receive $50 off your next treatment.",
      details: "Friend must complete their first paid session. No limit on referrals.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Current Specials & Promotions | Virginia Laser Specialists"
        description="Save on laser hair removal and skin resurfacing treatments. New client discounts, package savings, and referral rewards. Limited-time offers in Tysons, VA."
        canonicalUrl="/specials"
      />
      <LocalBusinessSchema />
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="w-20 h-20 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Current Specials
              </h1>
              <p className="text-lg text-muted-foreground">
                Take advantage of our limited-time offers and promotional pricing on laser treatments.
              </p>
            </div>
          </div>
        </section>

        {/* Specials Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {specials.map((special, index) => (
                <div
                  key={index}
                  className={`relative bg-card border rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 ${
                    special.highlight ? "border-accent ring-2 ring-accent/20" : "border-border"
                  }`}
                >
                  {special.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-primary px-4 py-1 rounded-full text-sm font-semibold">
                      Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {special.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {special.description}
                  </p>
                  <p className="text-sm text-muted-foreground/80 italic">
                    {special.details}
                  </p>
                </div>
              ))}
            </div>

            {/* Seasonal Note */}
            <div className="mt-16 max-w-2xl mx-auto text-center bg-secondary/30 rounded-2xl p-8">
              <Calendar className="w-10 h-10 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Seasonal Promotions
              </h3>
              <p className="text-muted-foreground mb-6">
                We regularly update our specials with seasonal promotions. Follow us on Instagram or contact us to stay informed about upcoming offers.
              </p>
              <a href="https://www.vagaro.com/virginialaserspecialists/services" target="_blank" rel="noopener noreferrer">
                <Button variant="accent">
                  Book a Consultation
                  <ArrowRight className="ml-2 w-4 h-4" />
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

export default Specials;
