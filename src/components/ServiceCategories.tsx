import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const ServiceCategories = () => {
  const categories = [
    {
      title: "Laser Hair Removal",
      description: "Permanent hair reduction for all body areas with advanced laser technology.",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070",
      link: "#laser-hair-removal",
    },
    {
      title: "Cool Peel",
      description: "Revolutionary skin rejuvenation with minimal downtime and maximum results.",
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070",
      link: "#cool-peel",
      featured: true,
    },
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Our Treatments
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose from our two specialized treatment categories
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.title}
              className={`group relative overflow-hidden rounded-2xl shadow-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-2 ${
                category.featured ? "ring-2 ring-accent" : ""
              }`}
            >
              {category.featured && (
                <div className="absolute top-4 right-4 z-20 bg-accent text-primary px-4 py-2 rounded-full text-sm font-semibold">
                  Featured
                </div>
              )}
              
              <div className="relative h-80 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30" />
              </div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <h3 className="text-3xl font-bold mb-3 group-hover:text-accent transition-colors">
                  {category.title}
                </h3>
                <p className="text-white/90 mb-6 text-lg">
                  {category.description}
                </p>
                <a href={category.link}>
                  <Button
                    variant="outline"
                    className="border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary font-semibold group"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;