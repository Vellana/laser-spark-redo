import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const About = () => {
  const values = [
    "Safe and effective treatments",
    "Comfortable, welcoming space for ALL",
    "Expert care with lasting relationships",
    "Complete transparency in every step",
  ];

  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-medium">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053"
                alt="Modern laser treatment facility"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-2xl -z-10" />
          </div>

          {/* Content Side */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                About Our Practice
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                Excellence in Laser Hair Removal
              </h2>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              At Virginia Laser Specialists we strive to provide safe and effective 
              treatments in a comfortable space where ALL are welcome. We are committed 
              to delivering exceptional results, building lasting relationships with our 
              clients, and ensuring transparency in every aspect of their experience.
            </p>

            <div className="space-y-4 pt-4">
              {values.map((value) => (
                <div key={value} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-8"
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
