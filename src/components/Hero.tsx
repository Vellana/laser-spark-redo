import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { pushEvent } from "@/lib/analytics";
import heroPoster from "@/assets/Homepage_mainphoto.jpg";

const Hero = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0">
        {/* Skeleton placeholder */}
        <div
          className={`absolute inset-0 bg-primary transition-opacity duration-700 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
        <video
          src="/coolpeel_hero_web.mp4"
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="CoolPeel CO2 laser skin resurfacing treatment at Virginia Laser Specialists in Tysons, VA"
          className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoadedData={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(215,28%,25%)]/65 via-[hsl(215,28%,30%)]/55 to-[hsl(215,28%,35%)]/45" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`max-w-4xl mx-auto space-y-8 transition-all duration-1000 ${imageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-block">
            <div className="w-16 h-1 bg-accent mx-auto mb-6 rounded-full" />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Laser Hair Removal & CoolPeel Skin Resurfacing in Tysons, VA
          </h1>

          <p className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto font-light">
            Expert laser hair removal with Lutronic Clarity II and CoolPeel CO₂ resurfacing - safe for all skin types. Serving Tysons, Vienna & McLean.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/book-free-consultation" onClick={() => pushEvent("free_consult_booking")}>
              <Button
                size="lg"
                variant="accent"
                className="px-8 py-6 text-lg transition-all hover:scale-105"
              >
                Book Free Consultation
              </Button>
            </Link>
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
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/50 to-transparent" />
    </section>
  );
};

export default Hero;
