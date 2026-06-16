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
  image_position: "above" | "below" | "left" | "right" | null;
  primary_cta_label: string | null;
  primary_cta_url: string | null;
  secondary_cta_label: string | null;
  secondary_cta_url: string | null;
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
        .select("id, title, body, highlight_text, disclaimer, image_urls, image_position, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url")
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
              <p className="text-xs text-muted-foreground mt-1">*Cannot be combined with other offers.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="/booking"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="accent" className="w-full" onClick={handleClose}>Book Now</Button>
              </a>
              <Button variant="outline" className="flex-1" onClick={handleClose}>Continue Browsing</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const imagePosition = special.image_position || "above";
  const hasImages = !!(special.image_urls && special.image_urls.length > 0);
  const isSideLayout = hasImages && (imagePosition === "left" || imagePosition === "right");

  const imagesBlock = hasImages ? (
    <div className={`flex flex-wrap justify-center gap-3 ${isSideLayout ? "" : ""}`}>
      {special.image_urls!.map((url, idx) => (
        <img key={idx} src={url} alt={`${special.title} promotional image`} className="max-w-full rounded-lg shadow-md max-h-48 object-cover" loading="lazy" />
      ))}
    </div>
  ) : null;

  const textBlock = (
    <>
      {special.body && (
        <div
          className="prose prose-sm dark:prose-invert max-w-none text-foreground [&_*]:text-foreground [&_p]:text-foreground [&_li]:text-foreground [&_strong]:text-foreground [&_em]:text-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_a]:text-accent [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_hr]:border-border"
          dangerouslySetInnerHTML={{ __html: special.body }}
        />
      )}
      {special.highlight_text && (
        <p className="text-xl font-bold text-accent">{special.highlight_text}</p>
      )}
      {special.disclaimer && (
        <p className="text-xs text-muted-foreground italic">{special.disclaimer}</p>
      )}
    </>
  );

  const primaryLabel = special.primary_cta_label || "View Specials";
  const primaryUrl = special.primary_cta_url || "/specials";
  const secondaryLabel = special.secondary_cta_label || "";
  const secondaryUrl = special.secondary_cta_url || "";
  const isExternal = (u: string) => /^https?:\/\//i.test(u);

  const renderCta = (label: string, url: string, variant: "accent" | "outline") => {
    if (!label) return null;
    const btn = <Button variant={variant} className="w-full" onClick={handleClose}>{label}</Button>;
    if (!url) return <div className="flex-1">{<Button variant={variant} className="w-full" onClick={handleClose}>{label}</Button>}</div>;
    if (isExternal(url)) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1">{btn}</a>
      );
    }
    return <Link to={url} className="flex-1">{btn}</Link>;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 overscroll-contain">
      <div className="relative bg-card border border-border rounded-2xl shadow-lg max-w-md w-full p-5 sm:p-7 animate-in zoom-in-95 duration-300 max-h-[92vh] overflow-y-auto">
        <div className={isSideLayout ? "space-y-4" : "text-center space-y-4"}>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground text-center leading-tight">{special.title}</h3>

          {isSideLayout ? (
            <div className="flex flex-wrap gap-4 items-start text-left">
              {imagePosition === "left" && hasImages && <div className="flex-1 min-w-[120px]">{imagesBlock}</div>}
              <div className="flex-[2] min-w-[180px] space-y-3">{textBlock}</div>
              {imagePosition === "right" && hasImages && <div className="flex-1 min-w-[120px]">{imagesBlock}</div>}
            </div>
          ) : (
            <>
              {imagePosition === "above" && imagesBlock}
              {textBlock}
              {imagePosition === "below" && imagesBlock}
            </>
          )}

          {/* Newsletter Signup */}
          {!isSubscribed ? (
            <div className="border-t border-border pt-4 mt-4 space-y-3">
              <p className="text-sm font-medium text-foreground text-center">
                Get <span className="text-accent font-bold">10% off</span> your next service when you join our email list!
                <span className="block text-xs text-muted-foreground mt-1">*Cannot be combined with other offers.</span>
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-1" aria-label="Email for newsletter" />
                <Button type="submit" variant="accent" disabled={isSubmitting} size="sm">{isSubmitting ? "..." : "Sign Up"}</Button>
              </form>
            </div>
          ) : (
            <div className="border-t border-border pt-4 mt-4 space-y-2 text-center">
              <p className="text-sm font-medium text-accent">✓ You're signed up! Check your email for your discount.</p>
              <div className="bg-accent/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Your discount code:</p>
                <p className="text-2xl font-bold text-accent tracking-widest">VLS10</p>
                <p className="text-xs text-muted-foreground mt-1">Mention this code when booking or at your appointment</p>
                <p className="text-xs text-muted-foreground mt-1">*Cannot be combined with other offers.</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {renderCta(primaryLabel, primaryUrl, "accent")}
            {renderCta(secondaryLabel, secondaryUrl, "outline")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialsPopup;
