import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const DISMISS_KEY = "vls_mothersday_dismissed";
const RSVP_URL = "https://www.eventbrite.com/e/1988100200217?aff=oddtdtcreator";

const MothersDayPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;
    const t = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-card border border-border rounded-2xl shadow-lg w-full max-w-md max-w-[90vw] p-8 animate-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
        <div className="text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Special Event</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground">Mother's Day Blossoms</h3>
          <p className="text-sm font-medium text-muted-foreground">May 4 to 7</p>
          <p className="text-foreground">
            Treat Mom or treat yourself - exclusive event-only specials at VLS.
          </p>
          <a href={RSVP_URL} target="_blank" rel="noopener noreferrer" className="block">
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
