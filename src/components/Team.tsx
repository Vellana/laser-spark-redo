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

const Team = () => {
  const team = [
    {
      name: "Amy O'Brien Kirschner",
      title: "Licensed Esthetician & Certified Laser Technician",
      bio: "Amy O'Brien Kirschner is a dedicated licensed esthetician and certified laser hair removal technician with over 12 years of experience in the skincare industry.",
      fullBio: "Amy O'Brien Kirschner is a dedicated licensed esthetician and certified laser hair removal technician with over 12 years of experience in the skincare industry. Her passion for aesthetics began early in her career, driven by a commitment to helping clients achieve healthy, radiant skin through advanced treatments and personalized care. Amy specializes in laser hair removal and has built a reputation for her meticulous attention to detail, gentle approach, and exceptional results. She stays current with the latest industry trends and technologies, ensuring her clients receive the most effective and safe treatments available. Her warm demeanor and expertise create a comfortable environment where clients feel confident and well-cared for throughout their skincare journey.",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2070",
    },
    {
      name: "Holly Schuster",
      title: "Co-Founder",
      bio: "With more than 20 years of dynamic experience as a small business owner across the hospitality, real estate, and consulting sectors, Holly developed a rich and diverse skill set that has shaped her professional journey.",
      fullBio: "With more than 20 years of dynamic experience as a small business owner across the hospitality, real estate, and consulting sectors, Holly developed a rich and diverse skill set that has shaped her professional journey. Her multifaceted background has equipped her with a deep understanding of operational excellence, client relations, and strategic business development. Holly's entrepreneurial spirit and dedication to creating meaningful customer experiences led her to co-found Virginia Laser Specialists, where she brings her business acumen and passion for wellness together. She is committed to building a welcoming, inclusive practice that prioritizes client comfort, satisfaction, and outstanding results. Holly's vision for Virginia Laser Specialists is rooted in authenticity, professionalism, and a genuine desire to help every client feel confident and beautiful.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2088",
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
