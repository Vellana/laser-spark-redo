import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

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

function generateICS(date: string, time: string, name: string, uid: string, sequence: number): string {
  const [h, m] = time.split(":").map(Number);
  const startDate = `${date.replace(/-/g, "")}T${time.replace(":", "").padEnd(6, "0").slice(0, 6)}`;
  const endH = m + 30 >= 60 ? h + 1 : h;
  const endM = (m + 30) % 60;
  const endDate = `${date.replace(/-/g, "")}T${endH.toString().padStart(2, "0")}${endM.toString().padStart(2, "0")}00`;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "METHOD:REQUEST",
    "PRODID:-//Virginia Laser Specialists//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${uid}@virginialaserspecialists.com`,
    `SEQUENCE:${sequence}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=America/New_York:${startDate}`,
    `DTEND;TZID=America/New_York:${endDate}`,
    `SUMMARY:Free Consultation - Virginia Laser Specialists (Updated)`,
    `DESCRIPTION:Consultation for ${name} at Virginia Laser Specialists\\n8100 Boone Blvd\\, Suite 270\\, Vienna\\, VA 22182\\nPhone: 703-547-4499`,
    `LOCATION:8100 Boone Blvd\\, Suite 270\\, Vienna\\, VA 22182`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { appointmentId, oldDate, oldTime } = body;

    if (!appointmentId || !oldDate || !oldTime) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: apt, error } = await supabaseAdmin
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .maybeSingle();

    if (error || !apt) {
      return new Response(JSON.stringify({ error: "Appointment not found" }), {
        status: 404, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { first_name, last_name, email, appointment_date, appointment_time, treatment_interest } = apt as any;
    const fullName = `${first_name} ${last_name}`;
    const newFormattedDate = formatDate(appointment_date);
    const newFormattedTime = formatTime(appointment_time);
    const oldFormattedDate = formatDate(oldDate);
    const oldFormattedTime = formatTime(oldTime);

    const esc = (s: any) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

    const LOGO_URL = "https://xdjynkgqksdbtbetmrsj.supabase.co/storage/v1/object/public/email-assets/logo.png";
    const navy = "#3d5a80";
    const navyDark = "#2c4360";
    const seafoamLight = "#85ccb3";
    const cream = "#f8f7f4";
    const white = "#ffffff";
    const textDark = "#1f2d3d";
    const textMedium = "#2d3748";

    // Bump sequence by current second to ensure clients accept the update
    const sequence = Math.floor(Date.now() / 1000) % 1000000;
    const icsContent = generateICS(appointment_date, appointment_time, fullName, appointmentId, sequence);
    const icsBase64 = btoa(icsContent);

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background-color:${cream};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:${white};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(61,90,128,0.10);">
    <div style="background:${navy};padding:32px 30px;text-align:center;">
      <img src="${LOGO_URL}" alt="Virginia Laser Specialists" width="160" style="display:block;margin:0 auto 16px;max-width:160px;height:auto;" />
      <p style="color:${seafoamLight};margin:0;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;">Appointment Rescheduled</p>
    </div>
    <div style="padding:40px 32px;text-align:center;">
      <h1 style="color:${textDark};font-size:22px;margin:0 0 16px;font-weight:700;">Your Appointment Has Been Updated, ${esc(first_name)}</h1>
      <p style="color:${textMedium};font-size:15px;line-height:1.7;margin:0 0 24px;">Your free consultation has been rescheduled. Here are the new details:</p>

      <div style="background:${cream};border:2px solid ${navy};border-radius:12px;padding:24px;text-align:center;margin:0 0 16px;">
        <p style="color:${navy};font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;font-weight:600;">New Appointment</p>
        <p style="color:${textDark};font-size:20px;font-weight:700;margin:0 0 4px;">${newFormattedDate}</p>
        <p style="color:${navy};font-size:24px;font-weight:800;margin:0;">${newFormattedTime} ET</p>
        <p style="color:${textMedium};font-size:14px;margin:8px 0 0;">Treatment: ${esc(treatment_interest)}</p>
      </div>

      <div style="background:#fff8e1;border:1px solid #ffd54f;border-radius:8px;padding:12px;margin:0 0 24px;">
        <p style="color:#795548;font-size:13px;margin:0;"><strong>Previously scheduled:</strong> ${oldFormattedDate} at ${oldFormattedTime} ET</p>
      </div>

      <p style="color:${textMedium};font-size:14px;line-height:1.6;margin:0 0 8px;"><strong>Location:</strong> 8100 Boone Blvd, Suite 270, Vienna, VA 22182</p>
      <p style="color:${textMedium};font-size:13px;margin:0 0 20px;">Questions? Call us at <strong style="color:${textDark};">703-547-4499</strong></p>
    </div>
    <div style="background:${navyDark};padding:28px 32px;text-align:center;">
      <p style="color:${seafoamLight};margin:0 0 6px;font-size:14px;font-weight:700;">Virginia Laser Specialists</p>
      <p style="color:rgba(255,255,255,0.6);margin:0;font-size:12px;">8100 Boone Blvd, Suite 270 · Vienna, VA 22182</p>
      <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:12px;">703-547-4499 · Tue–Fri: 10am–6pm | Sat: 9am–1pm</p>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: "Virginia Laser Specialists <noreply@virginialaserspecialists.com>",
      to: [email],
      subject: `Appointment Rescheduled — ${newFormattedDate} at ${newFormattedTime}`,
      html,
      attachments: [
        { filename: "consultation.ics", content: icsBase64, content_type: "text/calendar" },
      ],
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    console.error("Reschedule email error:", err);
    return new Response(JSON.stringify({ error: "Failed to send reschedule email" }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
