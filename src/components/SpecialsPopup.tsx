import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const POPUP_DISMISSED_KEY = "specials_popup_dismissed";
const emailSchema = z.string().trim().email("Please enter a valid email").max(255);

const SpecialsPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(POPUP_DISMISSED_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    localStorage.setItem(POPUP_DISMISSED_KEY, "true");
    setIsVisible(false);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("email_leads").insert({
        email: result.data,
        source: "specials_popup",
      });

      if (error) {
        if (error.code === "23505") {
          toast.info("You're already subscribed!");
        } else {
          throw error;
        }
      }

      // Send confirmation email
      const res = await supabase.functions.invoke("send-newsletter-confirmation", {
        body: { email: result.data },
      });
      
      if (res.error) console.error("Email send error:", res.error);

      // Update confirmation_sent
      await supabase
        .from("email_leads")
        .update({ confirmation_sent: true })
        .eq("email", result.data);

      setIsSubscribed(true);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            Winter Special!
          </h3>

          <p className="text-foreground font-semibold">
            Buy any laser hair removal package of 5 treatments, get a 6th treatment free!
          </p>
          
          <p className="text-xl font-bold text-accent">
            Value of up to $1,800!
          </p>

          <p className="text-xs text-muted-foreground italic">
            *Free treatment must be same area as package. Cannot be combined with any other offers. Offer expires 1/31/26.
          </p>

          {/* Newsletter Signup */}
          {!isSubscribed ? (
            <div className="border-t border-border pt-4 mt-4 space-y-3">
              <p className="text-sm font-medium text-foreground">
                Sign up for our newsletter for a <span className="text-accent font-bold">5% discount</span> on your first service!
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                  aria-label="Email for newsletter"
                />
                <Button type="submit" variant="accent" disabled={isSubmitting} size="sm">
                  {isSubmitting ? "..." : "Sign Up"}
                </Button>
              </form>
            </div>
          ) : (
            <div className="border-t border-border pt-4 mt-4">
              <p className="text-sm font-medium text-accent">
                ✓ You're signed up! Check your email for your 5% discount.
              </p>
            </div>
          )}

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
