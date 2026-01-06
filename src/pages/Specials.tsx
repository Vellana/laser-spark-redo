import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Sparkles, Calendar } from "lucide-react";
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

        {/* 2026 Specials Coming Soon */}
        <section className="py-16 bg-gradient-to-b from-accent/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                <Calendar className="w-10 h-10 text-accent" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">2026 Specials Coming Soon</h2>
              <p className="text-lg text-muted-foreground">
                We're preparing exciting new promotions for 2026. Check back soon for our latest offers on laser hair removal and skin resurfacing treatments.
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
