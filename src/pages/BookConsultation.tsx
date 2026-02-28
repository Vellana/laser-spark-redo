import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, CheckCircle, ExternalLink, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { toast } from "sonner";
import { z } from "zod";
import { pushEvent, getStoredUtms } from "@/lib/analytics";

const VAGARO_URL = "https://www.vagaro.com/virginialaserspecialists/book-now";
const TIMEZONE = "America/New_York";

// Business hours config
const BUSINESS_HOURS: Record<number, { start: string; end: string } | null> = {
  0: null, // Sunday
  1: null, // Monday
  2: { start: "10:00", end: "17:30" }, // Tuesday
  3: { start: "10:00", end: "17:30" }, // Wednesday
  4: { start: "10:00", end: "17:30" }, // Thursday
  5: { start: "10:00", end: "17:30" }, // Friday
  6: { start: "09:00", end: "12:30" }, // Saturday
};

const bookingSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().max(20).regex(/^[\d\s()+-]*$/, "Invalid phone format").optional().or(z.literal("")),
  treatmentInterest: z.string().min(1, "Please select a treatment"),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

function generateTimeSlots(dayOfWeek: number): string[] {
  const hours = BUSINESS_HOURS[dayOfWeek];
  if (!hours) return [];
  const [startH, startM] = hours.start.split(":").map(Number);
  const [endH, endM] = hours.end.split(":").map(Number);
  const startMin = startH * 60 + startM;
  const endMin = endH * 60 + endM;
  const slots: string[] = [];
  for (let m = startMin; m < endMin; m += 30) {
    const h = Math.floor(m / 60);
    const mi = m % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${mi.toString().padStart(2, "0")}`);
  }
  return slots;
}

function generateDates(weeks: number): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  const today = new Date(now.toLocaleString("en-US", { timeZone: TIMEZONE }));
  for (let i = 1; i <= weeks * 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    if (BUSINESS_HOURS[dow]) dates.push(d);
  }
  return dates;
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const BookConsultation = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(() => {
    const savedEmail = sessionStorage.getItem("vls_user_email") || "";
    return {
      firstName: "",
      lastName: "",
      email: savedEmail,
      phone: "",
      treatmentInterest: "",
      notes: "",
    };
  });

  const availableDates = useMemo(() => generateDates(4), []);

  // Fetch booked slots for selected date
  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = toDateString(selectedDate);
    
    const fetchBooked = async () => {
      // Use edge function to check availability (bypasses RLS)
      const res = await supabase.functions.invoke("check-availability", {
        body: { date: dateStr },
      });
      if (res.data?.bookedSlots) {
        setBookedSlots(res.data.bookedSlots);
      }
    };
    fetchBooked();
    setSelectedTime(null);
  }, [selectedDate]);

  const timeSlots = selectedDate ? generateTimeSlots(selectedDate.getDay()) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }

    setLoading(true);
    const utms = getStoredUtms();
    const dateStr = toDateString(selectedDate);

    try {
      // Insert appointment
      const { error } = await supabase.from("appointments").insert({
        first_name: result.data.firstName,
        last_name: result.data.lastName,
        email: result.data.email,
        phone: result.data.phone || "",
        treatment_interest: result.data.treatmentInterest,
        notes: result.data.notes || "",
        appointment_date: dateStr,
        appointment_time: selectedTime,
        utm_source: utms.utm_source || null,
        utm_medium: utms.utm_medium || null,
        utm_campaign: utms.utm_campaign || null,
        utm_content: utms.utm_content || null,
        utm_term: utms.utm_term || null,
      } as any);

      if (error) {
        if (error.code === "23505") {
          toast.error("This time slot was just booked. Please choose another.");
          // Refresh slots
          setSelectedTime(null);
          const res = await supabase.functions.invoke("check-availability", {
            body: { date: dateStr },
          });
          if (res.data?.bookedSlots) setBookedSlots(res.data.bookedSlots);
        } else {
          throw error;
        }
        setLoading(false);
        return;
      }

      // Also capture as email lead
      try {
        await supabase.from("email_leads").insert({
          email: result.data.email,
          source: "booking_form",
          ...Object.fromEntries(
            Object.entries(utms).filter(([_, v]) => v)
          ),
        } as any);
      } catch {}

      // Send confirmation emails
      await supabase.functions.invoke("send-booking-confirmation", {
        body: {
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          email: result.data.email,
          phone: result.data.phone || "",
          treatmentInterest: result.data.treatmentInterest,
          notes: result.data.notes || "",
          date: dateStr,
          time: selectedTime,
        },
      });

      pushEvent("booking_submitted", {
        treatment: result.data.treatmentInterest,
        date: dateStr,
        time: selectedTime,
      });

      setSubmitted(true);
    } catch (err) {
      toast.error("Something went wrong. Please try again or call us at 703-547-4499.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-20">
          <section className="py-20 bg-gradient-to-br from-primary/10 to-background">
            <div className="container mx-auto px-4 max-w-2xl text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Consultation Booked!</h1>
              <p className="text-lg text-muted-foreground">
                Your free consultation is scheduled for:
              </p>
              <div className="bg-card border border-border rounded-xl p-6 space-y-2">
                <p className="text-xl font-semibold text-foreground">
                  {selectedDate && formatDate(selectedDate)}
                </p>
                <p className="text-lg text-accent font-medium">
                  {selectedTime && formatTime(selectedTime)} (Eastern)
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  Treatment Interest: {formData.treatmentInterest}
                </p>
              </div>
              <p className="text-muted-foreground">
                A confirmation email has been sent to <strong>{formData.email}</strong>.
                We look forward to seeing you!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <a href="/">
                  <Button variant="outline">Back to Home</Button>
                </a>
                <a href="tel:703-547-4499">
                  <Button variant="accent">Call Us: 703-547-4499</Button>
                </a>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO
        title="Book Free Consultation | Laser Hair Removal & CoolPeel Tysons VA"
        description="Schedule your free laser hair removal or CoolPeel consultation at Virginia Laser Specialists in Tysons, Vienna VA. Book online instantly or via Vagaro. Lutronic Clarity II & Cartessa Tetra Pro. Call 703-547-4499."
        canonicalUrl="/book-free-consultation"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Book Free Consultation", url: "/book-free-consultation" }
      ]} />
      <Navigation />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center max-w-3xl space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Book Your Free Consultation
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose your preferred booking method below. All consultations are complimentary.
            </p>
          </div>
        </section>

        {/* Dual Booking Options */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Vagaro Option */}
              <Card className="border-2 border-border hover:border-accent/50 transition-colors">
                <CardHeader className="text-center pb-4">
                  <div className="w-14 h-14 mx-auto bg-accent/20 rounded-full flex items-center justify-center mb-3">
                    <ExternalLink className="w-7 h-7 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Book via Vagaro</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Use our Vagaro platform for instant online scheduling with automated reminders.
                  </p>
                  <a
                    href={VAGARO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => pushEvent("click_vagaro_booking")}
                  >
                    <Button variant="accent" size="lg" className="w-full">
                      Book on Vagaro <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Direct Booking Option */}
              <Card className="border-2 border-accent/30 bg-accent/5">
                <CardHeader className="text-center pb-4">
                  <div className="w-14 h-14 mx-auto bg-accent/20 rounded-full flex items-center justify-center mb-3">
                    <Calendar className="w-7 h-7 text-accent" />
                  </div>
                  <CardTitle className="text-xl">Book Directly on Website</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Schedule your free 30-minute consultation directly through our website below.
                  </p>
                  <a href="#scheduler">
                    <Button variant="default" size="lg" className="w-full">
                      Schedule Below <Clock className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Direct Scheduler */}
            <div id="scheduler" className="scroll-mt-24">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-accent" />
                    Schedule Your Free Consultation
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">30-minute appointments · Eastern Time</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Step 1: Select Date */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">1. Select a Date</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {availableDates.map((date) => {
                          const isSelected = selectedDate && toDateString(selectedDate) === toDateString(date);
                          return (
                            <button
                              key={toDateString(date)}
                              type="button"
                              onClick={() => setSelectedDate(date)}
                              className={`p-3 rounded-lg border text-sm text-left transition-all ${
                                isSelected
                                  ? "border-accent bg-accent/10 text-foreground font-medium"
                                  : "border-border hover:border-accent/50 text-foreground"
                              }`}
                            >
                              <div className="font-medium">
                                {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 2: Select Time */}
                    {selectedDate && (
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">2. Select a Time</Label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {timeSlots.map((time) => {
                            const isBooked = bookedSlots.includes(time);
                            const isSelected = selectedTime === time;
                            return (
                              <button
                                key={time}
                                type="button"
                                disabled={isBooked}
                                onClick={() => setSelectedTime(time)}
                                className={`p-2 rounded-lg border text-sm text-center transition-all ${
                                  isBooked
                                    ? "border-border bg-muted text-muted-foreground cursor-not-allowed line-through"
                                    : isSelected
                                    ? "border-accent bg-accent/10 text-foreground font-medium"
                                    : "border-border hover:border-accent/50 text-foreground"
                                }`}
                              >
                                {formatTime(time)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Your Information */}
                    {selectedTime && (
                      <div className="space-y-4">
                        <Label className="text-base font-semibold">3. Your Information</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input
                              id="firstName"
                              required
                              maxLength={50}
                              value={formData.firstName}
                              onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                              placeholder="Jane"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input
                              id="lastName"
                              required
                              maxLength={50}
                              value={formData.lastName}
                              onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                              placeholder="Doe"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="bookEmail">Email *</Label>
                            <Input
                              id="bookEmail"
                              type="email"
                              required
                              maxLength={255}
                              value={formData.email}
                              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                              placeholder="jane@example.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bookPhone">Phone</Label>
                            <Input
                              id="bookPhone"
                              type="tel"
                              maxLength={20}
                              value={formData.phone}
                              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                              placeholder="(703) 555-1234"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="treatment">Treatment Interest *</Label>
                          <Select
                            value={formData.treatmentInterest}
                            onValueChange={(v) => setFormData((p) => ({ ...p, treatmentInterest: v }))}
                          >
                            <SelectTrigger id="treatment">
                              <SelectValue placeholder="Select a treatment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CoolPeel">CoolPeel</SelectItem>
                              <SelectItem value="Laser Hair Removal">Laser Hair Removal</SelectItem>
                              <SelectItem value="Tattoo Removal">Tattoo Removal</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Textarea
                            id="notes"
                            maxLength={1000}
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                            placeholder="Any questions or details about your goals..."
                          />
                        </div>

                        {/* Summary */}
                        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 space-y-1">
                          <p className="text-sm font-semibold text-foreground">Your Selected Appointment:</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(selectedDate!)} at {formatTime(selectedTime)} (Eastern)
                          </p>
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          disabled={loading}
                          className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold"
                        >
                          {loading ? "Booking..." : "Confirm Booking"}
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BookConsultation;
