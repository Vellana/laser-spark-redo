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
    { name: "Skin Resurfacing", href: "/laser-skin-resurfacing" },
    { name: "Hair Removal", href: "/laser-hair-removal" },
    { name: "Specials", href: "/specials" },
    { name: "Pricing", href: "/pricing" },
    { name: "Financing", href: "/#cherry-financing" },
    { name: "Gallery", href: "/gallery" },
    { name: "FAQ", href: "/faq" },
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

  const renderLink = (link: { name: string; href: string }, className: string) => {
    const active = isActive(link.href);
    const activeClass = active ? "text-accent" : "text-foreground/80 hover:text-accent";
    const combined = `${className} ${activeClass}`;

    if (link.href.startsWith("/#")) {
      return (
        <a key={link.name} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className={combined}>
          {link.name}
        </a>
      );
    }
    return (
      <Link key={link.name} to={link.href} className={combined}>
        {link.name}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md shadow-soft">
      {/* Row 1: Logo + CTA */}
      <div className="border-b border-border">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <img src={logo} alt="Virginia Laser Specialists Logo" className="w-9 h-9 sm:w-10 sm:h-10" />
              <span className="text-sm sm:text-base lg:text-lg font-bold text-accent">
                Virginia Laser Specialists
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Link to="/book-free-consultation" onClick={() => pushEvent("free_consult_booking")}>
                <Button variant="accent" className="animate-pulse-subtle text-xs sm:text-sm px-3 sm:px-5 py-2 h-auto">
                  <span className="hidden sm:inline">Book Free Consultation</span>
                  <span className="sm:hidden">Book Now</span>
                </Button>
              </Link>
              {/* Hamburger - phone only */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="sm:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Nav links - sm+ (≥640px) */}
      <div className="hidden sm:block border-b border-border bg-card/80">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-1 md:gap-2 lg:gap-4 xl:gap-6">
            {navLinks.map((link) =>
              renderLink(
                link,
                "py-2.5 px-1.5 md:px-2 lg:px-3 text-xs md:text-sm lg:text-sm font-medium transition-colors whitespace-nowrap"
              )
            )}
          </div>
        </div>
      </div>

      {/* Mobile dropdown - <sm */}
      {isOpen && (
        <div className="sm:hidden bg-card border-b border-border py-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-[1920px] mx-auto px-4">
            {navLinks.map((link) =>
              link.href.startsWith("/#") ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    handleNavClick(e, link.href);
                    setIsOpen(false);
                  }}
                  className="block px-3 py-2.5 text-sm font-medium text-foreground hover:text-accent hover:bg-secondary/50 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(link.href) ? "text-accent bg-secondary/30" : "text-foreground hover:text-accent hover:bg-secondary/50"
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
