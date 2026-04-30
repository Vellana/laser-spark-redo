import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

interface QA {
  q: string;
  a: string;
}

const coolpeelFAQs: QA[] = [
  {
    q: "What is CoolPeel?",
    a: "CoolPeel is a next-generation fractional CO₂ laser treatment from Lutronic that resurfaces the skin to improve tone, texture, fine lines, pores, and sun damage — with significantly less downtime than traditional CO₂ resurfacing.",
  },
  {
    q: "How is CoolPeel different from a traditional CO₂ laser?",
    a: "CoolPeel delivers high-energy CO₂ pulses in extremely short bursts so heat doesn't build up in the surrounding tissue. The result is the rejuvenating benefits of CO₂ resurfacing with minimal downtime and a lower risk profile.",
  },
  {
    q: "What skin concerns does CoolPeel treat?",
    a: "Fine lines and wrinkles, enlarged pores, uneven skin tone and texture, sun damage, mild acne scarring, and overall dullness.",
  },
  {
    q: "Is CoolPeel safe for all skin types?",
    a: "CoolPeel is generally well-tolerated across a wide range of skin types. Your provider will assess your skin during a free consultation to confirm candidacy and recommend the appropriate settings.",
  },
  {
    q: "How long does a CoolPeel treatment take?",
    a: "Most full-face CoolPeel sessions take about 30 minutes, including topical numbing.",
  },
  {
    q: "Does CoolPeel hurt?",
    a: "A topical numbing cream is applied before treatment. Most patients describe the sensation as warm with mild prickling that resolves quickly after the session.",
  },
  {
    q: "What is the downtime after CoolPeel?",
    a: "Most patients experience redness similar to a sunburn for 24–48 hours, followed by light flaking or sandpaper-like texture for a few days. Most return to normal activities the next day.",
  },
  {
    q: "How many CoolPeel treatments will I need?",
    a: "Most patients see noticeable results after a single treatment. For deeper concerns, a series of 3 sessions spaced about 4 weeks apart is typically recommended.",
  },
  {
    q: "When will I see results?",
    a: "Initial smoothness and glow appear within 1–2 weeks. Collagen remodeling continues for several months, with continued improvement in tone and texture.",
  },
  {
    q: "What should I avoid before my CoolPeel treatment?",
    a: "You must stop Accutane (isotretinoin) at least 6 months prior, Aspirin and other blood thinners 5 days prior, and Botox in the treatment area 2 weeks prior. Avoid sun exposure, retinoids, and exfoliating acids for at least 1 week before treatment.",
  },
  {
    q: "What is the aftercare for CoolPeel?",
    a: "Keep the skin clean and well-moisturized, apply a broad-spectrum SPF 30+ daily, and strictly avoid direct sun exposure, heat (saunas, hot showers), and active skincare ingredients (retinol, AHAs/BHAs) for at least 7 days post-treatment.",
  },
  {
    q: "Can CoolPeel be combined with other treatments?",
    a: "Yes — CoolPeel pairs well with Botox, fillers, and other laser treatments. Spacing depends on the procedure, and your provider will create a personalized plan during your free consultation.",
  },
  {
    q: "How much does CoolPeel cost in Tysons / Vienna, VA?",
    a: "Pricing is presented during your free consultation and is also available on our Pricing page. Cherry financing is available site-wide to make treatment more accessible.",
  },
];

const hairRemovalFAQs: QA[] = [
  {
    q: "What laser do you use for hair removal?",
    a: "We use the Lutronic Clarity II — a dual-wavelength (Alexandrite 755 nm and Nd:YAG 1064 nm) laser that safely treats all skin types, including darker skin tones.",
  },
  {
    q: "Is laser hair removal safe for all skin types?",
    a: "Yes. The Clarity II's dual-wavelength technology lets us tailor each treatment to your specific skin type and tone, making it safe and effective for Fitzpatrick skin types I–VI.",
  },
  {
    q: "How many sessions will I need?",
    a: "Most patients need 6–8 sessions spaced 4–8 weeks apart depending on the body area, since hair grows in cycles and laser only targets actively growing follicles.",
  },
  {
    q: "Does laser hair removal hurt?",
    a: "Most patients describe the sensation as a quick rubber-band snap. The Clarity II includes integrated cooling for comfort throughout the session.",
  },
  {
    q: "How should I prepare for my laser hair removal appointment?",
    a: "Shave the treatment area 12–24 hours before your appointment. Do NOT wax, pluck, or use depilatory creams for at least 4 weeks prior. Avoid sun exposure and self-tanners for 2 weeks prior.",
  },
  {
    q: "What is the aftercare for laser hair removal?",
    a: "Avoid direct sun exposure, hot showers, saunas, hot tubs, and intense exercise for 24–48 hours. Apply broad-spectrum SPF 30+ daily and avoid exfoliants and retinoids on the treated area for several days.",
  },
  {
    q: "When will I see results?",
    a: "You'll typically notice shedding within 1–3 weeks of your first session, with progressively less and finer hair regrowth after each treatment.",
  },
  {
    q: "Can I get laser hair removal if I'm pregnant?",
    a: "We do not perform laser hair removal during pregnancy. Please wait until after delivery (and breastfeeding, per your physician) to begin or resume treatments.",
  },
  {
    q: "Can I shave between sessions?",
    a: "Yes — shaving is fine and even encouraged. Avoid waxing, plucking, threading, and depilatory creams between sessions, as these disrupt the follicle the laser needs to target.",
  },
  {
    q: "What areas of the body can be treated?",
    a: "We treat 18+ areas including face, underarms, arms, legs, bikini, Brazilian, back, chest, and more. See our Laser Hair Removal page for the full list with pricing.",
  },
  {
    q: "How much does laser hair removal cost?",
    a: "Pricing varies by area. Single sessions and discounted Packages of 5 (25% off) are listed on our Pricing page. Cherry financing is available to spread payments over time.",
  },
];

const FAQ = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [...coolpeelFAQs, ...hairRemovalFAQs].map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="FAQ | CoolPeel & Laser Hair Removal Questions | Virginia Laser Specialists"
        description="Answers to common questions about CoolPeel CO₂ skin resurfacing and laser hair removal at Virginia Laser Specialists in Tysons, Vienna VA. Safe for all skin types."
        canonicalUrl="/faq"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "FAQ", url: "/faq" },
        ]}
      />
      <Navigation />

      <main className="pt-28 sm:pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <header className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about CoolPeel CO₂ skin resurfacing and laser hair removal at Virginia Laser Specialists in Tysons, VA.
            </p>
          </header>

          {/* CoolPeel Section */}
          <section className="mb-16" aria-labelledby="coolpeel-faqs">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-border" />
              <h2
                id="coolpeel-faqs"
                className="text-2xl sm:text-3xl font-bold text-accent whitespace-nowrap"
              >
                CoolPeel FAQs
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Accordion
              type="single"
              collapsible
              className="bg-card border border-border rounded-2xl shadow-soft px-4 sm:px-6"
            >
              {coolpeelFAQs.map((item, i) => (
                <AccordionItem
                  key={`cp-${i}`}
                  value={`cp-${i}`}
                  className="border-b border-border last:border-b-0"
                >
                  <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-foreground hover:text-accent hover:no-underline py-5">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Laser Hair Removal Section */}
          <section className="mb-16" aria-labelledby="hair-faqs">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-border" />
              <h2
                id="hair-faqs"
                className="text-2xl sm:text-3xl font-bold text-accent whitespace-nowrap"
              >
                Laser Hair Removal FAQs
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Accordion
              type="single"
              collapsible
              className="bg-card border border-border rounded-2xl shadow-soft px-4 sm:px-6"
            >
              {hairRemovalFAQs.map((item, i) => (
                <AccordionItem
                  key={`hr-${i}`}
                  value={`hr-${i}`}
                  className="border-b border-border last:border-b-0"
                >
                  <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-foreground hover:text-accent hover:no-underline py-5">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* CTA */}
          <div className="text-center bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-soft">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Book a free consultation with our team — we'll answer every question and create a treatment plan tailored to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/book-free-consultation">
                <Button variant="accent" size="lg" className="w-full sm:w-auto">
                  Book Free Consultation
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
