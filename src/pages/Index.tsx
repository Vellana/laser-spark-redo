import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ServiceCategories from "@/components/ServiceCategories";
import CoolPeel from "@/components/CoolPeel";
import Services from "@/components/Services";
import Technology from "@/components/Technology";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import InstagramFeed from "@/components/InstagramFeed";
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
        <Technology />
        <Team />
        <Testimonials />
        <About />
        <InstagramFeed />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
