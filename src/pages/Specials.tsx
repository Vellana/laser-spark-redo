import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import SEO from "@/components/SEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { isSummerSaleActive } from "@/lib/summerSale";

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
  const summerSaleActive = isSummerSaleActive();

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
        title="Laser Specials & Promotions | Tysons VA"
        description="Limited-time laser specials on CoolPeel & laser hair removal in Tysons VA. Book your free consultation at Virginia Laser Specialists — 703-752-6608."
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
                Specials & Promotions
              </h1>
              <p className="text-lg text-muted-foreground">
                Take advantage of our limited-time offers at Virginia Laser Specialists.
              </p>
            </div>
          </div>
        </section>

        {summerSaleActive && (
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto bg-card border-2 border-destructive/40 rounded-2xl shadow-lg p-8 space-y-6 text-center">
                <span className="inline-flex items-center rounded-full bg-destructive/15 text-destructive border border-destructive/40 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                  Summer Sale · June 7–20, 2026
                </span>
                <h2 className="text-3xl font-bold text-foreground">Buy Now, Treat Later</h2>
                <div className="grid sm:grid-cols-2 gap-6 text-left">
                  <div className="p-5 bg-secondary/20 rounded-xl">
                    <h3 className="text-xl font-bold text-foreground mb-2">40% Off Laser Hair Removal</h3>
                    <p className="text-sm text-muted-foreground">All packages of 5 treatments — every area, every skin type.</p>
                  </div>
                  <div className="p-5 bg-secondary/20 rounded-xl">
                    <h3 className="text-xl font-bold text-foreground mb-2">$500 Off CoolPeel</h3>
                    <p className="text-sm text-muted-foreground">Save $500 on a CoolPeel package of 3 CO2 resurfacing treatments.</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Limited time deal. Cannot be combined with other discounts or promotions. Cherry monthly financing available.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    to="/summer-presale"
                    className="inline-flex items-center justify-center rounded-md bg-accent hover:bg-accent/90 text-primary font-semibold px-6 py-2.5"
                  >
                    See Summer Sale Details
                  </Link>
                  <Link
                    to="/pricing"
                    className="inline-flex items-center justify-center rounded-md border border-border text-foreground hover:bg-secondary/30 font-semibold px-6 py-2.5"
                  >
                    View Pricing
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="py-16 bg-gradient-to-b from-accent/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-foreground mb-8">Current Specials</h2>
              {loading ? (
                <p className="text-center text-muted-foreground">Loading specials...</p>
              ) : specials.length === 0 ? (
                <p className="text-center text-muted-foreground">No active specials right now. Check back soon!</p>
              ) : (
                <div className="space-y-8">
                  {specials.map((special) => (
                    <div key={special.id} className="bg-card border border-border rounded-2xl shadow-lg p-6 text-center space-y-4">
                      <h3 className="text-2xl font-bold text-foreground">{special.title}</h3>
                      {special.body && (
                        <div
                          className="text-base text-foreground prose prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_a]:text-accent [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                          dangerouslySetInnerHTML={{ __html: special.body }}
                        />
                      )}
                      {special.highlight_text && (
                        <p className="text-xl font-bold text-accent">{special.highlight_text}</p>
                      )}
                      {special.image_urls?.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3">
                          {special.image_urls.map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt={`${special.title} promotional image`}
                              className="max-w-full rounded-xl shadow-md"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      )}
                      {special.disclaimer && (
                        <p className="text-xs text-muted-foreground italic">{special.disclaimer}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Specials;
