import { Card } from "@/components/ui/card";
import { Instagram } from "lucide-react";
import instagramLogo from "@/assets/instagram-logo.webp";

const InstagramFeed = () => {
  const instagramPosts = [
    { id: 1, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=400", alt: "Treatment result" },
    { id: 2, image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400", alt: "Laser treatment" },
    { id: 3, image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=400", alt: "Skincare" },
    { id: 4, image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=400", alt: "Facility" },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center items-center gap-3">
            <Instagram className="w-8 h-8 text-accent" />
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Follow Us on Instagram
            </h2>
          </div>
          <a
            href="https://www.instagram.com/virginialaserspecialists/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium"
          >
            @virginialaserspecialists
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href="https://www.instagram.com/virginialaserspecialists/"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="overflow-hidden cursor-pointer border-accent/20 hover:border-accent/50 transition-all">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                    <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
