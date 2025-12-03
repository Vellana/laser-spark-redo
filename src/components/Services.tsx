import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Hand,
  Footprints,
  Shield,
  Smile,
  ScanFace,
  Circle,
  Target,
  Move,
  User,
} from "lucide-react";

const services = [
  {
    name: "Brazilian/ Brozilian",
    description: "Complete and comfortable hair removal for intimate areas.",
    icon: Target,
    color: "text-pink-500 bg-pink-500/10",
  },
  {
    name: "Underarms",
    description: "Say goodbye to daily shaving with smooth, lasting results.",
    icon: Hand,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    name: "Legs",
    description: "Full or half leg treatments for silky smooth skin.",
    icon: Footprints,
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    name: "Back",
    description: "Full or half back treatments for silky smooth skin.",
    icon: Shield,
    color: "text-green-500 bg-green-500/10",
  },
  {
    name: "Chin",
    description: "Precise facial hair removal for a confident appearance.",
    icon: Smile,
    color: "text-yellow-500 bg-yellow-500/10",
  },
  {
    name: "Face",
    description: "Gentle and effective treatment for facial hair.",
    icon: ScanFace,
    color: "text-orange-500 bg-orange-500/10",
  },
  {
    name: "Arms",
    description: "Full or half arm treatments for silky smooth skin.",
    icon: Hand,
    color: "text-indigo-500 bg-indigo-500/10",
  },
  {
    name: "Chest",
    description: "Professional chest hair removal for all skin types.",
    icon: Circle,
    color: "text-red-500 bg-red-500/10",
  },
  {
    name: "Abdomen",
    description: "Targeted treatment for smooth abdominal area.",
    icon: Circle,
    color: "text-teal-500 bg-teal-500/10",
  },
  {
    name: "Bikini Line",
    description: "Precise and comfortable bikini area treatment.",
    icon: Target,
    color: "text-fuchsia-500 bg-fuchsia-500/10",
  },
  {
    name: "Neck",
    description: "Front and back neck hair removal.",
    icon: Move,
    color: "text-rose-500 bg-rose-500/10",
  },
  {
    name: "Sideburns",
    description: "Clean, precise sideburn shaping and removal.",
    icon: ScanFace,
    color: "text-cyan-500 bg-cyan-500/10",
  },
  {
    name: "Upper Lip",
    description: "Gentle and precise upper lip hair removal.",
    icon: Smile,
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    name: "Shoulders",
    description: "Smooth shoulder area treatment.",
    icon: Shield,
    color: "text-lime-500 bg-lime-500/10",
  },
  {
    name: "Hands",
    description: "Hair removal for hands and fingers.",
    icon: Hand,
    color: "text-sky-500 bg-sky-500/10",
  },
  {
    name: "Feet",
    description: "Hair removal for feet and toes.",
    icon: Footprints,
    color: "text-violet-500 bg-violet-500/10",
  },
  {
    name: "Breasts",
    description: "Gentle and precise treatment for the chest area.",
    icon: Circle,
    color: "text-pink-400 bg-pink-400/10",
  },
  {
    name: "Full Body",
    description: "Complete head-to-toe hair removal for smooth, lasting results.",
    icon: User,
    color: "text-emerald-500 bg-emerald-500/10",
  },
];

const Services = () => {
  return (
    <section id="laser-hair-removal" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Laser Hair Removal
          </h2>
          <p className="text-lg text-muted-foreground">
            Safe, effective laser treatments for all areas of the body. Professional results with expert care.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service) => (
            <Card
              key={service.name}
              className="group overflow-hidden border-border hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-accent/50"
            >
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-full ${service.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <service.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-6">
          <div className="bg-secondary/50 border border-border rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Not Sure Which Treatment is Right for You?
            </h3>
            <p className="text-muted-foreground mb-6">
              Schedule a free consultation with our experts to discuss your goals and create a personalized treatment plan.
            </p>
            <a href="https://www.vagaro.com/virginialaserspecialists/services" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 shadow-gold"
              >
                Book Free Consultation
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
