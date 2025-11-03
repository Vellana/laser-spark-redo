import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    name: "Brazilian",
    description: "Complete and comfortable hair removal for intimate areas.",
    image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=2070",
  },
  {
    name: "Underarm",
    description: "Say goodbye to daily shaving with smooth, lasting results.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070",
  },
  {
    name: "Legs",
    description: "Full or half leg treatments for silky smooth skin.",
    image: "https://images.unsplash.com/photo-1560750513-5c65a8efc56f?q=80&w=2070",
  },
  {
    name: "Back",
    description: "Professional treatment for smooth, hair-free back.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070",
  },
  {
    name: "Chin",
    description: "Precise facial hair removal for a confident appearance.",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070",
  },
  {
    name: "Face",
    description: "Gentle and effective treatment for facial hair.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=2071",
  },
  {
    name: "Arms",
    description: "Smooth, hair-free arms with lasting results.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020",
  },
  {
    name: "Chest",
    description: "Professional chest hair removal for all skin types.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070",
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
              className="group overflow-hidden border-border hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={`${service.name} laser hair removal`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">
                    {service.name}
                  </h3>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{service.description}</p>
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
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 shadow-gold"
            >
              Book Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
