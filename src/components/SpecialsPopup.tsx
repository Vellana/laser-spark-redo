import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const POPUP_SHOWN_KEY = "specials_popup_shown";

const SpecialsPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if popup has already been shown this session
    const hasBeenShown = sessionStorage.getItem(POPUP_SHOWN_KEY);
    
    if (hasBeenShown) {
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem(POPUP_SHOWN_KEY, "true");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-card border border-border rounded-2xl shadow-lg max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>

          <h3 className="text-2xl font-bold text-foreground">
            Special Offers Available!
          </h3>

          <p className="text-muted-foreground">
            Check out our current promotions and seasonal specials on laser treatments.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/specials" className="flex-1">
              <Button variant="accent" className="w-full" onClick={handleClose}>
                View Specials
              </Button>
            </Link>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialsPopup;
