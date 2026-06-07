import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import VagaroConsultWidget from "@/components/VagaroConsultWidget";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const Booking = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Book Online | Virginia Laser Specialists - Vienna, VA"
        description="Book your laser hair removal or CoolPeel CO2 resurfacing appointment online with Virginia Laser Specialists in Vienna, VA. Free consultations available."
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Book Online", url: "/booking" }]} />
      <Navigation />
      <main className="flex-1 pt-32 pb-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
              Book Your Appointment
            </h1>
            <p className="text-lg text-muted-foreground">
              Schedule your free consultation or treatment directly below. Questions?
              Call <a href="tel:703-752-6608" className="text-accent hover:underline font-medium">703-752-6608</a>.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-lg p-4 sm:p-6 border border-border">
            <VagaroConsultWidget />
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Booking powered by Vagaro. You can also{" "}
            <a
              href="https://www.vagaro.com/virginialaserspecialists"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              book on Vagaro directly
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
