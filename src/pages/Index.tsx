import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ServiceCategories from "@/components/ServiceCategories";
import CoolPeel from "@/components/CoolPeel";
import Services from "@/components/Services";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <ServiceCategories />
        <CoolPeel />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
