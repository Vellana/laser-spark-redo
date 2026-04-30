import { useState, useEffect } from "react";

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

interface ActiveSpecial {
  id: string;
  title: string;
  body: string;
  highlight_text: string | null;
  disclaimer: string | null;
  image_urls: string[] | null;
}

const SpecialsPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [special, setSpecial] = useState<ActiveSpecial | null>(null);

  useEffect(() => {
    const load = async () => {
      // Fetch the single active special
      const { data } = await supabase
        .from("specials")
        .select("id, title, body, highlight_text, disclaimer, image_urls")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .limit(1);

      const activeSpecial = (data as ActiveSpecial[] | null)?.[0] ?? null;
      if (!activeSpecial) return; // No active special, don't show popup

      setSpecial(activeSpecial);

      const dismissed = localStorage.getItem(POPUP_DISMISSED_KEY);
      if (dismissed) {
        const savedEmail = sessionStorage.getItem(SESSION_EMAIL_KEY);
        if (savedEmail) return;
        const wasSubscriber = localStorage.getItem("vls_subscribed_email");
        if (!wasSubscriber) return;
        setTimeout(() => { setIsReturning(true); setIsVisible(true); }, 3000);
        return;
      }

      setTimeout(() => setIsVisible(true), 3000);
    };
    load();
  }, []);

  const handleClose = () => {
    localStorage.setItem(POPUP_DISMISSED_KEY, "true");
    if (isReturning) sessionStorage.setItem("vls_welcome_back_shown", "true");
    setIsVisible(false);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = emailSchema.safeParse(email);
    if (!result.success) { toast.error(result.error.errors[0].message); return; }

    setIsSubmitting(true);
    try {
      const utmParams: Record<string, string> = {};
      const sp = new URLSearchParams(window.location.search);
      for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
        const v = sp.get(key);
        if (v) utmParams[key] = v;
      }

      const { error } = await supabase.from("email_leads").insert({
        email: result.data,
        source: "specials_popup",
        ...utmParams,
      } as any);

      if (error && error.code === "23505") {
        sessionStorage.setItem(SESSION_EMAIL_KEY, result.data);
        localStorage.setItem(POPUP_DISMISSED_KEY, "true");
        localStorage.setItem("vls_subscribed_email", result.data);
        setIsReturning(true);
        setIsSubmitting(false);
        return;
      }
      if (error) throw error;

      // Also add to the email_subscribers list (reactivates if previously opted out)
      await supabase.rpc("subscribe_email", {
        p_email: result.data,
        p_source: "specials_popup",
      });

      const res = await supabase.functions.invoke("send-newsletter-confirmation", {
        body: { email: result.data },
      });
      if (res.error) console.error("Email send error:", res.error);

      sessionStorage.setItem(SESSION_EMAIL_KEY, result.data);
      localStorage.setItem(POPUP_DISMISSED_KEY, "true");
      localStorage.setItem("vls_subscribed_email", result.data);
      setIsSubscribed(true);
      pushEvent("email_signup", { email: result.data, source: "specials_popup" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible || !special) return null;

  // Returning subscriber view
  if (isReturning) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="relative bg-card border border-border rounded-2xl shadow-lg max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Welcome Back! 👋</h3>
            <p className="text-foreground">
              Great to see you again! Don't forget - your <span className="text-accent font-bold">10% discount</span> is still available.
            </p>
            <div className="bg-accent/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Your discount code:</p>
              <p className="text-2xl font-bold text-accent tracking-widest">VLS10</p>
              <p className="text-xs text-muted-foreground mt-1">Mention this code when booking or at your appointment</p>
              <p className="text-xs text-muted-foreground/60 mt-1">*Cannot be combined with other offers.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/book-free-consultation" className="flex-1">
                <Button variant="accent" className="w-full" onClick={handleClose}>Book Consultation</Button>
              </Link>
              <Button variant="outline" className="flex-1" onClick={handleClose}>Continue Browsing</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-card border border-border rounded-2xl shadow-lg max-w-md w-full p-8 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">{special.title}</h3>

          {special.body && (
            <div
              className="text-foreground prose prose-sm max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_a]:text-accent [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
              dangerouslySetInnerHTML={{ __html: special.body }}
            />
          )}

          {special.highlight_text && (
            <p className="text-xl font-bold text-accent">{special.highlight_text}</p>
          )}

          {special.image_urls && special.image_urls.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {special.image_urls.map((url, idx) => (
                <img key={idx} src={url} alt={`${special.title} promotional image`} className="max-w-full rounded-lg shadow-md max-h-48 object-cover" loading="lazy" />
              ))}
            </div>
          )}

          {special.disclaimer && (
            <p className="text-xs text-muted-foreground italic">{special.disclaimer}</p>
          )}

          {/* Newsletter Signup */}
          {!isSubscribed ? (
            <div className="border-t border-border pt-4 mt-4 space-y-3">
              <p className="text-sm font-medium text-foreground">
                Get <span className="text-accent font-bold">10% off</span> your next service when you join our email list!
                <span className="block text-xs text-muted-foreground mt-1">*Cannot be combined with other offers.</span>
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-1" aria-label="Email for newsletter" />
                <Button type="submit" variant="accent" disabled={isSubmitting} size="sm">{isSubmitting ? "..." : "Sign Up"}</Button>
              </form>
            </div>
          ) : (
            <div className="border-t border-border pt-4 mt-4 space-y-2">
              <p className="text-sm font-medium text-accent">✓ You're signed up! Check your email for your discount.</p>
              <div className="bg-accent/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Your discount code:</p>
                <p className="text-2xl font-bold text-accent tracking-widest">VLS10</p>
                <p className="text-xs text-muted-foreground mt-1">Mention this code when booking or at your appointment</p>
                <p className="text-xs text-muted-foreground/60 mt-1">*Cannot be combined with other offers.</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/specials" className="flex-1">
              <Button variant="accent" className="w-full" onClick={handleClose}>View Specials</Button>
            </Link>
            <Button variant="outline" className="flex-1" onClick={handleClose}>Maybe Later</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialsPopup;
