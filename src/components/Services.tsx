import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  LucideIcon,
} from "lucide-react";

interface ServiceArea {
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  fullDescription: string;
  singlePrice: string;
  packagePrice: string;
}

const services: ServiceArea[] = [
  {
    name: "Brazilian/Brozilian",
    description: "Complete and comfortable hair removal for intimate areas.",
    icon: Target,
    color: "text-pink-500 bg-pink-500/10",
    fullDescription: "Brazilian Includes: Removes all or most of the pubic hair from the front, sides, and back, including the labia and the area between the buttocks. This can be modified to keep a small, customized portion of hair – often a landing strip or a triangle in the front. Brozilian Includes: Removes all or most of the pubic hair from the genital area, including the scrotum, perineum (the area between the scrotum and anus), and around the anus.",
    singlePrice: "$300",
    packagePrice: "$1,125 (save 25%)",
  },
  {
    name: "Underarms",
    description: "Say goodbye to daily shaving with smooth, lasting results.",
    icon: Hand,
    color: "text-blue-500 bg-blue-500/10",
    fullDescription: "Includes: Both underarms. Free yourself from daily shaving with our underarm laser hair removal. This popular treatment area responds excellently to laser therapy, with most clients seeing significant reduction after just a few sessions.",
    singlePrice: "$150",
    packagePrice: "$562.50 (save 25%)",
  },
  {
    name: "Legs",
    description: "Full or half leg treatments for silky smooth skin.",
    icon: Footprints,
    color: "text-purple-500 bg-purple-500/10",
    fullDescription: "Includes: Both legs, front and back (full or half). Achieve silky smooth legs year-round with our comprehensive leg treatments. We offer both full leg and half leg options to suit your needs.",
    singlePrice: "$350 (Half) / $500 (Full)",
    packagePrice: "$1,312.50 (Half) / $1,875 (Full)",
  },
  {
    name: "Back",
    description: "Full or half back treatments for smooth skin.",
    icon: Shield,
    color: "text-green-500 bg-green-500/10",
    fullDescription: "Our back laser hair removal treatments are ideal for those looking to eliminate unwanted hair from this hard-to-reach area. We offer both full back and half back options (upper or lower).",
    singlePrice: "$250 (Half) / $400 (Full)",
    packagePrice: "$937.50 (Half) / $1,500 (Full)",
  },
  {
    name: "Chin",
    description: "Precise facial hair removal for a confident appearance.",
    icon: Smile,
    color: "text-yellow-500 bg-yellow-500/10",
    fullDescription: "Includes: Front and under chin (does not include neck). Chin hair can be particularly bothersome and difficult to manage. Our precise laser treatment targets unwanted chin hair effectively, providing smooth results that last.",
    singlePrice: "$100",
    packagePrice: "$375 (save 25%)",
  },
  {
    name: "Face",
    description: "Gentle and effective treatment for facial hair.",
    icon: ScanFace,
    color: "text-orange-500 bg-orange-500/10",
    fullDescription: "Includes: Upper lip, chin, cheeks, sideburns, forehead and hairline. Our full face laser hair removal addresses unwanted hair on the entire face, excluding the eye area. Perfect for those dealing with peach fuzz or more prominent facial hair.",
    singlePrice: "$250",
    packagePrice: "$937.50 (save 25%)",
  },
  {
    name: "Arms",
    description: "Full or half arm treatments for silky smooth skin.",
    icon: Hand,
    color: "text-indigo-500 bg-indigo-500/10",
    fullDescription: "Includes: Both arms front and back (full or half). Whether you want smooth forearms or complete arm hair removal, our arm treatments deliver excellent results.",
    singlePrice: "$300 (Half) / $400 (Full)",
    packagePrice: "$1,125 (Half) / $1,500 (Full)",
  },
  {
    name: "Chest",
    description: "Professional chest hair removal for all skin types.",
    icon: Circle,
    color: "text-red-500 bg-red-500/10",
    fullDescription: "Includes: Upper torso (does not include shoulders or abdomen). Achieve a smooth, hair-free chest with our professional laser treatment. Popular among both men and women.",
    singlePrice: "$250",
    packagePrice: "$937.50 (save 25%)",
  },
  {
    name: "Abdomen",
    description: "Targeted treatment for smooth abdominal area.",
    icon: Circle,
    color: "text-teal-500 bg-teal-500/10",
    fullDescription: "Includes: Lower torso (does not include chest). Our abdomen laser hair removal targets the stomach area, including the navel line and surrounding regions.",
    singlePrice: "$250",
    packagePrice: "$937.50 (save 25%)",
  },
  {
    name: "Bikini Line",
    description: "Precise and comfortable bikini area treatment.",
    icon: Target,
    color: "text-fuchsia-500 bg-fuchsia-500/10",
    fullDescription: "Includes: Removes hair along and outside the top and sides of the bikini line. This is a great option for those who want to reduce maintenance without committing to a full Brazilian.",
    singlePrice: "$250",
    packagePrice: "$937.50 (save 25%)",
  },
  {
    name: "Neck",
    description: "Front or back neck hair removal.",
    icon: Move,
    color: "text-rose-500 bg-rose-500/10",
    fullDescription: "Includes: Front or back of neck (nape). Does not include chin. Neck hair can be particularly visible and bothersome. This is a popular add-on to beard shaping or as a standalone treatment.",
    singlePrice: "$100",
    packagePrice: "$375 (save 25%)",
  },
  {
    name: "Sideburns",
    description: "Clean, precise sideburn shaping and removal.",
    icon: ScanFace,
    color: "text-cyan-500 bg-cyan-500/10",
    fullDescription: "Includes: Removal of hair from the area in front of the ears, extending down towards the jawline. Achieve perfectly shaped or completely smooth sideburns with our precision laser treatment.",
    singlePrice: "$100",
    packagePrice: "$375 (save 25%)",
  },
  {
    name: "Upper Lip",
    description: "Gentle and precise upper lip hair removal.",
    icon: Smile,
    color: "text-amber-500 bg-amber-500/10",
    fullDescription: "Includes: Removes hair from upper lip and corners of mouth. Say goodbye to waxing and threading with our upper lip laser hair removal. This quick treatment takes only about 10 minutes.",
    singlePrice: "$100",
    packagePrice: "$375 (save 25%)",
  },
  {
    name: "Shoulders",
    description: "Smooth shoulder area treatment.",
    icon: Shield,
    color: "text-lime-500 bg-lime-500/10",
    fullDescription: "Includes: Removes hair from base of the neck to the top of upper arms and back. Shoulder hair can be difficult to manage on your own. This treatment is often combined with back or chest treatments.",
    singlePrice: "$100",
    packagePrice: "$375 (save 25%)",
  },
  {
    name: "Hands",
    description: "Hair removal for hands and fingers.",
    icon: Hand,
    color: "text-sky-500 bg-sky-500/10",
    fullDescription: "Includes: Removes hair from wrist to top of fingers. Hand and finger hair may seem minor, but can affect your confidence in professional and social settings.",
    singlePrice: "$100",
    packagePrice: "$375 (save 25%)",
  },
  {
    name: "Feet",
    description: "Hair removal for feet and toes.",
    icon: Footprints,
    color: "text-violet-500 bg-violet-500/10",
    fullDescription: "Includes: Removes hair from ankle to tip of toes. Enjoy sandal season without worrying about toe or foot hair. Perfect for anyone who wants picture-perfect feet year-round.",
    singlePrice: "$100",
    packagePrice: "$375 (save 25%)",
  },
  {
    name: "Breasts",
    description: "Gentle and precise treatment for the chest area.",
    icon: Circle,
    color: "text-pink-400 bg-pink-400/10",
    fullDescription: "Includes: Removes hair on breasts including areolas. This treatment addresses unwanted hair around the areola and breast tissue, providing smooth results with utmost care and professionalism.",
    singlePrice: "$100",
    packagePrice: "$375 (save 25%)",
  },
  {
    name: "Full Body",
    description: "Complete head-to-toe hair removal for smooth, lasting results.",
    icon: User,
    color: "text-emerald-500 bg-emerald-500/10",
    fullDescription: "Includes: Removes hair from all desired areas from head to toes (arms, legs, underarms, back, face, hands, feet). Our comprehensive full body treatment is ideal for those seeking complete hair-free smoothness.",
    singlePrice: "$1,850",
    packagePrice: "$6,937.50 (save 25%)",
  },
];

const Services = () => {
  const [selectedService, setSelectedService] = useState<ServiceArea | null>(null);

  return (
    <section id="laser-hair-removal" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Laser Hair Removal
          </h2>
          <p className="text-lg text-muted-foreground">
            Safe, effective laser treatments for all areas of the body. Professional results with expert care. Click any area for details and pricing.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <Card
              key={service.name}
              onClick={() => setSelectedService(service)}
              className={`group overflow-hidden border-border hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-accent/50 ${
                index === services.length - 2 ? 'lg:col-start-2' : ''
              }`}
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

        {/* Service Detail Dialog */}
        <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              {selectedService && (
                <div className="flex items-center gap-4 mb-2">
                  <div className={`w-12 h-12 rounded-full ${selectedService.color} flex items-center justify-center`}>
                    <selectedService.icon className="w-6 h-6" />
                  </div>
                  <DialogTitle className="text-2xl">{selectedService.name}</DialogTitle>
                </div>
              )}
            </DialogHeader>
            {selectedService && (
              <div className="space-y-6">
                <DialogDescription className="text-base leading-relaxed">
                  {selectedService.fullDescription}
                </DialogDescription>
                
                <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-foreground">Pricing</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Single Session</p>
                      <p className="text-lg font-bold text-accent">{selectedService.singlePrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Package of 5</p>
                      <p className="text-lg font-bold text-accent">{selectedService.packagePrice}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Treatment Schedule:</strong> Most clients need 8-10 treatments spaced 6-8 weeks apart for optimal results.
                  </p>
                </div>

                <a href="https://www.vagaro.com/virginialaserspecialists/services" target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold">
                    Book This Treatment
                  </Button>
                </a>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Aftercare Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-border">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Laser Hair Removal Care Instructions
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Avoid sun exposure to the treated area by covering or using sunscreen for a minimum of 2-4 weeks prior and post treatment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Avoid using spray tans or self-tanner for a minimum of 2 weeks prior to treatment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Please ensure the treatment area is hair-free before your appointment by shaving with a traditional razor (recommended within 24 hours of appointment).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Avoid tweezing, sugaring, waxing, or electrolysis for 4-6 weeks prior to treatment. Shaving is fine 48 hours after treatment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>The treatment area should be clean-shaven and thoroughly cleansed, removing any makeup, creams, oils, topical anesthetics, or bronzing products before treatment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Avoid skin care products with irritants such as Glycolic Acid or Retin-A on the treatment area for about 1-2 weeks before treatment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Avoid excessive heat, including hot water, saunas, hot tubs, for 48 hours post-treatment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Do not exercise rigorously for 24 hours post-treatment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Do not apply topical beauty products, including deodorant for 24 hours post-treatment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Please call before your appointment if you are taking a new medication that may cause photosensitivity, especially acne medication.</span>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-muted-foreground leading-relaxed">
                  The Lutronic Clarity II laser is the gold standard for laser hair removal. Its dual-wavelength system is safe for use on all skin types and tones and can also treat conditions such as hyperpigmentation, spider veins, angiomas, and broken capillaries.
                </p>
              </div>
            </CardContent>
          </Card>
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
