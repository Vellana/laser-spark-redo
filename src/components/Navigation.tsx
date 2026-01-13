import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "CoolPeel", href: "/services/coolpeel" },
    { name: "Laser Skin Resurfacing", href: "/laser-skin-resurfacing" },
    { name: "Laser Hair Removal", href: "/laser-hair-removal" },
    { name: "Specials", href: "/specials" },
    { name: "Pricing", href: "/pricing" },
    { name: "Financing", href: "/#cherry-financing" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const elementId = href.substring(2);
      
      if (location.pathname === "/") {
        // Already on home page, just scroll
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Navigate to home page first, then scroll
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo - pushed to left */}
          <a href="/" className="flex items-center space-x-3 flex-shrink-0">
            <img
              src={logo}
              alt="Virginia Laser Specialists Logo"
              className="w-10 h-10"
            />
            <span className="text-xl font-bold text-accent">
              Virginia Laser Specialists
            </span>
          </a>

          {/* Desktop Navigation - centered with spacing from edges */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-12">
            <div className="flex items-center gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-2 py-2 text-base font-medium text-foreground hover:text-accent transition-colors rounded-lg hover:bg-secondary/50 text-center whitespace-nowrap"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop CTA - pushed to right */}
          <div className="hidden lg:block flex-shrink-0">
            <a href="https://www.vagaro.com/virginialaserspecialists/services" target="_blank" rel="noopener noreferrer">
              <Button variant="accent" className="animate-pulse-subtle px-6 py-3 text-base">
                Book Now
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-4 py-3 text-base font-medium text-foreground hover:text-accent hover:bg-secondary/50 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2">
              <a href="https://www.vagaro.com/virginialaserspecialists/services" target="_blank" rel="noopener noreferrer">
                <Button variant="accent" className="w-full">
                  Book Now
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
