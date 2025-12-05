import { Facebook, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt="Virginia Laser Specialists Logo" 
                className="w-10 h-10"
              />
              <span className="text-lg font-bold text-foreground">
                Virginia Laser Specialists
              </span>
            </div>
            <p className="text-muted-foreground">
              Expert laser treatments in a space where all are welcome.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Laser Skin Resurfacing", href: "#cool-peel" },
                { name: "Laser Hair Removal", href: "#laser-hair-removal" },
                { name: "Specials", href: "/specials" },
                { name: "Pricing", href: "/pricing" },
                { name: "Gallery", href: "/gallery" },
                { name: "About", href: "#about" },
                { name: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect With Us</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>8100 Boone Blvd, Suite 270</p>
              <p>Vienna, VA 22182</p>
              <p>
                <a href="tel:703-547-4499" className="hover:text-accent transition-colors">
                  703-547-4499
                </a>
              </p>
              <p className="text-sm">Tue-Fri: 10am-6pm | Sat: 9am-1pm</p>
              <div className="flex gap-4 pt-2">
                <a
                  href="https://www.facebook.com/profile.php?id=61573588844302"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-accent hover:text-primary transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/virginialaserspecialists?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-accent hover:text-primary transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p>
            © {currentYear} Virginia Laser Specialists. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
