import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    name: "Brazilian Laser Hair Removal",
    description: "Complete and comfortable hair removal for intimate areas with expert care.",
    image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=2070",
  },
  {
    name: "Underarm Laser Hair Removal",
    description: "Say goodbye to daily shaving with smooth, lasting results.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070",
  },
  {
    name: "Leg Laser Hair Removal",
    description: "Full or half leg treatments for silky smooth skin year-round.",
    image: "https://images.unsplash.com/photo-1560750513-5c65a8efc56f?q=80&w=2070",
  },
  {
    name: "Back Laser Hair Removal",
    description: "Professional treatment for smooth, hair-free back.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070",
  },
  {
    name: "Chin Laser Hair Removal",
    description: "Precise facial hair removal for a confident, smooth appearance.",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070",
  },
  {
    name: "Face Laser Hair Removal",
    description: "Gentle and effective treatment for facial hair removal.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=2071",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Find Your Best Self
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground">
            Expert laser hair removal treatments tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service) => (
            <Card
              key={service.name}
              className="group overflow-hidden border-border hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              </div>
              <CardContent className="p-6 space-y-3">
                <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                  {service.name}
                </h3>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 shadow-gold"
          >
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
