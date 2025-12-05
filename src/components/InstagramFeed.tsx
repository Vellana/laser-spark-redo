import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const InstagramFeed = () => {
  // Mock Instagram posts with real captions and images from Virginia Laser Specialists
  const instagramPosts = [
    {
      url: "https://www.instagram.com/p/DRkLZxZkySz/",
      image: "/instagram/post-special-event.jpg",
      caption: "Join us for an exclusive special event! 🎉 From December 2nd through December 24th, visit our website to book a NEW CLIENT consultation and receive a complimentary FREE area...",
      date: "Dec 2024",
    },
    {
      url: "https://www.instagram.com/p/DRfKXwFE_1F/",
      image: "/instagram/post-hair-cycles.jpg",
      caption: "Did You Know? 💡 Hair growth happens in cycles, which is why multiple laser hair removal sessions are necessary for optimal results! Here's the breakdown of the 3 phases...",
      date: "Nov 2024",
    },
    {
      url: "https://www.instagram.com/p/DRe2VlJkSv8/",
      image: "/instagram/post-thanksgiving.jpg",
      caption: "Happy Thanksgiving from VLS! 🧡 To our amazing clients: Thank you for your continued trust and support. We are truly grateful for you! Wishing you a wonderful holiday...",
      date: "Nov 2024",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-6">
          <div className="flex justify-center items-center gap-3">
            <Instagram className="w-8 h-8 text-accent" />
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Follow Our Journey
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See our latest treatments, results, and behind-the-scenes moments on Instagram
          </p>
          <a
            href="https://www.instagram.com/virginialaserspecialists?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              size="lg"
              variant="accent"
              className="font-semibold px-6 sm:px-8 shadow-lg transition-all hover:scale-105"
            >
              <Instagram className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Follow </span>@virginialaserspecialists
            </Button>
          </a>
        </div>

        {/* Mock Instagram Grid with Real Captions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {instagramPosts.map((post, index) => (
            <a
              key={index}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={post.image}
                  alt={`Instagram post ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Caption Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="text-white">
                  <p className="text-sm leading-relaxed line-clamp-4 mb-3">
                    {post.caption}
                  </p>
                  <div className="flex items-center justify-between text-xs opacity-80">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                      </svg>
                    </div>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>

              {/* Instagram Icon Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                <Instagram className="w-5 h-5 text-purple-600" />
              </div>

              {/* Border Gradient Effect */}
              <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-purple-500/50 transition-all duration-300" />
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Click on any post to view the full content on Instagram
          </p>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
