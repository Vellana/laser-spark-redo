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
        title="Medical Spa Vienna VA | Medical Spa Tysons | Laser Hair Removal & CoolPeel"
        description="Virginia Laser Specialists: medical spa Vienna VA and medical spa Tysons offering Clarity II laser hair removal and CoolPeel CO2 resurfacing. Free consults."
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
              Brazilian and Full-Body Laser Hair Removal
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Virginia Laser Specialists provides expert{" "}
              <Link to="/laser-hair-removal" className="text-accent hover:underline">
                laser hair removal
              </Link>{" "}
              in Vienna and Tysons Corner, powered by the dual-wavelength Lutronic Clarity II. Safe for all skin
              types and tones, our Clarity II treatments deliver fast, comfortable sessions with long-lasting results,
              minutes from McLean, Falls Church, and Arlington. See our{" "}
              <Link to="/pricing" className="text-accent hover:underline">
                pricing
              </Link>{" "}
              for our 25% off 5-session series.
            </p>
          </div>
        </section>
        <ServiceCategories />
        <section className="py-12 bg-secondary/20">
          <div className="container mx-auto px-4 max-w-4xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
              Treatments for Acne Scars, Sun Damage and Fine Lines
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our{" "}
              <Link to="/laser-skin-resurfacing" className="text-accent hover:underline">
                CO2 laser resurfacing
              </Link>{" "}
              treatments use the Cartessa Tetra Pro. CoolPeel delivers radiant, refreshed skin with minimal downtime,
              and for deeper rejuvenation our fractional DEKA Pulse option smooths wrinkles, acne scars, and sun
              damage. We tailor every treatment to your skin type and goals, minutes from McLean, Falls Church, and
              Arlington.
            </p>
          </div>
        </section>
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-4xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
              Acne Scar and Scar Removal Treatment in Vienna, VA
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our fractional CO2 protocols resurface pitted and uneven skin to improve texture and tone. Our{" "}
              <Link to="/laser-skin-resurfacing" className="text-accent hover:underline">
                scar treatments
              </Link>{" "}
              soften surgical, traumatic, and acne scars, and we also offer stretch mark treatments that smooth and
              blend the skin. Book a free consultation to build a personalized plan.
            </p>
          </div>
        </section>
        <CoolPeel />
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-4xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">CoolPeel Skin Resurfacing in Tysons</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              <Link to="/coolpeel-co2-laser-tysons-va" className="text-accent hover:underline">
                CoolPeel
              </Link>{" "}
              is a fractional CO2 treatment that refreshes tone and texture with only 1 to 3 days of downtime. See
              our{" "}
              <Link to="/pricing" className="text-accent hover:underline">
                pricing
              </Link>{" "}
              for sessions and packages, or{" "}
              <Link to="/about" className="text-accent hover:underline">
                visit our medical spa
              </Link>{" "}
              in Vienna, minutes from Tysons Corner, McLean, and Falls Church.
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
