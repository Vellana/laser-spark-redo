import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import fiveStars from "@/assets/five-stars.png";

const Testimonials = () => {
  const testimonials = [
    {
      text: "I have greatly enjoyed my experience here! Facility is clean and calming. I have seen great results and Holly is always very responsive to questions!",
      author: "Sydney P.",
    },
    {
      text: "I've had the best experience here. Both Holly and Amy are incredibly friendly and accommodating, always happy to help, informative in their answers to any questions I've had.",
      author: "Nektaria F.",
    },
    {
      text: "Holly and Amy the staff are very kind and aware. Customer service is very good and I noticed the office was very clean and welcoming. I will definitely be returning!!",
      author: "Samuel",
    },
    {
      text: "Amy and Holly are amazing! My laser hair removal was totally painless, this was the best experience ever. The place is so clean and beautiful as well.",
      author: "Alli Fuentes",
    },
    {
      text: "Highly recommend, I had laser hair removal at other places in the past and didn't noticed a huge difference. After just a few sessions here there is a dramatic difference.",
      author: "Shiyrah Keeney",
    },
    {
      text: "Huge thanks to Holly and Amy for turning my husband's back from a furry rug to no hair at all! They were both so friendly and professional, making the whole experience comfortable.",
      author: "Axel Keeney",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            What Our Clients Are Saying
          </h2>
          <div className="flex justify-center">
            <img src={fiveStars} alt="5 star reviews" className="h-12" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border hover:shadow-medium transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">{testimonial.text}</p>
                <p className="font-semibold text-foreground">{testimonial.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
