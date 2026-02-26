import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "CoolPeel", href: "/coolpeel-co2-laser-tysons-va" },
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
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6 xl:px-8 2xl:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo - pushed to left */}
          <a href="/" className="flex items-center space-x-3 flex-shrink-0">
            <img
              src={logo}
              alt="Virginia Laser Specialists Logo"
              className="w-10 h-10"
            />
            <span className="text-lg xl:text-xl font-bold text-accent">
              Virginia Laser Specialists
            </span>
          </a>

          {/* Desktop Navigation - centered with even spacing */}
          <div className="hidden xl:flex items-center justify-center flex-1 min-w-0 mx-4 xl:mx-6 2xl:mx-10">
            <div className="flex items-center gap-0.5 xl:gap-2 2xl:gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-1.5 xl:px-2 2xl:px-3 py-2 text-xs xl:text-sm 2xl:text-base font-medium text-foreground hover:text-accent transition-colors rounded-lg hover:bg-secondary/50 text-center whitespace-nowrap"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop CTA - pushed to right */}
          <div className="hidden xl:flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <a href="/book-free-consultation">
              <Button
                variant="accent"
                className="animate-pulse-subtle px-4 xl:px-5 2xl:px-6 py-2.5 2xl:py-3 text-sm xl:text-sm 2xl:text-base"
              >
                Book Free Consultation
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
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
          <div className="xl:hidden py-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
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
            <div className="pt-4 space-y-3">
              <a href="/book-free-consultation" className="block">
                <Button variant="accent" className="w-full py-3 text-base">
                  Book Free Consultation
                </Button>
              </a>
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
