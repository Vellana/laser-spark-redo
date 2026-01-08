import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Sparkles } from "lucide-react";
import SEO from "@/components/SEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

const Specials = () => {
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
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="w-14 h-14 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent" />
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

        {/* Winter Special */}
        <section className="py-16 bg-gradient-to-b from-accent/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-accent" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Winter Special!</h2>
              <p className="text-xl text-foreground font-semibold">
                Buy any laser hair removal package of 5 treatments, get a 6th treatment free!
              </p>
              <p className="text-2xl font-bold text-accent">
                Value of up to $1,800!
              </p>
              <p className="text-sm text-muted-foreground italic">
                *Free treatment must be same area as package. Cannot be combined with any other offers. Offer expires 1/31/26.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Specials;
