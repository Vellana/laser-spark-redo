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
    name: "Brazilian/ Brozilian",
    description: "Complete and comfortable hair removal for intimate areas.",
    icon: Target,
    color: "text-pink-500 bg-pink-500/10",
    fullDescription: "Our Brazilian/Brozilian treatment provides complete hair removal for intimate areas using the Clarity II laser. This treatment is performed with the utmost professionalism and care, ensuring your comfort throughout the process. The dual-wavelength technology allows us to safely treat all skin types while achieving smooth, long-lasting results.",
    singlePrice: "$200",
    packagePrice: "$800",
  },
  {
    name: "Underarms",
    description: "Say goodbye to daily shaving with smooth, lasting results.",
    icon: Hand,
    color: "text-blue-500 bg-blue-500/10",
    fullDescription: "Free yourself from daily shaving with our underarm laser hair removal. This popular treatment area responds excellently to laser therapy, with most clients seeing significant reduction after just a few sessions. Enjoy the confidence of smooth underarms without the hassle of razors or deodorant stains.",
    singlePrice: "$75",
    packagePrice: "$300",
  },
  {
    name: "Legs",
    description: "Full or half leg treatments for silky smooth skin.",
    icon: Footprints,
    color: "text-purple-500 bg-purple-500/10",
    fullDescription: "Achieve silky smooth legs year-round with our comprehensive leg treatments. We offer both full leg and half leg options to suit your needs. The Clarity II laser efficiently covers large areas while maintaining precision, making leg treatments faster and more comfortable than ever.",
    singlePrice: "$250 (Half) / $400 (Full)",
    packagePrice: "$1,000 (Half) / $1,600 (Full)",
  },
  {
    name: "Back",
    description: "Full or half back treatments for silky smooth skin.",
    icon: Shield,
    color: "text-green-500 bg-green-500/10",
    fullDescription: "Our back laser hair removal treatments are ideal for those looking to eliminate unwanted hair from this hard-to-reach area. We offer both full back and half back options. The treatment is efficient for larger areas and provides long-lasting smoothness.",
    singlePrice: "$200 (Half) / $350 (Full)",
    packagePrice: "$800 (Half) / $1,400 (Full)",
  },
  {
    name: "Chin",
    description: "Precise facial hair removal for a confident appearance.",
    icon: Smile,
    color: "text-yellow-500 bg-yellow-500/10",
    fullDescription: "Chin hair can be particularly bothersome and difficult to manage. Our precise laser treatment targets unwanted chin hair effectively, providing smooth results that last. The treatment is quick, typically taking only 10-15 minutes, and is safe for all skin types.",
    singlePrice: "$50",
    packagePrice: "$200",
  },
  {
    name: "Face",
    description: "Gentle and effective treatment for facial hair.",
    icon: ScanFace,
    color: "text-orange-500 bg-orange-500/10",
    fullDescription: "Our full face laser hair removal addresses unwanted hair on the entire face, excluding the eye area. This treatment is perfect for those dealing with peach fuzz or more prominent facial hair. The Clarity II's precision ensures safe, effective treatment while protecting your delicate facial skin.",
    singlePrice: "$150",
    packagePrice: "$600",
  },
  {
    name: "Arms",
    description: "Full or half arm treatments for silky smooth skin.",
    icon: Hand,
    color: "text-indigo-500 bg-indigo-500/10",
    fullDescription: "Whether you want smooth forearms or complete arm hair removal, our arm treatments deliver excellent results. We offer half arm (forearm or upper arm) and full arm options. Enjoy sleeveless tops and short sleeves with confidence.",
    singlePrice: "$100 (Half) / $175 (Full)",
    packagePrice: "$400 (Half) / $700 (Full)",
  },
  {
    name: "Chest",
    description: "Professional chest hair removal for all skin types.",
    icon: Circle,
    color: "text-red-500 bg-red-500/10",
    fullDescription: "Achieve a smooth, hair-free chest with our professional laser treatment. Popular among both men and women, chest hair removal is comfortable and effective with the Clarity II laser. The dual-wavelength system ensures safe treatment for all skin types and tones.",
    singlePrice: "$175",
    packagePrice: "$700",
  },
  {
    name: "Abdomen",
    description: "Targeted treatment for smooth abdominal area.",
    icon: Circle,
    color: "text-teal-500 bg-teal-500/10",
    fullDescription: "Our abdomen laser hair removal targets the stomach area, including the navel line and surrounding regions. This treatment is perfect for eliminating the trail of hair that extends from the navel or for full abdominal smoothness.",
    singlePrice: "$125",
    packagePrice: "$500",
  },
  {
    name: "Bikini Line",
    description: "Precise and comfortable bikini area treatment.",
    icon: Target,
    color: "text-fuchsia-500 bg-fuchsia-500/10",
    fullDescription: "Our bikini line treatment focuses on the areas visible outside a standard bikini or underwear. This is a great option for those who want to reduce maintenance without committing to a full Brazilian. Quick, comfortable, and effective.",
    singlePrice: "$100",
    packagePrice: "$400",
  },
  {
    name: "Neck",
    description: "Front and back neck hair removal.",
    icon: Move,
    color: "text-rose-500 bg-rose-500/10",
    fullDescription: "Neck hair can be particularly visible and bothersome. Our neck treatment covers both front and back of the neck, providing clean lines and smooth skin. This is a popular add-on to beard shaping or as a standalone treatment.",
    singlePrice: "$75",
    packagePrice: "$300",
  },
  {
    name: "Sideburns",
    description: "Clean, precise sideburn shaping and removal.",
    icon: ScanFace,
    color: "text-cyan-500 bg-cyan-500/10",
    fullDescription: "Achieve perfectly shaped or completely smooth sideburns with our precision laser treatment. Whether you want to reduce density or remove sideburn hair entirely, our treatment provides lasting results for a polished appearance.",
    singlePrice: "$50",
    packagePrice: "$200",
  },
  {
    name: "Upper Lip",
    description: "Gentle and precise upper lip hair removal.",
    icon: Smile,
    color: "text-amber-500 bg-amber-500/10",
    fullDescription: "Say goodbye to waxing and threading with our upper lip laser hair removal. This quick treatment takes only about 10 minutes and provides long-lasting smoothness. The Clarity II laser is gentle enough for this delicate facial area while being highly effective.",
    singlePrice: "$50",
    packagePrice: "$200",
  },
  {
    name: "Shoulders",
    description: "Smooth shoulder area treatment.",
    icon: Shield,
    color: "text-lime-500 bg-lime-500/10",
    fullDescription: "Shoulder hair can be difficult to manage on your own. Our shoulder laser treatment provides smooth, hair-free results that last. This treatment is often combined with back or chest treatments for comprehensive coverage.",
    singlePrice: "$100",
    packagePrice: "$400",
  },
  {
    name: "Hands",
    description: "Hair removal for hands and fingers.",
    icon: Hand,
    color: "text-sky-500 bg-sky-500/10",
    fullDescription: "Hand and finger hair may seem minor, but can affect your confidence in professional and social settings. Our hand treatment is quick and effective, providing smooth hands that look well-groomed at all times.",
    singlePrice: "$50",
    packagePrice: "$200",
  },
  {
    name: "Feet",
    description: "Hair removal for feet and toes.",
    icon: Footprints,
    color: "text-violet-500 bg-violet-500/10",
    fullDescription: "Enjoy sandal season without worrying about toe or foot hair. Our foot treatment is quick, comfortable, and provides lasting smoothness. Perfect for anyone who wants picture-perfect feet year-round.",
    singlePrice: "$50",
    packagePrice: "$200",
  },
  {
    name: "Breasts",
    description: "Gentle and precise treatment for the chest area.",
    icon: Circle,
    color: "text-pink-400 bg-pink-400/10",
    fullDescription: "Our breast area laser treatment is performed with the utmost care and professionalism. This treatment addresses unwanted hair around the areola and breast tissue, providing smooth results. The Clarity II laser's precision ensures safe, effective treatment.",
    singlePrice: "$75",
    packagePrice: "$300",
  },
  {
    name: "Full Body",
    description: "Complete head-to-toe hair removal for smooth, lasting results.",
    icon: User,
    color: "text-emerald-500 bg-emerald-500/10",
    fullDescription: "Our comprehensive full body treatment covers all major areas from neck to toes. This package is ideal for those seeking complete hair-free smoothness. We'll create a customized treatment plan based on your specific needs and goals.",
    singlePrice: "$1,200",
    packagePrice: "$4,800",
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
                Laser Hair Removal Aftercare
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Apply cool compresses to soothe pain and minimize swelling; hold for 5–10 minutes several times a day.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Wear loose-fitting clothing on the day of treatment to avoid friction on treated areas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Use only cool or lukewarm water for 48 hours; avoid hot showers or baths.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Avoid sun exposure, saunas and hot baths for several days; if outdoors, apply SPF 30+ sunscreen.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Avoid tanning lotions and fragranced lotions for 48 hours.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Do not rub, scratch, scrub, tweeze, wax or apply pressure to the treated area; avoid body scrubs for 48 hours.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Avoid swimming pools, lakes or oceans for at least 48 hours.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Avoid cosmetic treatments (chemical peels, IPL, microdermabrasion) on the treated area for two weeks.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">•</span>
                  <span>Contact your medical provider if you experience burns, blisters, skin discoloration, swelling lasting more than three days, uncontrolled pain, or signs of infection.</span>
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
