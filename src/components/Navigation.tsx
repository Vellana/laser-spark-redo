import { useState } from "react";
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
    { name: "Resurfacing", href: "/laser-skin-resurfacing" },
    { name: "Hair Removal", href: "/laser-hair-removal" },
    { name: "Specials", href: "/specials" },
    { name: "Pricing", href: "/pricing" },
    { name: "Financing", href: "/#cherry-financing" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return location.pathname === href;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const elementId = href.substring(2);
      if (location.pathname === "/") {
        const element = document.getElementById(elementId);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(elementId);
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      setIsOpen(false);
    }
  };

  const linkClass = (href: string) =>
    `py-2 text-[11px] md:text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
      isActive(href)
        ? "text-accent"
        : "text-foreground/80 hover:text-accent"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-soft">
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8">
        <div className="flex items-center h-14 md:h-16 lg:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 mr-3 md:mr-4 lg:mr-6">
            <img src={logo} alt="Virginia Laser Specialists Logo" className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
            <span className="hidden sm:block text-xs md:text-sm lg:text-base font-bold text-accent whitespace-nowrap">
              VA Laser
            </span>
          </Link>

          {/* Desktop Nav Links — md+ (768px) */}
          <div className="hidden md:flex items-center gap-[2px] lg:gap-1 xl:gap-2 2xl:gap-3 flex-1 justify-center">
            {navLinks.map((link) =>
              link.href.startsWith("/#") ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={linkClass(link.href)}
                >
                  {link.name}
                </a>
              ) : (
                <Link key={link.name} to={link.href} className={linkClass(link.href)}>
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* CTA + Theme — md+ */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2 flex-shrink-0 ml-3 md:ml-4 lg:ml-6">
            <ThemeToggle />
            <Link to="/book-free-consultation" onClick={() => pushEvent("free_consult_booking")}>
              <Button
                variant="accent"
                className="animate-pulse-subtle text-[10px] md:text-xs lg:text-sm px-2.5 md:px-3 lg:px-5 py-1.5 md:py-2 lg:py-2.5 h-auto"
              >
                <span className="hidden lg:inline">Book Free Consultation</span>
                <span className="lg:hidden">Book Now</span>
              </Button>
            </Link>
          </div>

          {/* Mobile — <md */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <ThemeToggle />
            <Link to="/book-free-consultation" onClick={() => pushEvent("free_consult_booking")}>
              <Button variant="accent" className="text-xs px-3 py-1.5 h-auto">
                Book Now
              </Button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div className="md:hidden py-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-border">
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
                  className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(link.href)
                      ? "text-accent bg-secondary/30"
                      : "text-foreground hover:text-accent hover:bg-secondary/50"
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
