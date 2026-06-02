import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles } from "lucide-react";

const STORAGE_KEY = "summer-presale-banner-dismissed";

const PromoBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) !== "1") setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  return (
    <div className="relative bg-gradient-to-r from-accent via-primary to-accent text-primary-foreground">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-center">
        <Sparkles className="h-4 w-4 flex-shrink-0 hidden sm:inline" aria-hidden />
        <Link
          to="/summer-presale"
          className="text-sm md:text-base font-medium hover:underline underline-offset-4"
        >
          <span className="font-semibold">Summer Pre-Sale:</span> Buy Now, Treat Later
          <span className="hidden sm:inline">: Limited Time June 7-20</span>
        </Link>
        <button
          onClick={dismiss}
          aria-label="Dismiss promotional banner"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-primary-foreground/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
