import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import flyerImage from "@/assets/mothers-day-flyer.jpg";

const DISMISS_KEY = "vls_mothersday_dismissed";
const RSVP_URL = "https://www.eventbrite.com/e/1988100200217?aff=oddtdtcreator";

const MothersDayPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    const t = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/90 backdrop-blur hover:bg-secondary transition-colors shadow-md"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>

        {/* Hero Flyer Image with floating CTA */}
        <div className="relative">
          <img
            src={flyerImage}
            alt="Mother's Day Blossoms event flyer"
            className="w-full h-auto object-cover flex-shrink-0"
          />
          <a
            href={RSVP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="absolute bottom-4 left-1/2 -translate-x-1/2"
          >
            <Button
              variant="accent"
              size="lg"
              className="shadow-2xl shadow-black/40 animate-pulse-subtle font-semibold whitespace-nowrap"
            >
              Book Now
            </Button>
          </a>
        </div>

        {/* Copy block */}
        <div className="px-5 py-4 text-center space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">Special Event</p>
          <h3 className="text-xl font-bold text-foreground leading-tight">Mother's Day Blossoms</h3>
          <p className="text-sm font-medium text-muted-foreground">May 4 to 7</p>
          <p className="text-sm text-foreground">
            Treat Mom or treat yourself to exclusive event-only specials at VLS.
          </p>
          <a href={RSVP_URL} target="_blank" rel="noopener noreferrer" className="block pt-1">
            <Button variant="accent" className="w-full" onClick={handleClose}>
              RSVP on Eventbrite
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MothersDayPopup;
