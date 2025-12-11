import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
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

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Virginia Laser Specialists | Laser Hair Removal & Skin Resurfacing in Tysons, VA"
        description="Boutique laser studio in Tysons, Virginia offering long‑lasting laser hair removal with the Lutronic Clarity II (YAG and Alexandrite) and customizable Cartessa Tetra Pro CoolPeel & DEKA CO₂ skin resurfacing with cryogen cooling. Transparent pricing, minimal downtime, serving Tysons, McLean, Falls Church and Arlington."
        canonicalUrl="/"
      />
      <LocalBusinessSchema />
      <Navigation />
      <SpecialsPopup />
      <main>
        <Hero />
        <ServiceCategories />
        <CoolPeel />
        <Services />
        <Testimonials />
        <InstagramFeed />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
