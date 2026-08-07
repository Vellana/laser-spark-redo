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
        description="CO2 laser resurfacing Vienna VA - Virginia Laser Specialists: medical spa Vienna VA and medical spa Tysons offering Clarity II laser hair removal and CoolPeel CO2 resurfacing. Free consults."
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
              Clarity II Laser Hair Removal in Vienna and Tysons Corner
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Virginia Laser Specialists provides expert{" "}
              <Link to="/laser-hair-removal" className="text-accent hover:underline">
                Clarity II laser hair removal Vienna
              </Link>{" "}
              and Tysons Corner patients trust, powered by the dual-wavelength Lutronic Clarity II. Safe for all skin
              types and tones, our Clarity II treatments deliver fast, comfortable sessions with long-lasting results,
              minutes from McLean, Falls Church, and Arlington. Explore{" "}
              <Link to="/pricing" className="text-accent hover:underline">
                laser hair removal packages near me
              </Link>{" "}
              for our 25% off 5-session series.
            </p>
          </div>
        </section>
        <ServiceCategories />
        <section className="py-12 bg-secondary/20">
          <div className="container mx-auto px-4 max-w-4xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
              CO2 Laser Resurfacing in Vienna and Tysons, VA
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our{" "}
              <Link to="/laser-skin-resurfacing" className="text-accent hover:underline">
                fractional CO2 laser Tysons
              </Link>{" "}
              treatments use the Cartessa Tetra Pro for CoolPeel{" "}
              <Link to="/laser-skin-resurfacing" className="text-accent hover:underline">
                CO2 laser resurfacing Vienna VA
              </Link>{" "}
              patients trust for radiant, refreshed skin with minimal downtime. For deeper rejuvenation, our fractional{" "}
              <Link to="/laser-skin-resurfacing" className="text-accent hover:underline">
                DEKA Tetra Pro Vienna
              </Link>{" "}
              option smooths wrinkles, acne scars, and sun damage. As a leading provider of{" "}
              <Link to="/laser-skin-resurfacing" className="text-accent hover:underline">
                laser skin resurfacing Northern Virginia
              </Link>{" "}
              residents rely on, we tailor every treatment to your skin type and goals, minutes from McLean, Falls
              Church, and Arlington.
            </p>
          </div>
        </section>
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-4xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
              Acne Scar and Scar Removal Treatment in Vienna, VA
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Looking for{" "}
              <Link to="/laser-skin-resurfacing" className="text-accent hover:underline">
                acne scar treatment Vienna VA
              </Link>{" "}
              patients can count on? Our fractional CO2 protocols resurface pitted and uneven skin to improve texture
              and tone. We also provide{" "}
              <Link to="/laser-skin-resurfacing" className="text-accent hover:underline">
                scar removal Vienna VA
              </Link>{" "}
              that softens surgical, traumatic, and acne scars, plus stretch mark treatments that smooth and blend the
              skin. Book a free consultation to build a personalized plan.
            </p>
          </div>
        </section>
        <CoolPeel />
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-4xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">CoolPeel Skin Resurfacing in Tysons</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              <Link to="/coolpeel-co2-laser-tysons-va" className="text-accent hover:underline">
                CoolPeel skin resurfacing Tysons
              </Link>{" "}
              patients love is a fractional CO2 treatment that refreshes tone and texture with only 1 to 3 days of
              downtime. See{" "}
              <Link to="/pricing" className="text-accent hover:underline">
                CoolPeel laser cost
              </Link>{" "}
              and packages, or visit our{" "}
              <Link to="/about" className="text-accent hover:underline">
                medical spa Tysons
              </Link>{" "}
              and{" "}
              <Link to="/about" className="text-accent hover:underline">
                medical spa Vienna VA
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
