import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Clock } from "lucide-react";
import { pushEvent } from "@/lib/analytics";

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
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-[hsl(215,28%,17%)] to-[hsl(215,28%,22%)] text-white relative overflow-hidden">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {contactInfo.slice(0, 2).map((info) => (
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
                    onClick={info.title === "Phone" ? () => pushEvent("click_call") : undefined}
                    className="text-white/90 hover:text-accent transition-colors"
                  >
                    {info.details}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
          {/* Hours card - centered below on tablet, inline on desktop */}
          <Card
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 sm:col-span-2 sm:max-w-sm sm:mx-auto lg:col-span-1 lg:max-w-none"
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-accent rounded-full">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{contactInfo[2].title}</h3>
                <a
                  href={contactInfo[2].link}
                  className="text-white/90 hover:text-accent transition-colors"
                >
                  {contactInfo[2].details}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Google Map */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="h-[300px] rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3106.5835844744707!2d-77.23373892358055!3d38.91983394785829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b64a89e9d5c7af%3A0x8e0d9b9b9b9b9b9b!2s8100%20Boone%20Blvd%2C%20Vienna%2C%20VA%2022182!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Virginia Laser Specialists Location - 8100 Boone Blvd, Suite 270, Vienna, VA 22182"
            ></iframe>
          </div>
        </div>

        <div className="text-center space-y-6">
          <a href="/book-free-consultation">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-primary font-semibold px-12 py-6 text-lg shadow-gold transition-all hover:scale-105"
            >
              Book Your Free Consultation
            </Button>
          </a>
          <p className="text-white/80 text-sm">
            We accept most insurance plans and offer flexible payment options
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
