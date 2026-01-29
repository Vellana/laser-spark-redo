import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import SEO from "@/components/SEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";

type TabType = "office" | "exterior" | "beforeAfter";

const Gallery = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as TabType | null;
  const [activeTab, setActiveTab] = useState<TabType>(
    tabFromUrl && ["office", "exterior", "beforeAfter"].includes(tabFromUrl) 
      ? tabFromUrl 
      : "office"
  );

  useEffect(() => {
    if (tabFromUrl && ["office", "exterior", "beforeAfter"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

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
                <div className="animate-in fade-in duration-300">
                  <BeforeAfterGallery />
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
