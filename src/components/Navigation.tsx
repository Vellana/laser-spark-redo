import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { pushEvent } from "@/lib/analytics";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const primaryLinks = [
    { name: "CoolPeel", href: "/coolpeel-co2-laser-tysons-va" },
    { name: "Skin Resurfacing", href: "/laser-skin-resurfacing" },
    { name: "Hair Removal", href: "/laser-hair-removal" },
    { name: "Specials", href: "/specials" },
    { name: "Pricing", href: "/pricing" },
  ];

  const secondaryLinks = [
    { name: "Financing", href: "/#cherry-financing" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const allLinks = [...primaryLinks, ...secondaryLinks];

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
      setMoreOpen(false);
    }
  };

  const NavLink = ({ link, className }: { link: { name: string; href: string }; className?: string }) => {
    const active = isActive(link.href);
    const baseClass = `${className ?? ""} ${active ? "text-accent border-b-2 border-accent" : "text-foreground hover:text-accent"}`;

    if (link.href.startsWith("/#")) {
      return (
        <a
          href={link.href}
          onClick={(e) => handleNavClick(e, link.href)}
          className={baseClass}
        >
          {link.name}
        </a>
      );
    }
    return (
      <Link to={link.href} className={baseClass}>
        {link.name}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-soft">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row: Logo + CTA */}
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img src={logo} alt="Virginia Laser Specialists Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="text-sm sm:text-base lg:text-lg font-bold text-accent whitespace-nowrap">
              Virginia Laser Specialists
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/book-free-consultation" onClick={() => pushEvent("free_consult_booking")}>
              <Button variant="accent" size="sm" className="text-xs sm:text-sm px-3 sm:px-4 animate-pulse-subtle">
                <span className="hidden sm:inline">Book Free Consultation</span>
                <span className="sm:hidden">Book Now</span>
              </Button>
            </Link>
            {/* Hamburger — only on very small screens */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
            </button>
          </div>
        </div>

        {/* Tab bar — visible sm+ (≥640px) */}
        <div className="hidden sm:flex items-center gap-0.5 md:gap-1 lg:gap-2 border-t border-border -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-hide">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.name}
              link={link}
              className="px-2 md:px-3 lg:px-4 py-2.5 text-xs md:text-sm font-medium transition-colors whitespace-nowrap"
            />
          ))}

          {/* More dropdown for secondary links */}
          <div className="relative ml-auto">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className="flex items-center gap-1 px-2 md:px-3 lg:px-4 py-2.5 text-xs md:text-sm font-medium text-foreground hover:text-accent transition-colors whitespace-nowrap"
            >
              More <ChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {secondaryLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    link={link}
                    className="block px-4 py-2.5 text-sm font-medium hover:bg-secondary/50 transition-colors"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile dropdown — <640px only */}
        {isOpen && (
          <div className="sm:hidden py-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-border">
            {allLinks.map((link) =>
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
                  className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive(link.href) ? "text-accent bg-secondary/30" : "text-foreground hover:text-accent hover:bg-secondary/50"}`}
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
