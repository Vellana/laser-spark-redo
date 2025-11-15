import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  const laserHairRemovalPricing = [
    { area: "Upper Lip", single: "$75", package: "$300" },
    { area: "Chin", single: "$75", package: "$300" },
    { area: "Underarms", single: "$150", package: "$600" },
    { area: "Brazilian", single: "$250", package: "$1,000" },
    { area: "Half Legs", single: "$300", package: "$1,200" },
    { area: "Full Legs", single: "$450", package: "$1,800" },
    { area: "Back", single: "$400", package: "$1,600" },
    { area: "Chest", single: "$350", package: "$1,400" },
    { area: "Full Arms", single: "$300", package: "$1,200" },
    { area: "Full Face", single: "$200", package: "$800" },
  ];

  return (
    <div className="min-h-screen">
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
                          Package of 5
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {laserHairRemovalPricing.map((item, index) => (
                        <tr
                          key={item.area}
                          className={`border-b border-border/50 ${
                            index % 2 === 0 ? "bg-secondary/20" : ""
                          }`}
                        >
                          <td className="py-4 px-4 text-foreground font-medium">
                            {item.area}
                          </td>
                          <td className="py-4 px-4 text-center text-muted-foreground">
                            {item.single}
                          </td>
                          <td className="py-4 px-4 text-center text-accent font-semibold">
                            {item.package}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-8 text-center">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                    Book Free Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cool Peel Coming Soon */}
            <Card className="max-w-4xl mx-auto bg-secondary/30">
              <CardContent className="py-12 text-center space-y-4">
                <h3 className="text-2xl font-bold text-foreground">
                  Tetra (Cool Peel) Offerings
                </h3>
                <p className="text-lg text-muted-foreground">
                  Pricing coming soon. Contact us for more information about our
                  advanced Cool Peel treatments.
                </p>
                <Button variant="outline" className="mt-4">
                  Contact Us
                </Button>
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
