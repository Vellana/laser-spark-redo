import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { pushEvent } from "@/lib/analytics";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import CherryFinancing from "@/components/CherryFinancing";
import { usePrices } from "@/lib/prices";
import PriceDisplay, { DiscountNotice, DiscountWords } from "@/components/PriceDisplay";
const Pricing = () => {
  const { prices, discounts, get } = usePrices();
  const laserHairRemovalPricing = prices.filter((p) => p.category === "laser_hair");
  // CoolPeel by area, series of 3 only; DEKA Pulse single sessions by area (Holly, 7 Oct 2026).
  const coolpeelPricing = prices.filter((p) => p.category === "coolpeel");
  const dekaPricing = prices.filter((p) => p.category === "deka");
  // In place of Holly's typed fall line (Oct 7): each live discount that lowers a laser hair removal price, in its
  // own record's words (name, code, last day, note; Admin > Prices). It goes by itself after its last day or when it
  // is switched off, with no change to the site (Julien, 8 Oct 2026: codes "auto end after that date").
  const hairDiscounts = discounts.filter((d) =>
    laserHairRemovalPricing.some((p) => get(p.key, "single").discount?.id === d.id || get(p.key, "package").discount?.id === d.id),
  );

  return (
    <div className="min-h-screen">
      <SEO 
        title="Laser Hair Removal Cost Northern Virginia | CoolPeel Laser Cost and Packages"
        description="Laser hair removal cost Northern Virginia and CoolPeel laser cost at Virginia Laser Specialists, plus laser hair removal packages near me with 25% off 5-packs. 703-547-4499."
        canonicalUrl="/pricing"
      />
      <LocalBusinessSchema />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Pricing", url: "/pricing" }
      ]} />
      <Navigation />
      <main className="pt-20">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Pricing
              </h1>
              <p className="text-lg text-muted-foreground">
                Transparent pricing for all our laser treatments
              </p>
            </div>

            {/* Laser Hair Removal Pricing */}
            <Card className="max-w-4xl mx-auto mb-12">
              <CardHeader>
                <CardTitle className="text-3xl text-center">
                  Laser Hair Removal Pricing
                </CardTitle>
                {hairDiscounts.map((d) => (
                  <p key={d.id} className="text-center text-accent font-semibold">
                    <DiscountWords d={d} />
                  </p>
                ))}
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-4 px-4 text-foreground font-semibold">
                          Area
                        </th>
                        <th className="text-center py-4 px-4 text-foreground font-semibold">
                          Single Session
                        </th>
                        <th className="text-center py-4 px-4 text-foreground font-semibold">
                          <div className="inline-flex flex-col items-center gap-1.5">
                            <div>Package of 5</div>
                            <div className="text-[0.8rem] font-normal text-muted-foreground max-w-[180px]">
                              Save on a series of 5 treatments
                            </div>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {laserHairRemovalPricing.map((item, index) => (
                        <tr
                          key={item.key}
                          className={`border-b border-border/50 ${index % 2 === 0 ? "bg-secondary/20" : ""
                            }`}
                        >
                          <td className="py-4 px-4 text-foreground font-medium">
                            {item.name}
                          </td>
                          <td className="py-4 px-4 text-center text-muted-foreground">
                            <PriceDisplay result={get(item.key, "single")} />
                          </td>
                          <td className="py-4 px-4 text-center text-accent font-semibold">
                            <PriceDisplay result={get(item.key, "package")} className="text-accent font-semibold" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* A discount already set out under the heading is not repeated here. */}
                <DiscountNotice discounts={discounts.filter((d) => !hairDiscounts.includes(d))} />
                <div className="mt-8 text-center">
                  <a
                    href="/booking"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => pushEvent("free_consult_booking")}
                  >
                    <Button className="bg-accent hover:bg-accent/90 text-primary font-semibold">
                      Book Now
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Laser Resurfacing Pricing */}
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* CoolPeel Pricing */}
              <Card className="border-accent/40">
                <CardHeader>
                  <h2 className="text-2xl text-center font-semibold leading-none tracking-tight">
                    CoolPeel Laser Cost
                  </h2>
                  <p className="text-center text-muted-foreground">
                    Cartessa Tetra Pro CO2 laser · Series of 3, spaced 1 month apart
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {coolpeelPricing.map((item) => (
                      <div key={item.key} className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg">
                        <span className="font-medium text-foreground">{item.name}</span>
                        <div className="text-right">
                          <div className="text-accent font-semibold text-xl"><PriceDisplay result={get(item.key, "package")} className="text-accent font-semibold text-xl" /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Deka Pulse Pricing */}
              <Card className="border-primary/40">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">
                    Deka Pulse Pricing
                  </CardTitle>
                  <p className="text-center text-muted-foreground">
                    Single intensive treatment
                  </p>
                </CardHeader>
                <CardContent>
                  {dekaPricing.length > 0 ? (
                    <div className="space-y-4">
                      {dekaPricing.map((item) => (
                        <div key={item.key} className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg">
                          <span className="font-medium text-foreground">{item.name}</span>
                          <div className="text-accent font-semibold"><PriceDisplay result={get(item.key, "single")} className="text-accent font-semibold" /></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg">
                      <span className="font-medium text-foreground">Full Face</span>
                      <div className="text-accent font-semibold">Contact for Quote</div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg">
                      <span className="font-medium text-foreground">Neck</span>
                      <div className="text-accent font-semibold">Contact for Quote</div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg">
                      <span className="font-medium text-foreground">Décolletage</span>
                      <div className="text-accent font-semibold">Contact for Quote</div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg">
                      <span className="font-medium text-foreground">Full Face + Neck</span>
                      <div className="text-accent font-semibold">Contact for Quote</div>
                    </div>
                  </div>
                  )}
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-foreground text-center">
                      <strong>Note:</strong> Deeper treatment with 5-10 days downtime
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cherry Financing */}
            <div className="max-w-4xl mx-auto mt-12">
              <CherryFinancing variant="card" />
            </div>

            {/* Contact CTA */}
            <Card className="max-w-4xl mx-auto mt-8 bg-secondary/30">
              <CardContent className="py-12 text-center space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  Ready to Learn More?
                </h3>
                <p className="text-lg text-muted-foreground">
                  Contact us for detailed pricing and to discuss which treatment is right for you.
                </p>
                <Link to="/contact">
                  <Button className="mt-4 bg-accent hover:bg-accent/90 text-primary font-semibold">
                    Get Pricing Information
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
