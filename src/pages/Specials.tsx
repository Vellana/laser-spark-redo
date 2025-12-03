import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, ArrowRight, Gift, Snowflake, Phone } from "lucide-react";
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

  const winterSpecials = [
    {
      title: "Winter Gift Card Special",
      description: "Buy a $100 gift card and receive an additional $20.",
      details: "Offer ends December 31.",
      icon: Gift,
      cta: {
        type: "phone",
        label: "Call to Purchase",
        value: "703-547-4499",
      },
    },
    {
      title: "Winter Special - Brazilian/Brozilian",
      description: "40% off Brazilian or Brozilian packages of 5 sessions.",
      details: "Use promo code 'WINTER40' when booking. Limited time offer.",
      icon: Snowflake,
      cta: {
        type: "link",
        label: "Book Now",
        value: "https://www.vagaro.com/virginialaserspecialists/services",
      },
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

        {/* Winter Specials Section */}
        <section className="py-16 bg-gradient-to-b from-accent/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Snowflake className="w-8 h-8 text-accent" />
                <h2 className="text-3xl font-bold text-foreground">Winter Specials</h2>
                <Snowflake className="w-8 h-8 text-accent" />
              </div>
              <p className="text-muted-foreground">Limited-time seasonal offers</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {winterSpecials.map((special, index) => (
                <div
                  key={index}
                  className="relative bg-card border-2 border-accent rounded-2xl p-8 shadow-medium hover:shadow-lg transition-all duration-300"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Limited Time
                  </div>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                      <special.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {special.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {special.description}
                    </p>
                    <p className="text-sm text-muted-foreground/80 italic">
                      {special.details}
                    </p>
                    {special.cta.type === "phone" ? (
                      <a href={`tel:${special.cta.value}`}>
                        <Button variant="accent" className="mt-2">
                          <Phone className="w-4 h-4 mr-2" />
                          {special.cta.label}: {special.cta.value}
                        </Button>
                      </a>
                    ) : (
                      <a href={special.cta.value} target="_blank" rel="noopener noreferrer">
                        <Button variant="accent" className="mt-2">
                          {special.cta.label}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ongoing Specials Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ongoing Specials</h2>
              <p className="text-muted-foreground">Year-round savings on our services</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {specials.map((special, index) => (
                <div
                  key={index}
                  className={`relative bg-card border rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 ${
                    special.highlight ? "border-accent ring-2 ring-accent/20" : "border-border"
                  }`}
                >
                  {special.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
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

            {/* Contact Section */}
            <div className="mt-16 max-w-2xl mx-auto text-center bg-secondary/30 rounded-2xl p-8">
              <Calendar className="w-10 h-10 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Questions About Our Specials?
              </h3>
              <p className="text-muted-foreground mb-6">
                Contact us to learn more about our current promotions or follow us on Instagram to stay informed about upcoming offers.
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
