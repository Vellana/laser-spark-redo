import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Phone, Mail, MapPin, Clock, Instagram } from "lucide-react";
import { useState } from "react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        service: "",
        contactMethod: "email",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add form submission logic (connect to backend/email service)
        console.log("Form submitted:", formData);
        alert("Thank you for your inquiry! We'll get back to you soon.");
    };

    return (
        <div className="min-h-screen">
            <Navigation />
            <main className="pt-20">
                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-br from-primary/10 to-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-4xl mx-auto space-y-6">
                            <h1 className="text-5xl sm:text-6xl font-bold text-foreground">
                                Get in Touch
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Ready to start your laser treatment journey? We'd love to hear from you.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Content */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                            {/* Contact Form */}
                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name *</Label>
                                                <Input
                                                    id="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, name: e.target.value })
                                                    }
                                                    placeholder="John Doe"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, email: e.target.value })
                                                    }
                                                    placeholder="john@example.com"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number *</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, phone: e.target.value })
                                                    }
                                                    placeholder="(703) 555-1234"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="service">Service Interest</Label>
                                                <Select
                                                    value={formData.service}
                                                    onValueChange={(value) =>
                                                        setFormData({ ...formData, service: value })
                                                    }
                                                >
                                                    <SelectTrigger id="service">
                                                        <SelectValue placeholder="Select a service" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="laser-hair-removal">
                                                            Laser Hair Removal
                                                        </SelectItem>
                                                        <SelectItem value="coolpeel">CoolPeel</SelectItem>
                                                        <SelectItem value="deka-pulse">Deka Pulse</SelectItem>
                                                        <SelectItem value="consultation">
                                                            General Consultation
                                                        </SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Preferred Contact Method *</Label>
                                                <RadioGroup
                                                    value={formData.contactMethod}
                                                    onValueChange={(value) =>
                                                        setFormData({ ...formData, contactMethod: value })
                                                    }
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="email" id="email-contact" />
                                                        <Label htmlFor="email-contact" className="font-normal">
                                                            Email
                                                        </Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="phone" id="phone-contact" />
                                                        <Label htmlFor="phone-contact" className="font-normal">
                                                            Phone
                                                        </Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="either" id="either-contact" />
                                                        <Label htmlFor="either-contact" className="font-normal">
                                                            Either
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message">Message</Label>
                                                <Textarea
                                                    id="message"
                                                    rows={5}
                                                    value={formData.message}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, message: e.target.value })
                                                    }
                                                    placeholder="Tell us about your treatment goals..."
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold"
                                            >
                                                Send Message
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Contact Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Phone className="w-6 h-6 text-accent" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                                                <a
                                                    href="tel:703-547-4499"
                                                    className="text-muted-foreground hover:text-accent transition-colors"
                                                >
                                                    703-547-4499
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Mail className="w-6 h-6 text-accent" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                                                <a
                                                    href="mailto:info@virginialaser.com"
                                                    className="text-muted-foreground hover:text-accent transition-colors"
                                                >
                                                    info@virginialaser.com
                                                </a>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    (Placeholder - Update with actual email)
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <MapPin className="w-6 h-6 text-accent" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-1">Location</h3>
                                                <p className="text-muted-foreground">
                                                    Tysons, VA
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    (Full address coming soon)
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Clock className="w-6 h-6 text-accent" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-1">Hours</h3>
                                                <p className="text-muted-foreground">By Appointment Only</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Call to schedule your consultation
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Instagram className="w-6 h-6 text-accent" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-1">Follow Us</h3>
                                                <a
                                                    href="https://instagram.com"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-accent transition-colors"
                                                >
                                                    @virginialaser
                                                </a>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    (Placeholder - Update with actual handle)
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Map Placeholder */}
                                <Card>
                                    <CardContent className="p-0">
                                        <div className="w-full h-64 bg-secondary/30 rounded-lg flex items-center justify-center">
                                            <div className="text-center space-y-2">
                                                <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
                                                <p className="text-muted-foreground">Map Coming Soon</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Google Maps integration pending
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
