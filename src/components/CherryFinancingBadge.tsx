import { CreditCard } from "lucide-react";
import cherryLogo from "@/assets/cherry-logo.png";

interface CherryFinancingBadgeProps {
  className?: string;
  variant?: "inline" | "card";
}

const CherryFinancingBadge = ({ className = "", variant = "inline" }: CherryFinancingBadgeProps) => {
  if (variant === "card") {
    return (
      <div className={`bg-secondary/50 border border-border rounded-lg p-4 flex items-center gap-3 ${className}`}>
        <img src={cherryLogo} alt="Cherry Financing" className="h-8 w-auto" />
        <div>
          <p className="text-sm font-medium text-foreground">Financing Available</p>
          <p className="text-xs text-muted-foreground">Flexible payment plans through Cherry</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 ${className}`}>
      <CreditCard className="w-4 h-4 text-accent" />
      <span className="text-sm font-medium text-foreground">Cherry financing available</span>
    </div>
  );
};

export default CherryFinancingBadge;
