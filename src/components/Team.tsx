import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import amyImage from "@/assets/amy.png";
import hollyImage from "@/assets/holly.png";

const Team = () => {
  const team = [
    {
      name: "Amy O'Brien Kirschner",
      title: "Licensed Esthetician & Certified Laser Technician",
      bio: "Amy O'Brien Kirschner is a dedicated licensed esthetician and certified laser hair removal technician with over 12 years of experience in the skincare industry.",
      fullBio: "Amy O'Brien Kirschner is a dedicated licensed esthetician and certified laser hair removal technician with over 12 years of experience in the skincare industry. Passionate about enhancing her clients natural beauty, Amy offers a knowledgeable, personalized approach to skincare and hair removal that prioritizes safety and comfort. Specializing in the use of advanced laser technology, Amy utilizes the Lutronic Clarity II laser along with other leading devices including the Picoway and Cynosure Elite lasers– the gold standard for both hair and tattoo removal treatments. Her expertise in these cutting-edge tools allows her to provide effective solutions for stubborn hair growth and tattoo removal on all areas of the body. Having lived and worked in the DMV area for over 20 years, Amy has built strong relationships with her clients, who appreciate her calm and engaging demeanor. She takes the time to conduct thorough consultations to educate clients about the laser hair removal process and assess their individual needs, ensuring they set realistic expectations for their results.",
      image: amyImage,
    },
    {
      name: "Holly Schuster",
      title: "Owner/Operator",
      bio: "With more than 20 years of dynamic experience as a small business owner across the hospitality, real estate, and consulting sectors, Holly developed a rich and diverse skill set that has shaped her professional journey.",
      fullBio: "With more than 20 years of dynamic experience as a small business owner across the hospitality, real estate, and consulting sectors, Holly developed a rich and diverse skill set that has shaped her professional journey. She received a degree in architecture from Catholic University in Washington, DC, giving her a robust foundation that has fueled various endeavors and creative pursuits. She has taken her commitment to excellence further by completing extensive training in laser hair removal and earning certification from Cynosure/Lutronic. As the Owner/Operator of Virginia Laser Specialists, she is passionate about creating a results-driven customer experience that consistently exceeds clients' expectations. Her unwavering focus on excellence guarantees that every client receives exceptional care and individualized attention. She is committed to cultivating an environment where all clients feel valued!",
      image: hollyImage,
    },
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Meet Our Expert Team
          </h2>
          <p className="text-lg text-muted-foreground">
            Dedicated professionals with years of experience in laser treatments
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((member) => (
            <Card
              key={member.name}
              className="overflow-hidden border-border hover:shadow-medium transition-all"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                  <p className="text-accent font-semibold">{member.title}</p>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">{member.bio}</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Read Full Bio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{member.name}</DialogTitle>
                      <DialogDescription className="text-base text-accent">
                        {member.title}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {member.fullBio}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
