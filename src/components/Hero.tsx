import { Button } from "@/components/ui/button";
import { Phone, MapPin } from "lucide-react";
import heroImage from "@/assets/Homepage_mainphoto.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Virginia Laser Specialists featuring Lutronic Clarity II with dual-wavelength Alexandrite and Nd:YAG lasers with cryogen cooling for minimal downtime laser hair removal and skin resurfacing" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/60 to-primary/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-block">
            <div className="w-16 h-1 bg-accent mx-auto mb-6 rounded-full" />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Advanced Laser Technology
          </h1>

          <p className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto font-light">
            Premier laser hair removal and revolutionary skin resurfacing treatments in the heart of Tysons.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a href="https://www.vagaro.com/virginialaserspecialists/services" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="accent"
                className="px-8 py-6 text-lg transition-all hover:scale-105"
              >
                Book Free Consultation
              </Button>
            </a>
            <Link to="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary font-semibold px-8 py-6 text-lg transition-all"
              >
                View Pricing
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 text-white/90">
            <a href="tel:703-547-4499" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-medium">703-547-4499</span>
            </a>
            <span className="hidden sm:inline text-white/50">|</span>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Tysons, VA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
