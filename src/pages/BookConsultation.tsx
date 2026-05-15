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
import { Calendar, CheckCircle, ExternalLink, Clock, Phone, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { toast } from "sonner";
import { z } from "zod";
import { pushEvent, getStoredUtms, fireGadsConversion } from "@/lib/analytics";

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

const TREATMENT_OPTIONS = [
  "CoolPeel Laser Skin Resurfacing",
  "Laser Hair Removal",
  "Other / Not Sure",
];

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
  // 1-hour increments
  for (let m = startMin; m < endMin; m += 60) {
    const h = Math.floor(m / 60);
    const mi = m % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${mi.toString().padStart(2, "0")}`);
  }
  return slots;
}

function generateDates(days: number): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  const today = new Date(now.toLocaleString("en-US", { timeZone: TIMEZONE }));
  for (let i = 1; i <= days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    if (BUSINESS_HOURS[dow]) dates.push(d);
  }
  return dates;
}

// DST-aware America/New_York offset for a given local date+time.
function etOffsetFor(dateStr: string, time: string): string {
  const asUtc = new Date(`${dateStr}T${time}:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    timeZoneName: "longOffset",
  }).formatToParts(asUtc);
  const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT-05:00";
  const m = tz.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
  if (!m) return "-05:00";
  return `${m[1]}${m[2].padStart(2, "0")}:${(m[3] ?? "00").padStart(2, "0")}`;
}

function slotInstant(dateStr: string, time: string): number {
  return new Date(`${dateStr}T${time}:00${etOffsetFor(dateStr, time)}`).getTime();
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

function formatShortDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
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
  const [minAdvanceHours, setMinAdvanceHours] = useState<number>(48);
  const [closureReason, setClosureReason] = useState<string | null>(null);
  const [closedDates, setClosedDates] = useState<Set<string>>(new Set());
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [precheckDone, setPrecheckDone] = useState(false);
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

  const allDates = useMemo(() => generateDates(30), []);
  const availableDates = useMemo(
    () => allDates.filter((d) => !closedDates.has(toDateString(d))),
    [allDates, closedDates],
  );

  // Fetch upcoming office closures
  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await (supabase as any)
        .from("office_closures")
        .select("closure_date")
        .gte("closure_date", today);
      if (data) setClosedDates(new Set(data.map((r: any) => r.closure_date)));
    })();
  }, []);

  // Background precheck: if every date in the next 30 days has zero slots OR
  // we get a real 5xx, fall back to the call-us banner.
  useEffect(() => {
    if (availableDates.length === 0) return;
    let cancelled = false;
    (async () => {
      const sample = availableDates.slice(0, Math.min(availableDates.length, 21));
      let any5xx = false;
      let anyOpen = false;
      const results = await Promise.all(
        sample.map(async (d) => {
          try {
            const res = await supabase.functions.invoke("check-availability", {
              body: { date: toDateString(d) },
            });
            if (res.error) {
              const status = (res.error as any)?.context?.status ?? 0;
              if (status >= 500) any5xx = true;
              return null;
            }
            return res.data;
          } catch {
            any5xx = true;
            return null;
          }
        }),
      );
      if (cancelled) return;
      for (let i = 0; i < sample.length; i++) {
        const data = results[i];
        if (!data) continue;
        const dow = sample[i].getDay();
        const total = generateTimeSlots(dow).length;
        const booked = (data.bookedSlots || []).length;
        if (!data.closed && total - booked > 0) {
          anyOpen = true;
          break;
        }
      }
      if (any5xx || !anyOpen) setFallbackMode(true);
      setPrecheckDone(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [availableDates]);

  // Fetch booked slots for selected date
  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = toDateString(selectedDate);
    setLoadingSlots(true);
    (async () => {
      const res = await supabase.functions.invoke("check-availability", {
        body: { date: dateStr },
      });
      if (res.data?.bookedSlots) setBookedSlots(res.data.bookedSlots);
      else setBookedSlots([]);
      if (typeof res.data?.minAdvanceHours === "number") setMinAdvanceHours(res.data.minAdvanceHours);
      setClosureReason(res.data?.closed ? (res.data.closureReason || "Office closed") : null);
      setLoadingSlots(false);
    })();
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
    const appointmentId = crypto.randomUUID();

    try {
      const { error } = await supabase.from("appointments").insert({
        id: appointmentId,
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

      try {
        await supabase.from("email_leads").insert({
          email: result.data.email,
          source: "booking_form",
          ...Object.fromEntries(Object.entries(utms).filter(([_, v]) => v)),
        } as any);
      } catch {}

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

      try {
        await supabase.functions.invoke("create-calendar-event", {
          body: {
            appointmentId,
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
      } catch (calErr) {
        console.warn("Calendar event creation failed (non-blocking):", calErr);
      }

      pushEvent("booking_submitted", {
        treatment: result.data.treatmentInterest,
        date: dateStr,
        time: selectedTime,
      });
      fireGadsConversion();

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
              <p className="text-lg text-muted-foreground">Your free consultation is scheduled for:</p>
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
                A confirmation email has been sent to <strong>{formData.email}</strong>. We look forward to seeing you!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <a href="/"><Button variant="outline">Back to Home</Button></a>
                <a href="tel:703-547-4499"><Button variant="accent">Call Us: 703-547-4499</Button></a>
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
              {fallbackMode ? (
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
                  <CardHeader className="text-center">
                    <div className="w-14 h-14 mx-auto bg-amber-100 dark:bg-amber-800/40 rounded-full flex items-center justify-center mb-3">
                      <Clock className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                    </div>
                    <CardTitle className="text-2xl text-amber-800 dark:text-amber-300">
                      No Online Slots Available Right Now
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-amber-700 dark:text-amber-400">
                      All upcoming online slots are currently booked. Please call us to schedule:
                    </p>
                    <a href="tel:703-547-4499">
                      <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8">
                        <Phone className="w-5 h-5 mr-2" />
                        703-547-4499
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-accent/30">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-accent" /> Pick a Date &amp; Time
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      All times Eastern. 30-minute complimentary consultation.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Date grid */}
                    <div>
                      <Label className="mb-3 block font-semibold">Select a date</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
                        {availableDates.map((d) => {
                          const isSelected = selectedDate && toDateString(selectedDate) === toDateString(d);
                          return (
                            <button
                              key={toDateString(d)}
                              type="button"
                              onClick={() => setSelectedDate(d)}
                              className={`px-3 py-2 rounded-md border text-sm transition-colors text-left ${
                                isSelected
                                  ? "bg-accent text-primary border-accent font-semibold"
                                  : "bg-background border-border hover:border-accent/60"
                              }`}
                            >
                              {formatShortDate(d)}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time grid */}
                    {selectedDate && (
                      <div>
                        <Label className="mb-3 block font-semibold">
                          Select a time for {formatDate(selectedDate)}
                        </Label>
                        {loadingSlots ? (
                          <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                            <Loader2 className="w-4 h-4 animate-spin" /> Loading availability…
                          </div>
                        ) : closureReason ? (
                          <p className="text-sm text-muted-foreground py-4">
                            Office closed: {closureReason}. Please pick another date.
                          </p>
                        ) : (
                          <TooltipProvider delayDuration={150}>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                              {timeSlots.map((t) => {
                                const dateStr = toDateString(selectedDate);
                                const cutoffMs = Date.now() + minAdvanceHours * 60 * 60 * 1000;
                                const isTooSoon = slotInstant(dateStr, t) < cutoffMs;
                                const isBooked = bookedSlots.includes(t) && !isTooSoon;
                                const isSelected = selectedTime === t;
                                const disabled = isBooked || isTooSoon;
                                const btn = (
                                  <button
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => !disabled && setSelectedTime(t)}
                                    className={`px-2 py-2 rounded-md border text-sm transition-colors w-full ${
                                      isTooSoon
                                        ? "bg-muted text-muted-foreground/60 cursor-not-allowed border-border"
                                        : isBooked
                                          ? "bg-muted text-muted-foreground/50 line-through cursor-not-allowed border-border"
                                          : isSelected
                                            ? "bg-accent text-primary border-accent font-semibold"
                                            : "bg-background border-border hover:border-accent/60"
                                    }`}
                                  >
                                    {formatTime(t)}
                                  </button>
                                );
                                if (isTooSoon) {
                                  return (
                                    <Tooltip key={t}>
                                      <TooltipTrigger asChild>
                                        <span className="block">{btn}</span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Bookings require {minAdvanceHours}h notice — please call 703-547-4499
                                      </TooltipContent>
                                    </Tooltip>
                                  );
                                }
                                return <span key={t}>{btn}</span>;
                              })}
                              {timeSlots.every((t) => {
                                const dateStr = toDateString(selectedDate);
                                const cutoffMs = Date.now() + minAdvanceHours * 60 * 60 * 1000;
                                return bookedSlots.includes(t) || slotInstant(dateStr, t) < cutoffMs;
                              }) && (
                                <p className="col-span-full text-sm text-muted-foreground py-2">
                                  No openings on this date — please pick another.
                                </p>
                              )}
                            </div>
                          </TooltipProvider>
                        )}
                      </div>
                    )}

                    {/* Form */}
                    {selectedDate && selectedTime && !closureReason && (
                      <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-border">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First name *</Label>
                            <Input
                              id="firstName"
                              required
                              value={formData.firstName}
                              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last name *</Label>
                            <Input
                              id="lastName"
                              required
                              value={formData.lastName}
                              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone (optional)</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="treatment">Treatment interest *</Label>
                          <Select
                            value={formData.treatmentInterest}
                            onValueChange={(v) => setFormData({ ...formData, treatmentInterest: v })}
                          >
                            <SelectTrigger id="treatment">
                              <SelectValue placeholder="Select a treatment" />
                            </SelectTrigger>
                            <SelectContent>
                              {TREATMENT_OPTIONS.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="notes">Notes (optional)</Label>
                          <Textarea
                            id="notes"
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          />
                        </div>
                        <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
                          {loading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Booking…</>
                          ) : (
                            <>Confirm {formatTime(selectedTime)} on {formatShortDate(selectedDate)}</>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BookConsultation;
