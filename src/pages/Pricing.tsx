import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  const laserHairRemovalPricing = [
    { area: "Abdomen", single: "$250", package: "$937" },
    { area: "Arms (Half)", single: "$300", package: "$1,125" },
    { area: "Arms (Full)", single: "$400", package: "$1,500" },
    { area: "Back (Half)", single: "$250", package: "$937" },
    { area: "Back (Full)", single: "$400", package: "$1,500" },
    { area: "Beard", single: "$250", package: "$937" },
    { area: "Belly Line", single: "$100", package: "$375" },
    { area: "Buttocks", single: "$250", package: "$937" },
    { area: "Brazilian (F)", single: "$300", package: "$1,125" },
    { area: "Bikini Line", single: "$250", package: "$937" },
    { area: "Breasts", single: "$100", package: "$375" },
    { area: "Chest", single: "$250", package: "$937" },
    { area: "Chin", single: "$100", package: "$375" },
    { area: "Ears", single: "$100", package: "$375" },
    { area: "Face", single: "$250", package: "$937" },
    { area: "Feet", single: "$100", package: "$375" },
    { area: "Hair Lines", single: "$100", package: "$375" },
    { area: "Hands", single: "$100", package: "$375" },
    { area: "Legs (Half)", single: "$350", package: "$1,312" },
    { area: "Legs (Full)", single: "$500", package: "$1,875" },
    { area: "Neck Front", single: "$100", package: "$375" },
    { area: "Neck Back", single: "$100", package: "$375" },
    { area: "Shoulders", single: "$100", package: "$375" },
    { area: "Inner Thighs", single: "$150", package: "$562" },
    { area: "Sideburns", single: "$100", package: "$375" },
    { area: "Underarms", single: "$150", package: "$562" },
    { area: "Upper Lip", single: "$100", package: "$375" },
    { area: "Full Body*", single: "$1,850", package: "$6,937" },
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
