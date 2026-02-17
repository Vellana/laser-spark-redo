import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { pushEvent } from "@/lib/analytics";

const POPUP_DISMISSED_KEY = "specials_popup_dismissed";
const SESSION_EMAIL_KEY = "vls_user_email";
const emailSchema = z.string().trim().email("Please enter a valid email").max(255);

const SpecialsPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(POPUP_DISMISSED_KEY);
    if (dismissed) {
      // Check if they already subscribed — show "welcome back" instead of hiding entirely
      const savedEmail = sessionStorage.getItem(SESSION_EMAIL_KEY);
      if (savedEmail) return; // Already saw welcome back this session

      // Still show after delay but only if they previously subscribed (not just dismissed)
      const wasSubscriber = localStorage.getItem("vls_subscribed_email");
      if (!wasSubscriber) return; // Just dismissed, don't show again

      const timer = setTimeout(() => {
        setIsReturning(true);
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    localStorage.setItem(POPUP_DISMISSED_KEY, "true");
    if (isReturning) {
      // Mark that we showed welcome back this session
      sessionStorage.setItem("vls_welcome_back_shown", "true");
    }
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
      // Capture UTMs
      const utmParams: Record<string, string> = {};
      const sp = new URLSearchParams(window.location.search);
      for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
        const v = sp.get(key);
        if (v) utmParams[key] = v;
      }

      // Try to insert — if duplicate, the unique constraint will catch it
      const { error } = await supabase.from("email_leads").insert({
        email: result.data,
        source: "specials_popup",
        ...utmParams,
      } as any);

      if (error && error.code === "23505") {
        // Already subscribed — show welcome back, don't send another discount email
        sessionStorage.setItem(SESSION_EMAIL_KEY, result.data);
        localStorage.setItem(POPUP_DISMISSED_KEY, "true");
        localStorage.setItem("vls_subscribed_email", result.data);
        setIsReturning(true);
        setIsSubmitting(false);
        return;
      }

      if (error) throw error;

      // Send confirmation email only for NEW subscribers
      const res = await supabase.functions.invoke("send-newsletter-confirmation", {
        body: { email: result.data },
      });
      
      if (res.error) console.error("Email send error:", res.error);

      // Store email in session for auto-fill and mark as subscribed
      sessionStorage.setItem(SESSION_EMAIL_KEY, result.data);
      localStorage.setItem(POPUP_DISMISSED_KEY, "true");
      localStorage.setItem("vls_subscribed_email", result.data);

      setIsSubscribed(true);
      pushEvent("email_signup_submitted", { source: "specials_popup" });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  // Returning subscriber view
  if (isReturning) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="relative bg-card border border-border rounded-2xl shadow-lg max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Welcome Back! 👋
            </h3>
            <p className="text-foreground">
              Great to see you again! Don't forget — your <span className="text-accent font-bold">10% discount</span> is still available.
            </p>
            <div className="bg-accent/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Your discount code:</p>
              <p className="text-2xl font-bold text-accent tracking-widest">VLS10</p>
              <p className="text-xs text-muted-foreground mt-1">Mention this code when booking or at your appointment</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/book-free-consultation" className="flex-1">
                <Button variant="accent" className="w-full" onClick={handleClose}>
                  Book Consultation
                </Button>
              </Link>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Continue Browsing
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Newsletter Signup */}
          {!isSubscribed ? (
            <div className="border-t border-border pt-4 mt-4 space-y-3">
              <p className="text-sm font-medium text-foreground">
                Get <span className="text-accent font-bold">10% off</span> your next service when you join our email list!
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
            <div className="border-t border-border pt-4 mt-4 space-y-2">
              <p className="text-sm font-medium text-accent">
                ✓ You're signed up! Check your email for your discount.
              </p>
              <div className="bg-accent/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Your discount code:</p>
                <p className="text-2xl font-bold text-accent tracking-widest">VLS10</p>
                <p className="text-xs text-muted-foreground mt-1">Mention this code when booking or at your appointment</p>
              </div>
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
