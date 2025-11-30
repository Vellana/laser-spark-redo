import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import aboutFacility from "@/assets/about-facility.avif";
import { useState } from "react";

const Gallery = () => {
  const [activeTab, setActiveTab] = useState<"office" | "exterior" | "beforeAfter">("office");

  const galleryImages = {
    office: [
      { src: aboutFacility, alt: "Treatment Room" },
      { src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068", alt: "Reception Area" },
      { src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053", alt: "Waiting Lounge" },
    ],
    exterior: [
      { src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070", alt: "Building Exterior" },
      { src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070", alt: "Entrance" },
    ],
    beforeAfter: [
      { src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070", alt: "Laser Treatment Results" },
      { src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070", alt: "Skin Treatment Progress" },
    ],
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Gallery
              </h1>
              <p className="text-lg text-muted-foreground">
                Explore our state-of-the-art facility and treatment results
              </p>
            </div>

            {/* Custom Button Selector */}
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
              <button
                onClick={() => setActiveTab("office")}
                className={`px-6 py-3 text-base font-semibold rounded-lg border-2 transition-all duration-300 ${activeTab === "office"
                    ? "border-accent bg-accent/10 text-accent shadow-md"
                    : "border-border/50 bg-transparent text-muted-foreground hover:border-accent/50 hover:text-accent"
                  }`}
              >
                Our Office
              </button>
              <button
                onClick={() => setActiveTab("exterior")}
                className={`px-6 py-3 text-base font-semibold rounded-lg border-2 transition-all duration-300 ${activeTab === "exterior"
                    ? "border-accent bg-accent/10 text-accent shadow-md"
                    : "border-border/50 bg-transparent text-muted-foreground hover:border-accent/50 hover:text-accent"
                  }`}
              >
                Building Exterior
              </button>
              <button
                onClick={() => setActiveTab("beforeAfter")}
                className={`px-6 py-3 text-base font-semibold rounded-lg border-2 transition-all duration-300 ${activeTab === "beforeAfter"
                    ? "border-accent bg-accent/10 text-accent shadow-md"
                    : "border-border/50 bg-transparent text-muted-foreground hover:border-accent/50 hover:text-accent"
                  }`}
              >
                Before & After
              </button>
            </div>

            {/* Gallery Content */}
            <div className="max-w-6xl mx-auto">
              {activeTab === "office" && (
                <div className="grid md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                  {galleryImages.office.map((image, index) => (
                    <Card key={index} className="overflow-hidden group cursor-pointer">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === "exterior" && (
                <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                  {galleryImages.exterior.map((image, index) => (
                    <Card key={index} className="overflow-hidden group cursor-pointer">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === "beforeAfter" && (
                <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                  {galleryImages.beforeAfter.map((image, index) => (
                    <Card key={index} className="overflow-hidden group cursor-pointer">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
