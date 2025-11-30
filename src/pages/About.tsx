import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Award, Users, Heart, Shield } from "lucide-react";
import amyImage from "@/assets/amy.png";
import hollyImage from "@/assets/holly.png";
import aboutImage from "@/assets/about-facility.avif";
import { Link } from "react-router-dom";

const About = () => {
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

    const values = [
        {
            icon: Shield,
            title: "Safe & Effective",
            description: "FDA-approved technology and certified technicians ensure your safety and optimal results.",
        },
        {
            icon: Users,
            title: "Welcoming Space for ALL",
            description: "We've created a comfortable, inclusive environment where everyone feels welcome.",
        },
        {
            icon: Heart,
            title: "Lasting Relationships",
            description: "We build trust through expert care, transparency, and genuine client relationships.",
        },
        {
            icon: Award,
            title: "Advanced Technology",
            description: "We invest in the latest laser systems to provide the best treatments available.",
        },
    ];

    return (
        <div className="min-h-screen">
            <Navigation />
            <main className="pt-20">
                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-br from-primary/10 to-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-4xl mx-auto space-y-6">
                            <h1 className="text-5xl sm:text-6xl font-bold text-foreground">
                                About Virginia Laser Specialists
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Excellence in Laser Technology, Tailored to You
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                            <div className="relative">
                                <div className="relative rounded-2xl overflow-hidden shadow-medium">
                                    <img
                                        src={aboutImage}
                                        alt="Modern laser treatment facility"
                                        className="w-full h-[500px] object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-2xl -z-10" />
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-4xl font-bold text-foreground">
                                    Our Mission
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    At Virginia Laser Specialists, we strive to provide safe and effective
                                    treatments in a comfortable space where ALL are welcome. We are committed
                                    to delivering exceptional results, building lasting relationships with our
                                    clients, and ensuring transparency in every aspect of their experience.
                                </p>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    With over 12 years of combined experience and the most advanced laser
                                    technology available, we offer personalized treatment plans tailored to
                                    your unique skin type, concerns, and goals.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 bg-secondary/30">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-4xl font-bold text-foreground mb-4">
                                Why Choose Us
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Our commitment to excellence goes beyond just treatments
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {values.map((value) => (
                                <Card key={value.title} className="text-center">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                                            <value.icon className="w-8 h-8 text-accent" />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">{value.title}</h3>
                                        <p className="text-muted-foreground">{value.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-4xl font-bold text-foreground mb-4">
                                Meet Our Expert Team
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Dedicated professionals with years of experience in laser treatments
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {team.map((member) => (
                                <Card key={member.name} className="overflow-hidden">
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
                                        <details className="group">
                                            <summary className="cursor-pointer font-semibold text-accent hover:text-accent/80 transition-colors list-none flex items-center gap-2">
                                                Read Full Bio
                                                <CheckCircle2 className="w-4 h-4 group-open:rotate-90 transition-transform" />
                                            </summary>
                                            <p className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line">
                                                {member.fullBio}
                                            </p>
                                        </details>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/5">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto space-y-8">
                            <h2 className="text-4xl font-bold text-foreground">
                                Ready to Get Started?
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                Schedule a free consultation to discuss your goals and create a personalized treatment plan.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="https://www.vagaro.com/virginialaserspecialists/services" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8">
                                        Book Free Consultation
                                    </Button>
                                </a>
                                <Link to="/pricing">
                                    <Button size="lg" variant="outline" className="border-2 font-semibold px-8">
                                        View Pricing
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default About;
