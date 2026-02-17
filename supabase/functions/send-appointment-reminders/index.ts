import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
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

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Find appointments happening in ~24 hours that haven't had reminders sent
    // We check for appointments between 23 and 25 hours from now to handle hourly cron drift
    const now = new Date();
    const from23h = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const to25h = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    // Get the date range (could span two days)
    const dates = new Set<string>();
    dates.add(from23h.toLocaleDateString("en-CA", { timeZone: "America/New_York" }));
    dates.add(to25h.toLocaleDateString("en-CA", { timeZone: "America/New_York" }));

    const { data: appointments, error } = await supabaseAdmin
      .from("appointments")
      .select("*")
      .in("appointment_date", Array.from(dates))
      .eq("status", "confirmed")
      .eq("reminder_sent", false);

    if (error) throw error;
    if (!appointments || appointments.length === 0) {
      return new Response(JSON.stringify({ message: "No reminders to send", count: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Filter to only those actually within the 23-25 hour window
    const remindable = appointments.filter((apt: any) => {
      const [h, m] = apt.appointment_time.substring(0, 5).split(":").map(Number);
      const aptDate = new Date(apt.appointment_date + "T00:00:00");
      // Create appointment datetime in ET
      const etFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", hour12: false,
      });
      // Approximate: construct datetime and compare
      const aptDateTime = new Date(`${apt.appointment_date}T${apt.appointment_time.substring(0, 5)}:00-05:00`);
      const diffMs = aptDateTime.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours >= 23 && diffHours <= 25;
    });

    const LOGO_URL = "https://xdjynkgqksdbtbetmrsj.supabase.co/storage/v1/object/public/email-assets/logo.png";
    const ADMIN_EMAIL = "admin@virginialaserspecialists.com";
    const navy = "#3d5a80";
    const navyDark = "#2c4360";
    const seafoamLight = "#85ccb3";
    const cream = "#f8f7f4";
    const white = "#ffffff";
    const textDark = "#1f2d3d";
    const textMedium = "#2d3748";

    const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=8100+Boone+Blvd+Suite+270+Vienna+VA+22182";
    const APPLE_MAPS_URL = "https://maps.apple.com/?address=8100+Boone+Blvd,+Suite+270,+Vienna,+VA+22182";

    let sentCount = 0;

    for (const apt of remindable) {
      const fullName = `${apt.first_name} ${apt.last_name}`;
      const formattedDate = formatDate(apt.appointment_date);
      const formattedTime = formatTime(apt.appointment_time.substring(0, 5));

      // Client reminder email
      const clientHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background-color:${cream};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:${white};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(61,90,128,0.10);">
    <div style="background:${navy};padding:32px 30px;text-align:center;">
      <img src="${LOGO_URL}" alt="Virginia Laser Specialists" width="160" style="display:block;margin:0 auto 16px;max-width:160px;height:auto;" />
      <p style="color:${seafoamLight};margin:0;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;">Appointment Reminder</p>
    </div>
    <div style="padding:40px 32px;text-align:center;">
      <h1 style="color:${textDark};font-size:22px;margin:0 0 16px;font-weight:700;">See You Tomorrow, ${apt.first_name}!</h1>
      <p style="color:${textMedium};font-size:15px;line-height:1.7;margin:0 0 24px;">This is a friendly reminder about your upcoming consultation at Virginia Laser Specialists.</p>
      
      <!-- Appointment Details -->
      <div style="background:${cream};border:2px solid ${navy};border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
        <p style="color:${navy};font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;font-weight:600;">Your Appointment</p>
        <p style="color:${textDark};font-size:20px;font-weight:700;margin:0 0 4px;">${formattedDate}</p>
        <p style="color:${navy};font-size:24px;font-weight:800;margin:0;">${formattedTime} ET</p>
        <p style="color:${textMedium};font-size:14px;margin:8px 0 0;">Treatment: ${apt.treatment_interest}</p>
      </div>

      <!-- Location Details -->
      <div style="background:${cream};border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
        <p style="color:${navy};font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;font-weight:600;">📍 Location</p>
        <p style="color:${textDark};font-size:16px;font-weight:700;margin:0;">Virginia Laser Specialists</p>
        <p style="color:${textMedium};font-size:14px;margin:6px 0 0;line-height:1.6;">8100 Boone Blvd, Suite 270<br/>Vienna, VA 22182</p>
        <p style="color:${textMedium};font-size:13px;margin:8px 0 0;">(Located in the Tysons/Vienna area, near Tysons Corner)</p>
        <div style="margin-top:16px;">
          <a href="${GOOGLE_MAPS_URL}" target="_blank" style="display:inline-block;background:${navy};color:${white};text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;margin:4px;">📍 Google Maps</a>
          <a href="${APPLE_MAPS_URL}" target="_blank" style="display:inline-block;background:${navy};color:${white};text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;margin:4px;">🗺️ Apple Maps</a>
        </div>
      </div>

      <!-- What to Expect -->
      <div style="text-align:left;background:${cream};border-radius:12px;padding:24px;margin:0 0 24px;">
        <p style="color:${navy};font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;font-weight:600;text-align:center;">What to Expect</p>
        <ul style="color:${textMedium};font-size:14px;line-height:1.8;padding-left:20px;margin:0;">
          <li>Your consultation is <strong style="color:${textDark};">completely free</strong> — no obligation</li>
          <li>Plan for approximately <strong style="color:${textDark};">30 minutes</strong></li>
          <li>Come with any questions about your treatment goals</li>
          <li>Free parking available on-site</li>
        </ul>
      </div>

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

      // Admin reminder email (concise)
      const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background-color:${cream};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:500px;margin:0 auto;background:${white};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(61,90,128,0.10);">
    <div style="background:${navy};padding:24px;text-align:center;">
      <img src="${LOGO_URL}" alt="VLS" width="120" style="display:block;margin:0 auto;max-width:120px;height:auto;" />
    </div>
    <div style="padding:28px 24px;">
      <h2 style="color:${textDark};font-size:18px;margin:0 0 12px;">⏰ Tomorrow's Appointment Reminder</h2>
      <div style="background:${cream};border-radius:8px;padding:16px;">
        <p style="margin:0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Client:</strong> ${fullName}</p>
        <p style="margin:8px 0 0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Email:</strong> ${apt.email}</p>
        <p style="margin:8px 0 0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Phone:</strong> ${apt.phone || "Not provided"}</p>
        <p style="margin:8px 0 0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Treatment:</strong> ${apt.treatment_interest}</p>
        <p style="margin:8px 0 0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Date:</strong> ${formattedDate}</p>
        <p style="margin:8px 0 0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Time:</strong> ${formattedTime} ET</p>
        ${apt.notes ? `<p style="margin:8px 0 0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Notes:</strong> ${String(apt.notes).replace(/</g, "&lt;")}</p>` : ""}
      </div>
    </div>
  </div>
</body>
</html>`;

      try {
        // Send client reminder
        await resend.emails.send({
          from: "Virginia Laser Specialists <noreply@virginialaserspecialists.com>",
          to: [apt.email],
          subject: `Reminder: Your Consultation Tomorrow at ${formattedTime} — Virginia Laser Specialists`,
          html: clientHtml,
        });

        // Send admin reminder
        await resend.emails.send({
          from: "Virginia Laser Specialists <noreply@virginialaserspecialists.com>",
          to: [ADMIN_EMAIL],
          subject: `Tomorrow: ${fullName} — ${formattedDate} ${formattedTime}`,
          html: adminHtml,
        });

        // Mark reminder as sent
        await supabaseAdmin
          .from("appointments")
          .update({ reminder_sent: true })
          .eq("id", apt.id);

        sentCount++;
      } catch (emailErr: any) {
        console.error(`Failed to send reminder for appointment ${apt.id}:`, emailErr);
      }
    }

    return new Response(JSON.stringify({ message: `Sent ${sentCount} reminders`, count: sentCount }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    console.error("Reminder error:", err);
    return new Response(JSON.stringify({ error: "Failed to process reminders" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
