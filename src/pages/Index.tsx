import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CherryFinancing from "@/components/CherryFinancing";
import ServiceCategories from "@/components/ServiceCategories";
import CoolPeel from "@/components/CoolPeel";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import InstagramFeed from "@/components/InstagramFeed";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SpecialsPopup from "@/components/SpecialsPopup";
import SEO from "@/components/SEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Laser Hair Removal Vienna VA | CoolPeel Tysons Corner - Virginia Laser Specialists"
        description="Virginia Laser Specialists offers expert laser hair removal in Vienna VA and Tysons Corner. CoolPeel CO2 laser resurfacing, scar removal, and stretch mark treatments. Book a free consultation."
      />
      <LocalBusinessSchema />
      <Navigation />
      <SpecialsPopup />
      <main>
        <Hero />
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-4xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
              Laser Hair Removal in Vienna VA and Tysons Corner
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Virginia Laser Specialists provides expert laser hair removal in Vienna VA and laser hair removal in Tysons Corner, powered by the dual-wavelength Lutronic Clarity II laser. Safe and effective for all skin types and tones, our Clarity II treatments deliver fast, comfortable sessions with long-lasting results - just minutes from McLean, Falls Church, and Arlington.
            </p>
          </div>
        </section>
        <ServiceCategories />
        <section className="py-12 bg-secondary/20">
          <div className="container mx-auto px-4 max-w-4xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
              CO2 Laser Resurfacing in Vienna VA and Tysons
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our CO2 laser Tysons treatments harness the precision of the Cartessa Tetra Pro for CoolPeel CO2 laser resurfacing Vienna VA patients trust for radiant, refreshed skin with minimal downtime. For deeper rejuvenation, our fractional CO2 laser Tysons option using the DEKA SmartXide stimulates collagen to smooth wrinkles, acne scars, and sun damage. As a leading provider of laser skin resurfacing Northern Virginia residents rely on, we tailor every treatment to your skin type and goals. Conveniently located minutes from McLean, Falls Church, and Arlington.
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
