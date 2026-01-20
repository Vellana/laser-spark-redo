import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import interiorReception from "@/assets/interior-reception.jpg";
import interiorWaiting from "@/assets/interior-waiting.jpg";
import interiorTreatmentRoom from "@/assets/interior-treatment-room.jpg";
import interiorConsultation from "@/assets/interior-consultation.jpg";
import interiorLaserRoom from "@/assets/interior-laser-room.jpg";
import exteriorBuilding1 from "@/assets/exterior-building-1.jpg";
import exteriorBuilding2 from "@/assets/exterior-building-2.jpg";
import { useState } from "react";
import SEO from "@/components/SEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const Gallery = () => {
  const [activeTab, setActiveTab] = useState<"office" | "exterior" | "beforeAfter">("office");

  const galleryImages = {
    office: [
      { src: interiorReception, alt: "Virginia Laser Specialists welcoming reception area with modern decor" },
      { src: interiorWaiting, alt: "Comfortable waiting area at Virginia Laser Specialists in Tysons" },
      { src: interiorTreatmentRoom, alt: "Professional laser treatment room with advanced equipment" },
      { src: interiorConsultation, alt: "Private consultation room for discussing laser treatment options" },
      { src: interiorLaserRoom, alt: "State-of-the-art laser room featuring Lutronic Clarity II technology" },
    ],
    exterior: [
      { src: exteriorBuilding1, alt: "Virginia Laser Specialists building exterior in Tysons, VA" },
      { src: exteriorBuilding2, alt: "Entrance to Virginia Laser Specialists office building" },
    ],
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Photo Gallery | Virginia Laser Specialists Facility Tysons VA"
        description="Tour our modern laser treatment facility at 8100 Boone Blvd, Vienna VA. State-of-the-art Lutronic Clarity II & Cartessa Tetra Pro equipment. Professional treatment rooms near Tysons Corner. Schedule a visit today."
        canonicalUrl="/gallery"
      />
      <LocalBusinessSchema />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Gallery", url: "/gallery" }
      ]} />
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
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
                <div className="text-center py-20 animate-in fade-in duration-300">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
                      Before & After Gallery
                    </h3>
                    <p className="text-2xl font-semibold text-accent">
                      COMING SOON!
                    </p>
                    <p className="text-lg text-muted-foreground">
                      We're working on compiling amazing results from our clients. Check back soon to see the transformative power of our laser treatments.
                    </p>
                  </div>
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
