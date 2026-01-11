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

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Virginia Laser Specialists | Laser Hair Removal & Skin Resurfacing in Tysons, VA | Cherry Financing Available"
        description="Boutique laser studio in Tysons, Virginia offering long‑lasting laser hair removal and skin resurfacing. Cherry financing available with monthly payment plans. Finance up to $10,000 for laser treatments. Serving Tysons, McLean, Falls Church and Arlington."
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
        <CherryFinancing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
