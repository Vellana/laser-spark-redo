import { Card, CardContent } from "@/components/ui/card";

const Team = () => {
  const team = [
    {
      name: "Amy O'Brien Kirschner",
      title: "Licensed Esthetician & Certified Laser Technician",
      bio: "Amy O'Brien Kirschner is a dedicated licensed esthetician and certified laser hair removal technician with over 12 years of experience in the skincare industry.",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2070",
    },
    {
      name: "Holly Schuster",
      title: "Co-Founder",
      bio: "With more than 20 years of dynamic experience as a small business owner across the hospitality, real estate, and consulting sectors, Holly developed a rich and diverse skill set that has shaped her professional journey.",
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
              <CardContent className="p-6">
                <p className="text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
