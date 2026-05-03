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
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

type Answer = string | { intro?: string; bullets: string[] };
interface QA {
  q: string;
  a: Answer;
}

const coolpeelFAQs: QA[] = [
  {
    q: "What is CoolPeel?",
    a: "CoolPeel is the revolutionary, award-winning, and proven way to safely and comfortably deliver the benefits of a traditional CO2 resurfacing treatment. By precisely targeting the superficial layer of skin tissue, it removes damaged skin to reveal younger, healthier-looking skin.",
  },
  {
    q: "What makes CoolPeel different?",
    a: "Traditional CO2 lasers have long been considered the gold standard for improving wrinkles, age spots, acne scars, blemishes as well as tighten skin and balance tone. They work by removing damaged skin and stimulating collagen production. To achieve these results there is significant injury to the skin causing considerable downtime and risk while the damaged skin heals. That's where CoolPeel comes in. CoolPeel offers the same results with no downtime due to the fractional ablative technology that no other CO2 device has. You can enjoy tighter, brighter and healthier looking skin with minimal risk of hyperpigmentation, and a healthier-looking complexion with far less recovery time compared to traditional CO2 treatments.",
  },
  {
    q: "Who is a good candidate for CoolPeel?",
    a: "If you're looking to smooth fine lines, fade sun damage, shrink the look of pores, or just give your skin a healthy refresh, CoolPeel is a great fit for you. The best part? It's safe for all skin types and leaves your skin looking healthier, smoother, and more youthful with minimal downtime.",
  },
  {
    q: "What is the recovery time for CoolPeel?",
    a: "One of the main benefits of a CoolPeel, is that there is minimal to no downtime. You should expect to be a little red, as if you have a sunburn, for a day, or two, but nothing should prevent you from returning to your normal daily activities. Your skin may feel dry and scaly as it heals so it is important to keep your skin hydrated.",
  },
  {
    q: "How many treatments will I need?",
    a: "The number of treatments will depend on your treatment goals. Typically 3-5 treatments are recommended spaced 4 weeks apart. Your treatment provider will customize a treatment plan with you.",
  },
  {
    q: "When can I return to my skincare routine?",
    a: "After your CoolPeel, it's important to follow your provider's recommended post-care guidance. You'll want to keep your skin hydrated and hold off on certain products for a little while. Everyone's skin is different, so your provider will let you know exactly when it's safe to get back to your regular skincare routine.",
  },
  {
    q: "When will I see results?",
    a: "Many patients notice an improvement in skin glow and texture after just one treatment, with continued improvement over the following weeks. A series of treatments may be recommended for best results.",
  },
  {
    q: "What should I do before my appointment?",
    a: "Avoid sun exposure, retinoids, and harsh exfoliants for a few days prior. Your provider will give you any other pre-treatment guidelines based on your skin and treatment plan.",
  },
  {
    q: "Can I pair CoolPeel with other treatments?",
    a: "Yes! CoolPeel is often combined with other treatments like microneedling, facials, or injectables, but this should be planned by your provider to ensure timing and safety.",
  },
];

const tetraProFAQs: QA[] = [
  {
    q: "What is a Tetra Pro CO2 treatment?",
    a: "Tetra Pro is an advanced CO2 laser treatment designed to target deeper skin concerns like wrinkles, sun damage, uneven texture, and scars. It removes damaged skin layers and stimulates collagen remodeling for smoother, firmer, more youthful-looking skin.",
  },
  {
    q: "How is this different from CoolPeel?",
    a: "CoolPeel is a gentler, more superficial CO2 treatment with little to no downtime. Tetra Pro goes deeper into the skin to deliver more dramatic results in fewer sessions - making it ideal for those looking to address more advanced signs of aging or texture concerns.",
  },
  {
    q: "What concerns does Tetra Pro treat?",
    a: {
      bullets: [
        "Wrinkles and fine lines",
        "Sun damage and age spots",
        "Acne scars and other types of scarring",
        "Uneven tone and texture",
        "Loose or crepey skin",
      ],
    },
  },
  {
    q: "Is the treatment painful?",
    a: "You may feel heat and a mild stinging sensation during the procedure. A topical numbing cream is typically applied beforehand, and in some cases, additional comfort measures may be used.",
  },
  {
    q: "How long is the downtime?",
    a: "Downtime can range from 5 to 10 days or longer depending on the intensity of the treatment. You may experience redness, pinpoint bleeding, swelling, and flaking or peeling as your skin heals.",
  },
  {
    q: "When will I see results?",
    a: "You'll start to notice improvements in skin texture and tone once the skin heals, usually within 1-2 weeks. Collagen production continues for several months, so results will continue to improve over time.",
  },
  {
    q: "How many treatments will I need?",
    a: "Most patients see significant improvement after one treatment, but depending on your goals and skin condition, a series of treatments may be recommended.",
  },
  {
    q: "How do I prepare for treatment?",
    a: "Avoid sun exposure, retinoids, and certain skincare products for at least 1-2 weeks before treatment. Your provider will give you a detailed pre-treatment guide.",
  },
  {
    q: "What should I expect immediately after?",
    a: "Expect redness, pinpoint bleeding, swelling, and a sensation similar to a sunburn. Your provider will recommend specific post treatment guidance that is important to follow to ensure the best outcome and recovery.",
  },
  {
    q: "Is Tetra Pro safe for all skin types?",
    a: "Moderate to aggressive CO2 treatments are best suited for lighter skin types (Fitzpatrick I-III). Your provider will assess your skin type and recommend the safest, most effective approach.",
  },
  {
    q: "Can I wear makeup after treatment?",
    a: "You'll need to avoid makeup until your skin is fully healed - usually around day 7-10, depending on the intensity of the treatment and your healing response.",
  },
];

const hairRemovalFAQs: QA[] = [
  {
    q: "What areas can be treated?",
    a: "We can treat almost anywhere that has unwanted hair – however, we want to be very careful when treating around the eyes.",
  },
  {
    q: "How many treatments do I need?",
    a: "Everyone's body is different but, It takes an average of 5-10 treatments to have really good hair reduction. We never say permanent, but it can be very long lasting.",
  },
  {
    q: "What is the spacing between sessions?",
    a: "Treatments are generally spaced 6-10 weeks apart for best results. After treatment we need to give the hair time to work it's way out of the follicle and new growth to come in before the next treatment.",
  },
  {
    q: "Can I wax or tweeze between sessions?",
    a: "No waxing or tweezing between treatment sessions, as we need the hair in the follicle for the laser to be attracted to it. You can absolutely shave in between sessions and you want to come to your appointment cleanly shaven.",
  },
  {
    q: "How long does a treatment take?",
    a: "Depending on the size of the area, treatment times typically range from 5 mins to 45mins. The treatment itself is very quick but time is needed to prep the area before treatment.",
  },
  {
    q: "Do the hairs ever come back?",
    a: "We never say permanent, but laser hair removal can be very long lasting after having multiple treatments within the recommended time frames. Changes in health and hormone changes can also sometimes effect hair growth.",
  },
  {
    q: "Can ingrown hairs be treated?",
    a: "Yes, laser hair removal is the remedy for those pesky ingrown hairs.",
  },
  {
    q: "Can I use a laser treatment to thin out the hair?",
    a: "Yes laser treatments can be used in areas that you want to thin out the hair but don't want it completely gone. This would require fewer treatment spaced further apart. After treatment, the hair in the follicles will receive less nutrients and struggle to grow, making is not as strong and finer.",
  },
  {
    q: "How does a treatment feel?",
    a: "The treatment feels like a mild rubber band snapping. The cryogen colling system used with our Clarity II laser helps ease the discomfort during treatment.",
  },
  {
    q: "What should I expect after treatment?",
    a: "After treatment you may experience a little redness and swelling around the follicles. This is a good normal response. I recommend limiting excessive exercise, use of saunas or hot tubs or hot showers within 24 hours of treatment.",
  },
];

const sections: { id: string; title: string; items: QA[]; keyPrefix: string }[] = [
  { id: "coolpeel-faq", title: "CoolPeel", items: coolpeelFAQs, keyPrefix: "cp" },
  { id: "tetrapro-faq", title: "Tetra Pro Advanced Treatments", items: tetraProFAQs, keyPrefix: "tp" },
  { id: "lhr-faq", title: "Laser Hair Removal", items: hairRemovalFAQs, keyPrefix: "hr" },
];

const answerToText = (a: Answer): string =>
  typeof a === "string" ? a : [a.intro, ...a.bullets].filter(Boolean).join(" • ");

const FAQ = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, [location.hash]);

  const allItems = [...coolpeelFAQs, ...tetraProFAQs, ...hairRemovalFAQs];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: answerToText(item.a) },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="FAQ | CoolPeel, Tetra Pro & Laser Hair Removal | Virginia Laser Specialists"
        description="Answers to common questions about CoolPeel CO₂ skin resurfacing, Tetra Pro advanced CO₂ treatments, and laser hair removal at Virginia Laser Specialists in Tysons, Vienna VA."
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
          <header className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Answers about CoolPeel, Tetra Pro advanced CO₂ treatments, and laser hair removal at Virginia Laser Specialists in Tysons, VA.
            </p>
          </header>

          {sections.map((section) => (
            <section key={section.id} id={section.id} className="mb-16 scroll-mt-32" aria-labelledby={`${section.id}-heading`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-border" />
                <h2
                  id={`${section.id}-heading`}
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
                    <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-foreground hover:text-accent hover:no-underline data-[state=open]:text-accent py-5">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
                      {typeof item.a === "string" ? (
                        <p>{item.a}</p>
                      ) : (
                        <>
                          {item.a.intro && <p className="mb-2">{item.a.intro}</p>}
                          <ul className="list-disc pl-5 space-y-1">
                            {item.a.bullets.map((b, idx) => (
                              <li key={idx}>{b}</li>
                            ))}
                          </ul>
                        </>
                      )}
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
