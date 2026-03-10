import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { pushEvent } from "@/lib/analytics";

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
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img
              src={logo}
              alt="Virginia Laser Specialists Logo"
              className="w-9 h-9 lg:w-10 lg:h-10"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm sm:text-base lg:text-lg font-bold text-accent whitespace-nowrap">
                Virginia Laser Specialists
              </span>
            </div>
          </Link>

          {/* Desktop Navigation — visible at lg+ */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 2xl:gap-2.5 flex-1 justify-center mx-2 xl:mx-6">
            {navLinks.map((link) =>
              link.href.startsWith("/#") ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-1.5 xl:px-2.5 2xl:px-3 py-1.5 text-[11px] lg:text-xs xl:text-sm 2xl:text-base font-medium text-foreground hover:text-accent transition-colors rounded-md hover:bg-secondary/50 whitespace-nowrap"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-1.5 xl:px-2.5 2xl:px-3 py-1.5 text-[11px] lg:text-xs xl:text-sm 2xl:text-base font-medium text-foreground hover:text-accent transition-colors rounded-md hover:bg-secondary/50 whitespace-nowrap"
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Desktop CTA + Theme */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <Link to="/book-free-consultation" onClick={() => pushEvent("free_consult_booking")}>
              <Button
                variant="accent"
                className="animate-pulse-subtle px-3 xl:px-5 2xl:px-6 py-2 xl:py-2.5 text-xs xl:text-sm 2xl:text-base"
              >
                Book Free Consultation
              </Button>
            </Link>
          </div>

          {/* Mobile: CTA + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link to="/book-free-consultation" onClick={() => pushEvent("free_consult_booking")}>
              <Button variant="accent" size="sm" className="text-xs px-3 py-1.5">
                Book Now
              </Button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden py-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-border">
            {navLinks.map((link) =>
              link.href.startsWith("/#") ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    handleNavClick(e, link.href);
                    setIsOpen(false);
                  }}
                  className="block px-4 py-2.5 text-sm font-medium text-foreground hover:text-accent hover:bg-secondary/50 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-foreground hover:text-accent hover:bg-secondary/50 rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              )
            )}
            <div className="pt-3 px-4 flex items-center justify-between border-t border-border mt-2">
              <Link
                to="/book-free-consultation"
                className="flex-1 mr-3"
                onClick={() => { setIsOpen(false); pushEvent("free_consult_booking"); }}
              >
                <Button variant="accent" className="w-full py-2.5 text-sm">
                  Book Free Consultation
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
