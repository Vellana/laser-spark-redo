import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import clarityImage from "@/assets/Homepage_Clarityiibox.jpg";
import coolPeelImage from "@/assets/Homepage_CoolPeelbox.jpg";
import FadeInSection from "@/components/FadeInSection";

const ServiceCategories = () => {
  const categories = [
    {
      title: "Laser Hair Removal",
      description: "Long lasting hair reduction for all body areas with advanced laser technology.",
      image: clarityImage,
      imageAlt: "Laser hair removal treatment with Lutronic Clarity II dual-wavelength laser for all skin types at Virginia Laser Specialists in Tysons VA",
      link: "/laser-hair-removal",
      isExternal: false,
    },
    {
      title: "Laser Skin Resurfacing - CoolPeel and Deka Pulse",
      description: "Revolutionary skin rejuvenation with customizable intensity levels to match your downtime needs.",
      image: coolPeelImage,
      imageAlt: "CoolPeel CO2 laser skin resurfacing treatment for fine lines and wrinkles with minimal downtime in Northern Virginia",
      link: "/laser-skin-resurfacing",
      isExternal: false,
    },
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Our Treatments
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose from our specialized treatment categories
          </p>
        </FadeInSection>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <FadeInSection key={category.title} delay={index * 150}>
              <div className="group relative overflow-hidden rounded-2xl shadow-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8 text-white">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 group-hover:text-accent transition-colors leading-tight">
                    {category.title}
                  </h3>
                  <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed">
                    {category.description}
                  </p>
                  <Link to={category.link}>
                    <Button
                      variant="outline"
                      className="border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary font-semibold group"
                    >
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;