import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function generateICS(date: string, time: string, name: string): string {
  const [h, m] = time.split(":").map(Number);
  const dt = new Date(date + "T12:00:00");
  const startDate = `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
  const endH = h;
  const endM = m + 30;
  const endDate = `${date.replace(/-/g, "")}T${(endM >= 60 ? endH + 1 : endH).toString().padStart(2, "0")}${(endM % 60).toString().padStart(2, "0")}00`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Virginia Laser Specialists//Booking//EN",
    "BEGIN:VEVENT",
    `DTSTART;TZID=America/New_York:${startDate}`,
    `DTEND;TZID=America/New_York:${endDate}`,
    `SUMMARY:Free Consultation - Virginia Laser Specialists`,
    `DESCRIPTION:Consultation for ${name} at Virginia Laser Specialists\\n8100 Boone Blvd\\, Suite 270\\, Vienna\\, VA 22182\\nPhone: 703-547-4499`,
    `LOCATION:8100 Boone Blvd\\, Suite 270\\, Vienna\\, VA 22182`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, treatmentInterest, notes, date, time } = body;

    if (!firstName || !lastName || !email || !date || !time || !treatmentInterest) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const LOGO_URL = "https://xdjynkgqksdbtbetmrsj.supabase.co/storage/v1/object/public/email-assets/logo.png";
    const ADMIN_EMAIL = "admin@virginialaserspecialists.com";
    const navy = "#3d5a80";
    const navyDark = "#2c4360";
    const seafoamLight = "#85ccb3";
    const cream = "#f8f7f4";
    const white = "#ffffff";
    const textDark = "#1f2d3d";
    const textMedium = "#2d3748";
    const fullName = `${firstName} ${lastName}`;
    const formattedDate = formatDate(date);
    const formattedTime = formatTime(time);

    const icsContent = generateICS(date, time, fullName);
    const icsBase64 = btoa(icsContent);

    // Client confirmation email
    const clientHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background-color:${cream};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:${white};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(61,90,128,0.10);">
    <div style="background:${navy};padding:32px 30px;text-align:center;">
      <img src="${LOGO_URL}" alt="Virginia Laser Specialists" width="160" style="display:block;margin:0 auto 16px;max-width:160px;height:auto;" />
      <p style="color:${seafoamLight};margin:0;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;">Consultation Confirmed</p>
    </div>
    <div style="padding:40px 32px;text-align:center;">
      <h1 style="color:${textDark};font-size:22px;margin:0 0 16px;font-weight:700;">You're All Set, ${firstName}!</h1>
      <p style="color:${textMedium};font-size:15px;line-height:1.7;margin:0 0 24px;">Your free consultation has been booked. We look forward to meeting you!</p>
      <div style="background:${cream};border:2px solid ${navy};border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
        <p style="color:${navy};font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;font-weight:600;">Your Appointment</p>
        <p style="color:${textDark};font-size:20px;font-weight:700;margin:0 0 4px;">${formattedDate}</p>
        <p style="color:${navy};font-size:24px;font-weight:800;margin:0;">${formattedTime} ET</p>
        <p style="color:${textMedium};font-size:14px;margin:8px 0 0;">Treatment: ${treatmentInterest}</p>
      </div>
      <p style="color:${textMedium};font-size:14px;line-height:1.6;margin:0 0 8px;"><strong>Location:</strong> 8100 Boone Blvd, Suite 270, Vienna, VA 22182</p>
      <p style="color:${textMedium};font-size:13px;margin:0 0 20px;">Need to reschedule? Call us at <strong style="color:${textDark};">703-547-4499</strong></p>
    </div>
    <div style="background:${navyDark};padding:28px 32px;text-align:center;">
      <p style="color:${seafoamLight};margin:0 0 6px;font-size:14px;font-weight:700;">Virginia Laser Specialists</p>
      <p style="color:rgba(255,255,255,0.6);margin:0;font-size:12px;">8100 Boone Blvd, Suite 270 · Vienna, VA 22182</p>
      <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:12px;">703-547-4499 · Tue–Fri: 10am–6pm | Sat: 9am–1pm</p>
    </div>
  </div>
</body>
</html>`;

    // Send to client with ICS attachment
    await resend.emails.send({
      from: "Virginia Laser Specialists <noreply@virginialaserspecialists.com>",
      to: [email],
      subject: `Consultation Confirmed — ${formattedDate} at ${formattedTime}`,
      html: clientHtml,
      attachments: [
        {
          filename: "consultation.ics",
          content: icsBase64,
          content_type: "text/calendar",
        },
      ],
    });

    // Admin notification
    const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:${cream};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:500px;margin:0 auto;background:${white};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(61,90,128,0.10);">
    <div style="background:${navy};padding:24px;text-align:center;">
      <img src="${LOGO_URL}" alt="VLS" width="120" style="display:block;margin:0 auto;max-width:120px;height:auto;" />
    </div>
    <div style="padding:28px 24px;">
      <h2 style="color:${textDark};font-size:18px;margin:0 0 12px;">📅 New Consultation Booking</h2>
      <div style="background:${cream};border-radius:8px;padding:16px;">
        <p style="margin:0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Name:</strong> ${fullName}</p>
        <p style="margin:8px 0 0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Email:</strong> ${email}</p>
        <p style="margin:8px 0 0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Phone:</strong> ${phone || "Not provided"}</p>
        <p style="margin:8px 0 0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Treatment:</strong> ${treatmentInterest}</p>
        <p style="margin:8px 0 0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Date:</strong> ${formattedDate}</p>
        <p style="margin:8px 0 0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Time:</strong> ${formattedTime} ET</p>
        ${notes ? `<p style="margin:8px 0 0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Notes:</strong> ${notes.replace(/</g, "&lt;")}</p>` : ""}
        <p style="margin:8px 0 0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Booked:</strong> ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: "Virginia Laser Specialists <noreply@virginialaserspecialists.com>",
      to: [ADMIN_EMAIL],
      subject: `New Booking: ${fullName} — ${formattedDate} ${formattedTime}`,
      html: adminHtml,
      attachments: [
        {
          filename: "consultation.ics",
          content: icsBase64,
          content_type: "text/calendar",
        },
      ],
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Booking confirmation error:", error);
    return new Response(JSON.stringify({ error: "Failed to send confirmation" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
