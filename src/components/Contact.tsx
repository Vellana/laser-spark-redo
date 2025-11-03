import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Clock, Mail } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "703-547-4499",
      link: "tel:703-547-4499",
    },
    {
      icon: MapPin,
      title: "Location",
      details: "8100 Boone Blvd, Suite 270, Vienna, VA 22182",
      link: "https://maps.google.com/?q=8100+Boone+Boulevard+Suite+270+Vienna+VA+22182",
    },
    {
      icon: Clock,
      title: "Hours",
      details: "Tue-Fri: 10am-6pm, Sat: 9am-1pm",
      link: "#",
    },
    {
      icon: Mail,
      title: "Email",
      details: "Book Online",
      link: "https://www.vagaro.com/virginialaserspecialists/services",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-primary to-primary/90 text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90">
            Book your consultation today and experience expert laser care
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info) => (
            <Card
              key={info.title}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <CardContent className="p-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-accent rounded-full">
                  <info.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{info.title}</h3>
                  <a
                    href={info.link}
                    className="text-white/90 hover:text-accent transition-colors"
                  >
                    {info.details}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-6">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-primary font-semibold px-12 py-6 text-lg shadow-gold transition-all hover:scale-105"
          >
            Book Your Appointment Now
          </Button>
          <p className="text-white/80 text-sm">
            We accept most insurance plans and offer flexible payment options
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
