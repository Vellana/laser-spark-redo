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

/**
 * ============================================================================
 * FAQ CONTENT — TODO / PLACEHOLDER
 * ----------------------------------------------------------------------------
 * The Q→A pairs in the three sections below (CoolPeel, DEKA, Laser Hair
 * Removal) are PLACEHOLDERS only.
 *
 * The authoritative content is sourced from Amy O'Brien's emails dated
 * April 30 — Gmail thread IDs:
 *   • 19ddf5bfbe76e983
 *   • 19ddf614a29a8d73
 *
 * Julien will review the attachments in those threads and paste the real
 * Q→A content into each array below. Do NOT publish customer-facing copy
 * generated here — replace verbatim with Amy's approved content.
 * ============================================================================
 */

// TODO(Julien): Replace with verbatim Q→A from Amy O'Brien Apr 30 emails
// (Gmail threads 19ddf5bfbe76e983 + 19ddf614a29a8d73)
const coolpeelFAQs: QA[] = [
  { q: "[TODO] CoolPeel question 1 — paste from Amy O'Brien Apr 30 email", a: "[TODO] Answer 1" },
  { q: "[TODO] CoolPeel question 2", a: "[TODO] Answer 2" },
  { q: "[TODO] CoolPeel question 3", a: "[TODO] Answer 3" },
];

// TODO(Julien): Replace with verbatim Q→A from Amy O'Brien Apr 30 emails
// (Gmail threads 19ddf5bfbe76e983 + 19ddf614a29a8d73)
const dekaFAQs: QA[] = [
  { q: "[TODO] DEKA question 1 — paste from Amy O'Brien Apr 30 email", a: "[TODO] Answer 1" },
  { q: "[TODO] DEKA question 2", a: "[TODO] Answer 2" },
  { q: "[TODO] DEKA question 3", a: "[TODO] Answer 3" },
];

// TODO(Julien): Replace with verbatim Q→A from Amy O'Brien Apr 30 emails
// (Gmail threads 19ddf5bfbe76e983 + 19ddf614a29a8d73)
const hairRemovalFAQs: QA[] = [
  { q: "[TODO] Laser Hair Removal question 1 — paste from Amy O'Brien Apr 30 email", a: "[TODO] Answer 1" },
  { q: "[TODO] Laser Hair Removal question 2", a: "[TODO] Answer 2" },
  { q: "[TODO] Laser Hair Removal question 3", a: "[TODO] Answer 3" },
];

const sections: { id: string; title: string; items: QA[]; keyPrefix: string }[] = [
  { id: "coolpeel-faqs", title: "CoolPeel FAQs", items: coolpeelFAQs, keyPrefix: "cp" },
  { id: "deka-faqs", title: "DEKA FAQs", items: dekaFAQs, keyPrefix: "dk" },
  { id: "hair-faqs", title: "Laser Hair Removal FAQs", items: hairRemovalFAQs, keyPrefix: "hr" },
];

const FAQ = () => {
  const allItems = [...coolpeelFAQs, ...dekaFAQs, ...hairRemovalFAQs];
  // Only emit FAQPage schema once real (non-placeholder) content is in place.
  const hasRealContent = !allItems.some((i) => i.q.startsWith("[TODO]") || i.a.startsWith("[TODO]"));
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="FAQ | CoolPeel, DEKA & Laser Hair Removal Questions | Virginia Laser Specialists"
        description="Answers to common questions about CoolPeel CO₂ skin resurfacing, DEKA laser, and laser hair removal at Virginia Laser Specialists in Tysons, Vienna VA."
        canonicalUrl="/faq"
      />
      {hasRealContent && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        </Helmet>
      )}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "FAQ", url: "/faq" },
        ]}
      />
      <Navigation />

      <main className="pt-28 sm:pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Answers about CoolPeel CO₂ skin resurfacing, DEKA laser, and laser hair removal at Virginia Laser Specialists in Tysons, VA.
            </p>
          </header>

          {sections.map((section) => (
            <section key={section.id} className="mb-16" aria-labelledby={section.id}>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-border" />
                <h2
                  id={section.id}
                  className="text-2xl sm:text-3xl font-bold text-accent whitespace-nowrap"
                >
                  {section.title}
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Accordion
                type="single"
                collapsible
                className="bg-card border border-border rounded-2xl shadow-soft px-4 sm:px-6"
              >
                {section.items.map((item, i) => (
                  <AccordionItem
                    key={`${section.keyPrefix}-${i}`}
                    value={`${section.keyPrefix}-${i}`}
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
          ))}

          <div className="text-center bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-soft">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Book a free consultation with our team - we'll answer every question and create a treatment plan tailored to you.
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
