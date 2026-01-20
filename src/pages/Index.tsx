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
        title="Virginia Laser Specialists | #1 Laser Hair Removal & CoolPeel Tysons VA | Free Consultation"
        description="Top-rated laser hair removal & CoolPeel CO₂ skin resurfacing in Tysons, Vienna, McLean VA. Lutronic Clarity II safe for all skin types. Cherry financing with $0 down. 25% off packages. Call 703-547-4499 for free consultation."
        canonicalUrl="/"
      />
      <LocalBusinessSchema />
      <Navigation />
      <SpecialsPopup />
      <main>
        <Hero />
        <ServiceCategories />
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
