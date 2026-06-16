import { useLocation } from "react-router-dom";
import SpecialsPopup from "@/components/SpecialsPopup";

// Routes where the popup should NOT appear
const EXCLUDED_PREFIXES = ["/admin", "/unsubscribe", "/booking"];

const GlobalSpecialsPopup = () => {
  const { pathname } = useLocation();
  if (EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))) return null;
  return <SpecialsPopup />;
};

export default GlobalSpecialsPopup;
