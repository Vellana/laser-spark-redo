import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Clock, Shield, DollarSign, CheckCircle2 } from "lucide-react";

interface CherryFinancingProps {
  variant?: "section" | "card";
}

const CherryFinancing = ({ variant = "section" }: CherryFinancingProps) => {
  const benefits = [
    { icon: Clock, text: "Quick application (takes < 30 seconds)" },
    { icon: Shield, text: "No hard credit check" },
    { icon: DollarSign, text: "Finance up to $10,000" },
    { icon: CheckCircle2, text: "Low monthly payments" },
  ];

  const cherryUrl = "https://pay.withcherry.com/virginia-laser-specialists";

  if (variant === "card") {
    return (
      <Card className="border-accent/40 bg-gradient-to-br from-accent/5 to-accent/10">
        <CardContent className="py-8 space-y-6">
          <div className="flex items-center justify-center gap-3">
            <CreditCard className="w-8 h-8 text-accent" />
            <h3 className="text-2xl font-bold text-foreground">
              Flexible Payment Plans with Cherry
            </h3>
          </div>
          
          <p className="text-center text-muted-foreground">
            Apply for financing in under 30 seconds with no hard credit check. Finance up to $10,000 for your treatments with low monthly payments.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                <benefit.icon className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm text-foreground">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <a href={cherryUrl} target="_blank" rel="noopener noreferrer">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8">
                Check Your Eligibility
              </Button>
            </a>
            <p className="text-sm text-muted-foreground italic">
              Ask us about Cherry financing when booking your consultation!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-accent/5 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-10">
            <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Flexible Payment Plans with Cherry
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Apply for financing in under 30 seconds with no hard credit check. Finance up to $10,000 for your laser hair removal and skin resurfacing treatments with low monthly payments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center gap-3 p-6 bg-card rounded-xl shadow-sm border border-border/50 text-center"
              >
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <a href={cherryUrl} target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-10 py-6 text-lg transition-all hover:scale-105"
              >
                Apply Now
              </Button>
            </a>
            <p className="text-muted-foreground italic">
              Ask us about Cherry financing when booking your consultation!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CherryFinancing;
