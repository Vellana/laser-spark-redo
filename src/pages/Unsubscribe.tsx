import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, MailX } from "lucide-react";

const emailSchema = z.string().trim().email("Please enter a valid email").max(255);

const Unsubscribe = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.rpc("unsubscribe_email", { p_email: parsed.data });
    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again or call 703-547-4499.");
      return;
    }
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Unsubscribe | Virginia Laser Specialists"
        description="Unsubscribe from Virginia Laser Specialists email communications."
        canonicalUrl="/unsubscribe"
      />
      <Navigation />

      <main className="pt-28 sm:pt-32 pb-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-2xl shadow-soft p-8 sm:p-10">
            {!done ? (
              <>
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <MailX className="w-7 h-7 text-accent" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    Unsubscribe
                  </h1>
                  <p className="text-muted-foreground">
                    Enter your email below to stop receiving promotional and newsletter emails from Virginia Laser Specialists.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" variant="accent" className="w-full" disabled={submitting}>
                    {submitting ? "Unsubscribing..." : "Unsubscribe"}
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-6">
                  Appointment confirmations and reminders are transactional and will continue.
                </p>
              </>
            ) : (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-accent" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  You've been unsubscribed
                </h1>
                <p className="text-muted-foreground">
                  You will no longer receive promotional emails from Virginia Laser Specialists. We're sorry to see you go.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Unsubscribe;
