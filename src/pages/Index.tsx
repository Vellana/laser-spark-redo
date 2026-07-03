import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SummerPresaleBanner from "@/components/SummerPresaleBanner";
import CherryFinancing from "@/components/CherryFinancing";
import ServiceCategories from "@/components/ServiceCategories";
import CoolPeel from "@/components/CoolPeel";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import InstagramFeed from "@/components/InstagramFeed";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

import PromoBanner from "@/components/PromoBanner";
import SEO from "@/components/SEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import MedicalSpaSchema from "@/components/MedicalSpaSchema";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Laser Hair Removal Vienna VA | Laser Hair Removal Tysons Corner | CoolPeel"
        description="Virginia Laser Specialists offers laser hair removal Vienna VA and laser hair removal Tysons Corner with Clarity II, plus CoolPeel CO2 skin resurfacing. Book a free consultation."
      />
      <LocalBusinessSchema />
      <MedicalSpaSchema />
      <PromoBanner />
      <Navigation />
      <main>
        <Hero />
        <SummerPresaleBanner />
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-4xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
              Clarity II Laser Hair Removal Vienna and Tysons Corner
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Virginia Laser Specialists provides expert <Link to="/laser-hair-removal" className="text-accent hover:underline">Clarity II laser hair removal Vienna</Link> and Tysons Corner patients trust, powered by the dual-wavelength Lutronic Clarity II. Safe for all skin types and tones, our Clarity II treatments deliver fast, comfortable sessions with long-lasting results, minutes from McLean, Falls Church, and Arlington. Explore <Link to="/pricing" className="text-accent hover:underline">laser hair removal packages near me</Link> for our 25% off 5-session series.
            </p>
          </div>
        </section>
        <ServiceCategories />
        <section className="py-12 bg-secondary/20">
          <div className="container mx-auto px-4 max-w-4xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
              CO2 Laser Resurfacing Vienna VA and CO2 Laser Tysons
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our <Link to="/laser-skin-resurfacing" className="text-accent hover:underline">CO2 laser Tysons</Link> treatments use the Cartessa Tetra Pro for CoolPeel <Link to="/laser-skin-resurfacing" className="text-accent hover:underline">CO2 laser resurfacing Vienna VA</Link> patients trust for radiant, refreshed skin with minimal downtime. For deeper rejuvenation, our fractional <Link to="/laser-skin-resurfacing" className="text-accent hover:underline">DEKA Tetra Pro Vienna</Link> option smooths wrinkles, acne scars, and sun damage. As a leading provider of <Link to="/laser-skin-resurfacing" className="text-accent hover:underline">laser skin resurfacing Northern Virginia</Link> residents rely on, we tailor every treatment to your skin type and goals, minutes from McLean, Falls Church, and Arlington.
            </p>
          </div>
        </section>
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-4xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
              Acne Scar and Stretch Mark Treatment in Vienna VA
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Looking for acne scar treatment Vienna VA patients can count on? Our fractional CO2 laser protocols resurface pitted and uneven skin to dramatically improve texture and tone. We also specialize in scar removal Vienna VA - softening surgical, traumatic, and acne scars by stimulating fresh collagen growth. For new and mature marks alike, our stretch mark removal Vienna VA treatments smooth and blend the skin so you can feel confident again. Book a free consultation to build a personalized treatment plan.
            </p>
          </div>
        </section>
        <CoolPeel />
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-4xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
              CoolPeel Skin Resurfacing Tysons
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              CoolPeel skin resurfacing Tysons patients love is a fractional CO2 treatment that refreshes tone and texture with only 1 to 3 days of downtime. At our Vienna studio, just minutes from Tysons Corner, McLean, and Falls Church, our team tailors every CoolPeel session to your skin goals.
            </p>
          </div>
        </section>
        <div className="bg-secondary/30 py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              Looking for skin rejuvenation with minimal downtime? Learn more about our{" "}
              <Link to="/laser-skin-resurfacing" className="text-accent hover:underline font-medium">
                CoolPeel laser resurfacing
              </Link>{" "}
              treatments using advanced CO₂ technology.
            </p>
          </div>
        </div>
        <Services />
        <Testimonials />
        <InstagramFeed />
        <CherryFinancing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
