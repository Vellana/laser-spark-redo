import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const DISMISS_KEY = "vls_mothersday_dismissed";
const RSVP_URL = "https://www.eventbrite.com/e/1988100200217?aff=oddtdtcreator";
// TODO: Julien - swap this in for the final flyer file if needed. Pulled from Eventbrite cover image.
const FLYER_IMAGE =
  "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F1182896203%2F2999698406367%2F1%2Foriginal.20260423-172440?w=1024&auto=format%2Ccompress&q=75&sharp=10";

const MothersDayPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [imgError, setImgError] = useState(false);

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
      <div className="relative bg-card border border-border rounded-2xl shadow-lg w-full max-w-md max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 backdrop-blur hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Hero Flyer Image - dominant visual */}
        <div className="w-full aspect-[4/5] sm:aspect-[3/4] bg-gradient-to-br from-accent/30 via-primary/20 to-accent/40 flex items-center justify-center overflow-hidden flex-shrink-0">
          {!imgError ? (
            <img
              src={FLYER_IMAGE}
              alt="Mother's Day Blossoms event flyer"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            // TODO: Julien - replace with real flyer file when available
            <div className="text-center px-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Special Event</p>
              <p className="text-3xl font-bold text-primary">Mother's Day Blossoms</p>
              <p className="text-sm text-primary/80 mt-2">May 4 to 7</p>
            </div>
          )}
        </div>

        {/* Copy block */}
        <div className="p-6 text-center space-y-3 overflow-y-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Special Event</p>
          <h3 className="text-2xl font-bold text-foreground">Mother's Day Blossoms</h3>
          <p className="text-sm font-medium text-muted-foreground">May 4 to 7</p>
          <p className="text-sm text-foreground">
            Treat Mom or treat yourself - exclusive event-only specials at VLS.
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
