import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Clock, Heart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import coolPeelImage from "@/assets/Homepage_CoolPeelbox.jpg";
import tetraProLogo from "@/assets/tetra-pro-logo.png";

const LaserSkinResurfacing = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title="CoolPeel & DEKA CO₂ Laser Resurfacing in Fairfax, VA | Virginia Laser Specialists"
        description="Tetra Pro CO₂ platform offers CoolPeel (minimal downtime) and DEKA Pulse (deeper treatment) for skin rejuvenation. Customized aftercare, experienced providers in Tysons."
        canonicalUrl="/laser-skin-resurfacing"
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
                  Revolutionary Technology
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                  CoolPeel & DEKA CO₂ Laser Resurfacing
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Transform your skin with the Cartessa Tetra Pro CO₂ laser platform. Choose between 
                  CoolPeel for minimal downtime or DEKA Pulse for deeper, more dramatic results. 
                  Both treatments stimulate collagen production for smoother, more youthful-looking skin.
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
                  src={coolPeelImage}
                  alt="CoolPeel laser skin resurfacing treatment demonstration at Virginia Laser Specialists"
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
              <img 
                src={tetraProLogo}
                alt="Cartessa Tetra Pro CO2 laser system logo"
                className="h-20 mx-auto mb-6"
              />
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                The Tetra Pro CO₂ Platform
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The Tetra Pro by Cartessa offers advanced CO₂ laser technology with two treatment modes. 
                This versatile system allows us to customize treatments based on your specific skin concerns 
                and downtime preferences, delivering exceptional results with personalized aftercare.
              </p>
            </div>
          </div>
        </section>

        {/* Treatment Comparison */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Choose Your Treatment
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* CoolPeel Card */}
              <Card className="border-accent/40">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">CoolPeel</h3>
                      <p className="text-accent font-semibold">Minimal Downtime</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground">Best For</h4>
                      <p className="text-muted-foreground">Mild wrinkles, sun damage, uneven texture</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Downtime</h4>
                      <p className="text-muted-foreground">1-3 days of redness</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Sessions</h4>
                      <p className="text-muted-foreground">Typically 3 sessions, 1 month apart</p>
                    </div>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <p className="text-sm text-foreground">
                      <strong>Perfect if:</strong> You want effective results without significant social downtime
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* DEKA Pulse Card */}
              <Card className="border-primary/40">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">DEKA Pulse</h3>
                      <p className="text-primary font-semibold">Dramatic Results</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground">Best For</h4>
                      <p className="text-muted-foreground">Deep wrinkles, scars, severe sun damage</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Downtime</h4>
                      <p className="text-muted-foreground">5-10 days of peeling & redness</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Sessions</h4>
                      <p className="text-muted-foreground">Usually single treatment</p>
                    </div>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-foreground">
                      <strong>Perfect if:</strong> You're addressing significant aging concerns and can accommodate recovery
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What We Treat */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-foreground mb-8">
                Skin Concerns We Address
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["Fine Lines & Wrinkles", "Sun Damage", "Uneven Skin Texture", "Age Spots", "Acne Scars", "Skin Laxity", "Large Pores", "Dull Skin", "Hyperpigmentation"].map((concern) => (
                  <div key={concern} className="flex items-center gap-2 bg-background p-3 rounded-lg">
                    <Sparkles className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground text-sm">{concern}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CoolPeel Aftercare */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  CoolPeel Aftercare
                </h2>
              </div>
              <Card className="border-accent/40">
                <CardContent className="p-8">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>On the day of treatment, expect a warm or sunburn sensation for 2‑4+ hours.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Swelling, redness, and mild to moderate sunburn sensation are common for 1‑3 days.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Use a cool misting spray or sterile cool compress (not ice) to reduce the sensation of heat.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Apply a light, non-stinging moisturizer (such as hyaluronic acid or cream-based) after the sunburn sensation fades. If burning lasts more than a few minutes or is intense, wash off with a mild cleanser, rinse with cold water, and notify your provider.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Keep the area moisturized; reapply products every 3–4 hours to maintain hydration until the "sandpaper" texture resolves (typically 5–7 days).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Do not use any exfoliants or other products/procedures for 5–7 days.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Wash with a mild cleanser (AM & PM), blot dry, and do not scrub.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Use zinc or titanium-based sunblock after 24 hours.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Minimize alcohol intake throughout recovery.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Sleep with your head slightly elevated; use a clean pillowcase and change it frequently.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Wash hands often and avoid touching the treated area. Do not expose the treated area to anything that may cause complications (dirt, pets, etc.) as advised by your provider.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Mineral makeup may be applied after 2–5 days.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Avoid exercise, sweating, excessive heat, saunas, hot tubs, etc. for 2–4 days.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Please contact your provider with any questions or concerns during your recovery period.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Deka Pulse Aftercare */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground">
                  Deka Pulse Aftercare (Moderate/Aggressive CO₂ Post Treatment Guide)
                </h2>
              </div>
              <Card className="border-primary/40">
                <CardContent className="p-8">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>On the day of treatment, you may feel a hot or sunburn sensation for 2‑6+ hours.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>During recovery, expect swelling, redness, mild to moderate sunburn sensation along with pinpoint bleeding, weeping, or oozing.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Use a cool misting spray or sterile cool compress (not ice) to reduce the sensation of heat.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>After the sunburn sensation fades (usually by bedtime), gently apply a thin layer (about the thickness of a dime) of Vaseline or the provider-recommended product to keep the area moisturized and protected.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Prior to bedtime, it may be beneficial to take an antihistamine (e.g., Benadryl or Zyrtec).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Days 1–3: Apply vinegar-soaked pads (1 cup water + 1 tablespoon white distilled vinegar) to help prevent or soften crusting from the weeping/oozing. This can be repeated as often as every 2 hours. Store the solution in the refrigerator to aid in the cooling effect.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Days 1–5+: Wash with a mild cleanser (AM & PM), blot dry, and do not scrub.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Do not use any exfoliants or other products/procedures to address the dry skin/texture for 2–4 weeks or as directed by your provider.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Apply post-treatment products as directed. If a burning sensation lasts more than a few minutes after applying a product, wash with a mild cleanser and cold water and notify your provider.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Once weeping, bleeding, oozing, or crusting stops, change to a lighter or less occlusive product. Reapply every 3–4 hours or as needed to keep the area moisturized.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Use only recommended topical products until healed.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Avoid sun exposure for 2–4 weeks or as recommended by your provider. Once the skin is intact, use zinc or titanium-based sunblock when sun exposure cannot be avoided.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Minimize alcohol intake throughout recovery.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Sleep with your head slightly elevated; use a clean pillowcase and change it frequently.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Wash hands often and avoid touching the treated area. Do not expose the treated area to anything that may cause complications (dirt, pets, etc.) as advised by your provider.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Avoid exercise, sweating, excessive heat, saunas, and hot tubs for 5–7 days.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Mineral makeup may be applied after a few days, once the skin is intact and the weeping/oozing/bleeding has stopped.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Please contact your provider with any questions or concerns during your recovery period.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                Ready for Rejuvenated Skin?
              </h2>
              <p className="text-lg text-muted-foreground">
                Schedule your free consultation to discuss which treatment is right for your skin goals.
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

export default LaserSkinResurfacing;
