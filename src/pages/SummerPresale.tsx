import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import CherryFinancing from "@/components/CherryFinancing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink, Sparkles, Sun, Timer, Calendar, AlertTriangle } from "lucide-react";
import { pushEvent } from "@/lib/analytics";

const VAGARO_URL = "https://www.vagaro.com/virginialaserspecialists/services";

const BookNowButton = ({ className = "" }: { className?: string }) => (
  <a
    href={VAGARO_URL}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => pushEvent("free_consult_booking")}
    className={className}
  >
    <Button variant="accent" size="lg" className="w-full sm:w-auto">
      Book Now
      <ExternalLink className="w-4 h-4 ml-2" />
    </Button>
  </a>
);

const faqs = [
  {
    q: "What does \"Buy Now, Treat Later\" mean?",
    a: "Purchase your treatment package at exclusive pre-sale pricing between June 7-20, 2026, and redeem your sessions any time after — perfect for planning ahead without rushing your schedule.",
  },
  {
    q: "How do I book?",
    a: "Click any Book Now button to visit our Vagaro page and select your service. Pre-sale pricing is automatically applied during the promotion window.",
  },
  {
    q: "Is financing available?",
    a: "Yes. Cherry financing is available for all pre-sale packages — apply in under 30 seconds with no hard credit check and pay over time in flexible monthly installments.",
  },
  {
    q: "Which treatments are included?",
    a: "The Summer Pre-Sale covers Laser Hair Removal packages and CoolPeel CO2 laser resurfacing treatments. See each offer card above for details.",
  },
];

const SummerPresale = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Summer Pre-Sale: Buy Now, Treat Later | Virginia Laser Specialists"
        description="Exclusive Summer Pre-Sale June 7-20, 2026. Buy CoolPeel and Laser Hair Removal packages now at special pricing — treat later. Cherry financing available."
        canonicalUrl="/summer-presale"
      />
      <LocalBusinessSchema />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Specials", url: "/specials" },
          { name: "Summer Pre-Sale", url: "/summer-presale" },
        ]}
      />
      <Navigation />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/10 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent" />
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold uppercase tracking-wider animate-pulse">
                <Timer className="w-4 h-4" />
                Limited Time Only
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                Buy Now, Treat Later
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground">
                Exclusive Summer Pre-Sale — June 7-20, 2026
              </p>
              <div className="flex justify-center pt-2">
                <BookNowButton />
              </div>
            </div>
          </div>
        </section>

        {/* Offer cards */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {/* Laser Hair Removal */}
              <Card className="relative border-accent/40 shadow-xl flex flex-col overflow-hidden">
                {/* Limited time badge */}
                <div className="absolute top-0 right-0">
                  <div className="bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                    Limited Time
                  </div>
                </div>
                {/* Accent top border */}
                <div className="h-1.5 bg-gradient-to-r from-accent via-primary to-accent" />
                <CardContent className="p-8 flex flex-col flex-1 text-center md:text-left space-y-5">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-accent">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-semibold uppercase tracking-wide">Pre-Sale Offer</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Laser Hair Removal
                  </h2>
                  <p className="text-muted-foreground">
                    Stock up on smooth, hair-free skin with our Lutronic Clarity II dual-wavelength platform. Packages purchased during the pre-sale can be redeemed any time.
                  </p>
                  <div className="rounded-xl bg-gradient-to-br from-accent/10 to-secondary/40 border border-accent/20 px-4 py-5">
                    <p className="text-2xl font-bold text-foreground">[PRICING TBD]</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center md:justify-start gap-1">
                      <Calendar className="w-3 h-3" />
                      Pre-sale pricing available June 7-20, 2026
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Flexible monthly payments from $XX/mo through Cherry.
                  </p>
                  <div className="pt-2 mt-auto">
                    <BookNowButton />
                  </div>
                </CardContent>
              </Card>

              {/* CoolPeel */}
              <Card className="relative border-accent/40 shadow-xl flex flex-col overflow-hidden">
                {/* Limited time badge */}
                <div className="absolute top-0 right-0">
                  <div className="bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                    Limited Time
                  </div>
                </div>
                {/* Accent top border */}
                <div className="h-1.5 bg-gradient-to-r from-accent via-primary to-accent" />
                <CardContent className="p-8 flex flex-col flex-1 text-center md:text-left space-y-5">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-accent">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-semibold uppercase tracking-wide">Pre-Sale Offer</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    CoolPeel CO2 Laser
                  </h2>
                  <p className="text-muted-foreground">
                    The gold-standard fractional CO2 resurfacing treatment for tone, texture, and fine lines — with minimal downtime. Lock in your sessions at pre-sale pricing.
                  </p>
                  <div className="rounded-xl bg-gradient-to-br from-accent/10 to-secondary/40 border border-accent/20 px-4 py-5">
                    <p className="text-2xl font-bold text-foreground">[PRICING TBD]</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center md:justify-start gap-1">
                      <Calendar className="w-3 h-3" />
                      Pre-sale pricing available June 7-20, 2026
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Flexible monthly payments from $XX/mo through Cherry.
                  </p>
                  <div className="pt-2 mt-auto">
                    <BookNowButton />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Cherry Financing */}
        <section className="py-16 bg-gradient-to-b from-background to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <CherryFinancing variant="section" />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-8">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((item, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger className="text-left text-base font-semibold">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
                Ready to lock in your Summer Pre-Sale pricing?
              </h2>
              <p className="text-lg text-primary-foreground/85">
                Offer ends June 20, 2026. Buy now, treat later — on your schedule.
              </p>
              <div className="flex justify-center pt-2">
                <BookNowButton />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SummerPresale;
