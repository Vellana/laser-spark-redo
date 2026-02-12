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
import { Phone, MapPin, Clock, Instagram } from "lucide-react";
import { useState } from "react";
import SEO from "@/components/SEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Zod schema for form validation
const contactFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters")
        .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
    email: z
        .string()
        .trim()
        .email("Please enter a valid email address")
        .max(255, "Email must be less than 255 characters"),
    phone: z
        .string()
        .trim()
        .min(10, "Please enter a valid phone number")
        .max(20, "Phone number is too long")
        .regex(
            /^[\d\s()+-]+$/,
            "Phone number can only contain digits, spaces, parentheses, plus, and hyphens"
        ),
    service: z.string().max(50, "Service selection is too long").optional().or(z.literal("")),
    contactMethod: z.enum(["email", "phone", "either"], {
        required_error: "Please select a contact method",
    }),
    message: z
        .string()
        .trim()
        .max(2000, "Message must be less than 2000 characters")
        .optional()
        .or(z.literal("")),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const Contact = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        phone: "",
        service: "",
        contactMethod: "email",
        message: "",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateField = (field: keyof ContactFormData, value: string) => {
        const partialData = { ...formData, [field]: value };
        const result = contactFormSchema.safeParse(partialData);
        
        if (!result.success) {
            const fieldError = result.error.errors.find(err => err.path[0] === field);
            if (fieldError) {
                setErrors(prev => ({ ...prev, [field]: fieldError.message }));
            } else {
                setErrors(prev => ({ ...prev, [field]: undefined }));
            }
        } else {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleInputChange = (field: keyof ContactFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Validate entire form
        const result = contactFormSchema.safeParse(formData);
        
        if (!result.success) {
            const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
            result.error.errors.forEach(err => {
                const field = err.path[0] as keyof ContactFormData;
                if (!newErrors[field]) {
                    newErrors[field] = err.message;
                }
            });
            setErrors(newErrors);
            setIsSubmitting(false);
            
            toast({
                title: "Validation Error",
                description: "Please correct the highlighted fields.",
                variant: "destructive",
            });
            return;
        }

        // Save to database
        const { error: dbError } = await supabase
            .from("contact_inquiries")
            .insert({
                name: result.data.name,
                email: result.data.email,
                phone: result.data.phone,
                service: result.data.service || null,
                contact_method: result.data.contactMethod,
                message: result.data.message || null,
            });

        if (dbError) {
            console.error("Failed to save inquiry:", dbError);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again or call us at 703-547-4499.",
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }

        toast({
            title: "Message Received",
            description: "Thank you for your inquiry! We'll get back to you soon.",
        });
        
        // Reset form
        setFormData({
            name: "",
            email: "",
            phone: "",
            service: "",
            contactMethod: "email",
            message: "",
        });
        setErrors({});
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen">
            <SEO 
                title="Contact Virginia Laser Specialists | Book Free Consultation Tysons VA"
                description="Schedule your free laser consultation at 8100 Boone Blvd, Suite 270, Vienna VA 22182. Call 703-547-4499. Open Tue-Fri 10AM-6PM, Sat 9AM-1PM. Serving Tysons, McLean, Falls Church, Arlington."
                canonicalUrl="/contact"
            />
            <LocalBusinessSchema />
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "Contact", url: "/contact" }
            ]} />
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
                                                    maxLength={100}
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                                    onBlur={(e) => validateField("name", e.target.value)}
                                                    placeholder="John Doe"
                                                    className={errors.name ? "border-destructive" : ""}
                                                    aria-invalid={!!errors.name}
                                                    aria-describedby={errors.name ? "name-error" : undefined}
                                                />
                                                {errors.name && (
                                                    <p id="name-error" className="text-sm text-destructive">{errors.name}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    maxLength={255}
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                    onBlur={(e) => validateField("email", e.target.value)}
                                                    placeholder="john@example.com"
                                                    className={errors.email ? "border-destructive" : ""}
                                                    aria-invalid={!!errors.email}
                                                    aria-describedby={errors.email ? "email-error" : undefined}
                                                />
                                                {errors.email && (
                                                    <p id="email-error" className="text-sm text-destructive">{errors.email}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number *</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    required
                                                    maxLength={20}
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                                    onBlur={(e) => validateField("phone", e.target.value)}
                                                    placeholder="(703) 555-1234"
                                                    className={errors.phone ? "border-destructive" : ""}
                                                    aria-invalid={!!errors.phone}
                                                    aria-describedby={errors.phone ? "phone-error" : undefined}
                                                />
                                                {errors.phone && (
                                                    <p id="phone-error" className="text-sm text-destructive">{errors.phone}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="service">Service Interest</Label>
                                                <Select
                                                    value={formData.service}
                                                    onValueChange={(value) => handleInputChange("service", value)}
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
                                                    onValueChange={(value) => handleInputChange("contactMethod", value as "email" | "phone" | "either")}
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
                                                    maxLength={2000}
                                                    value={formData.message}
                                                    onChange={(e) => handleInputChange("message", e.target.value)}
                                                    onBlur={(e) => validateField("message", e.target.value)}
                                                    placeholder="Tell us about your treatment goals..."
                                                    className={errors.message ? "border-destructive" : ""}
                                                    aria-invalid={!!errors.message}
                                                    aria-describedby={errors.message ? "message-error" : undefined}
                                                />
                                                {errors.message && (
                                                    <p id="message-error" className="text-sm text-destructive">{errors.message}</p>
                                                )}
                                                <p className="text-xs text-muted-foreground text-right">
                                                    {formData.message?.length || 0}/2000 characters
                                                </p>
                                            </div>

                                            <Button
                                                type="submit"
                                                size="lg"
                                                disabled={isSubmitting}
                                                className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold"
                                            >
                                                {isSubmitting ? "Sending..." : "Send Message"}
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
                                                <MapPin className="w-6 h-6 text-accent" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-1">Location</h3>
                                                <a
                                                    href="https://maps.google.com/?q=8100+Boone+Boulevard+Suite+270+Vienna+VA+22182"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-accent transition-colors"
                                                >
                                                    8100 Boone Blvd, Suite 270<br />
                                                    Vienna, VA 22182
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Clock className="w-6 h-6 text-accent" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-1">Hours</h3>
                                                <p className="text-muted-foreground">Tue-Fri: 10am-6pm</p>
                                                <p className="text-muted-foreground">Sat: 9am-1pm</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Instagram className="w-6 h-6 text-accent" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-1">Follow Us</h3>
                                                <a
                                                    href="https://www.instagram.com/virginialaserspecialists/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-accent transition-colors"
                                                >
                                                    @virginialaserspecialists
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Map */}
                                <Card className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <iframe
                                            src="https://maps.google.com/maps?q=8100+Boone+Blvd+Suite+270+Vienna+VA+22182&output=embed"
                                            width="100%"
                                            className="h-64 sm:h-80"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Virginia Laser Specialists Location - 8100 Boone Blvd, Suite 270, Vienna, VA 22182"
                                        />
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
