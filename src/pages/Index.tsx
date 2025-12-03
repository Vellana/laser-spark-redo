import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ServiceCategories from "@/components/ServiceCategories";
import CoolPeel from "@/components/CoolPeel";
import Services from "@/components/Services";
import Technology from "@/components/Technology";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import InstagramFeed from "@/components/InstagramFeed";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SpecialsPopup from "@/components/SpecialsPopup";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <SpecialsPopup />
      <main>
        <Hero />
        <ServiceCategories />
        <CoolPeel />
        <Services />
        <Technology />
        <Team />
        <Testimonials />
        <InstagramFeed />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
