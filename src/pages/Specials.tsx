import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import SEO from "@/components/SEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { supabase } from "@/integrations/supabase/client";
import mothersDayFlyer from "@/assets/mothers-day-flyer.jpg";

interface Special {
  id: string;
  title: string;
  body: string;
  highlight_text: string;
  disclaimer: string;
  image_urls: string[];
}

const Specials = () => {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecials = async () => {
      const { data } = await supabase
        .from("specials")
        .select("id, title, body, highlight_text, disclaimer, image_urls")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      setSpecials((data as any) || []);
      setLoading(false);
    };
    fetchSpecials();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Specials & Promotions | Virginia Laser Specialists | Tysons VA"
        description="Current laser treatment specials and promotions at Virginia Laser Specialists in Tysons, McLean, Vienna VA. Limited time offers on CoolPeel, laser hair removal & more. Call 703-547-4499."
        canonicalUrl="/specials" 
      />
      <LocalBusinessSchema />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Specials", url: "/specials" }
      ]} />
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Specials & Events
              </h1>
              <p className="text-lg text-muted-foreground">
                Take advantage of our limited-time offers and upcoming events at Virginia Laser Specialists.
              </p>
            </div>
          </div>
        </section>

        {/* Events Section - top, full-width */}
        <section className="py-16 bg-gradient-to-b from-accent/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">Events</h2>
            <div className="max-w-md mx-auto bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
              {/* Hero Flyer Image - dominant, like the popup */}
              <img
                src={mothersDayFlyer}
                alt="Mother's Day Blossoms event flyer"
                className="w-full h-auto object-cover"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              {/* Event details */}
              <div className="px-6 py-5 text-center space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">Special Event</p>
                <h3 className="text-2xl font-bold text-foreground leading-tight">Mother's Day Blossoms</h3>
                <p className="text-base font-medium text-muted-foreground">May 4 to 7, 2026</p>
                <p className="text-sm text-muted-foreground">
                  Virginia Laser Specialists<br />
                  8100 Boone Blvd, Suite 270, Vienna, VA 22182
                </p>
                <p className="text-sm text-foreground">
                  Treat Mom or treat yourself - exclusive event-only specials at VLS.
                </p>
                <div className="pt-2">
                  <a
                    href="https://www.eventbrite.com/e/1988100200217?aff=oddtdtcreator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full"
                  >
                    <button className="w-full bg-accent text-primary hover:bg-accent/90 font-semibold shadow-lg rounded-md px-8 h-11 transition-colors">
                      RSVP on Eventbrite
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Current Specials Header */}
        <section className="pt-12 pb-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-foreground">Current Specials</h2>
          </div>
        </section>

        {/* Dynamic Specials */}
        {loading ? (
          <section className="py-16">
            <p className="text-center text-muted-foreground">Loading specials...</p>
          </section>
        ) : specials.length === 0 ? (
          <section className="py-16">
            <div className="container mx-auto px-4 text-center">
              <p className="text-lg text-muted-foreground">No active specials right now. Check back soon!</p>
            </div>
          </section>
        ) : (
          specials.map((special) => (
            <section key={special.id} className="py-16 bg-gradient-to-b from-accent/5 to-background">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                  <h2 className="text-3xl font-bold text-foreground">{special.title}</h2>
                  {special.body && (
                    <div
                      className="text-lg text-foreground prose prose-sm max-w-none [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-semibold [&_a]:text-accent [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                      dangerouslySetInnerHTML={{ __html: special.body }}
                    />
                  )}
                  {special.highlight_text && (
                    <p className="text-2xl font-bold text-accent">{special.highlight_text}</p>
                  )}
                  {special.image_urls?.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-4">
                      {special.image_urls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`${special.title} promotional image`}
                          className="max-w-full sm:max-w-md rounded-xl shadow-lg"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  )}
                  {special.disclaimer && (
                    <p className="text-sm text-muted-foreground italic">{special.disclaimer}</p>
                  )}
                </div>
              </div>
            </section>
          ))
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Specials;
