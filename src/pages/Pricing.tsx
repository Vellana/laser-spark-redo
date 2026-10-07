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
import { isSummerSaleActive } from "@/lib/summerSale";
import { usePrices } from "@/lib/prices";
import PriceDisplay, { DiscountNotice } from "@/components/PriceDisplay";
const Pricing = () => {
  const summerSaleActive = isSummerSaleActive();
  const { prices, discounts, get } = usePrices();
  const laserHairRemovalPricing = prices.filter((p) => p.category === "laser_hair");

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
                            <div className="text-xs font-normal text-muted-foreground max-w-[180px]">
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
                <DiscountNotice discounts={discounts} />
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
                    <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg">
                      <span className="font-medium text-foreground">Single Session</span>
                      <div className="text-right">
                        <div className="text-accent font-semibold text-xl"><PriceDisplay result={get("coolpeel", "single")} /></div>
                        <div className="text-sm text-muted-foreground">Per treatment</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg border border-accent/40">
                      <span className="font-medium text-foreground">Package of 3</span>
                      <div className="text-right">
                        {summerSaleActive && !get("coolpeel", "package").discount ? (
                          <>
                            <div className="flex items-baseline justify-end gap-2">
                              <span className="text-accent font-semibold text-xl">$1,500</span>
                              <span className="text-sm text-muted-foreground line-through">$2,000</span>
                            </div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-destructive">Summer Sale · Save $500</div>
                          </>
                        ) : (
                          <div className="text-accent font-semibold text-xl"><PriceDisplay result={get("coolpeel", "package")} /></div>
                        )}
                      </div>
                    </div>
                  </div>
                  {summerSaleActive && (
                    <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                      <p className="text-sm text-foreground text-center">
                        <strong>Summer Sale pricing:</strong> Valid June 15–20, 2026. Cannot be combined with other discounts.
                      </p>
                    </div>
                  )}
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
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-foreground text-center">
                      <strong>Note:</strong> Deeper treatment with 5-10 days downtime
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Local SEO Cost Content */}
            <div className="max-w-4xl mx-auto mt-12 space-y-4">
              <h2 className="text-3xl font-bold text-foreground text-center">
                CoolPeel and Laser Hair Removal Pricing
              </h2>
              <p className="text-muted-foreground leading-relaxed text-center">
                <Link to="/coolpeel-co2-laser-tysons-va" className="text-accent hover:underline">CoolPeel laser cost</Link> at Virginia Laser Specialists is $750 per session or $2,000 for a series of three. Laser hair removal is priced by area, from $100 for small zones up to $1,850 for full body. We serve Vienna, Tysons, McLean, Falls Church, Arlington, and Fairfax from our office at 8100 Boone Blvd.
              </p>
              <p className="text-muted-foreground leading-relaxed text-center">
                Our 5-session series saves 25% across every body area and is the recommended path for permanent reduction with the Lutronic Clarity II. Cherry financing is available with $0 down so you can split package pricing into monthly payments. Compared with other clinics, our laser hair removal pricing stays flat and published, with no consultation fee. See the <Link to="/laser-hair-removal" className="text-accent hover:underline">laser hair removal</Link> page for treatment details or call 703-547-4499 to book a free consultation.
              </p>
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
