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

function generateCancelICS(date: string, time: string, name: string, uid: string): string {
  const startDate = `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Virginia Laser Specialists//Booking//EN",
    "METHOD:CANCEL",
    "BEGIN:VEVENT",
    `UID:${uid}@virginialaserspecialists.com`,
    `DTSTART;TZID=America/New_York:${startDate}`,
    `SUMMARY:CANCELLED - Free Consultation - Virginia Laser Specialists`,
    `DESCRIPTION:This appointment for ${name} has been cancelled.`,
    "STATUS:CANCELLED",
    "SEQUENCE:1",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require admin auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claims, error: claimsErr } = await supabaseUser.auth.getClaims(
      authHeader.replace("Bearer ", ""),
    );
    if (claimsErr || !claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    const { data: isAdmin } = await supabaseAdmin.rpc("has_role", {
      _user_id: claims.claims.sub, _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { firstName, lastName, email, date, time, treatmentInterest, appointmentId } = await req.json();

    if (!firstName || !email || !date || !time || !appointmentId) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const LOGO_URL = "https://xdjynkgqksdbtbetmrsj.supabase.co/storage/v1/object/public/email-assets/logo.png";
    const navy = "#3d5a80";
    const navyDark = "#2c4360";
    const seafoamLight = "#85ccb3";
    const cream = "#f8f7f4";
    const white = "#ffffff";
    const textDark = "#1f2d3d";
    const textMedium = "#2d3748";
    const fullName = `${firstName} ${lastName || ""}`.trim();
    const formattedDate = formatDate(date);
    const formattedTime = formatTime(time);

    const icsContent = generateCancelICS(date, time, fullName, appointmentId);
    const icsBase64 = btoa(icsContent);

    const clientHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background-color:${cream};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:${white};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(61,90,128,0.10);">
    <div style="background:${navy};padding:32px 30px;text-align:center;">
      <img src="${LOGO_URL}" alt="Virginia Laser Specialists" width="160" style="display:block;margin:0 auto 16px;max-width:160px;height:auto;" />
      <p style="color:#ff6b6b;margin:0;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">Appointment Cancelled</p>
    </div>
    <div style="padding:40px 32px;text-align:center;">
      <h1 style="color:${textDark};font-size:22px;margin:0 0 16px;font-weight:700;">Your Appointment Has Been Cancelled</h1>
      <p style="color:${textMedium};font-size:15px;line-height:1.7;margin:0 0 24px;">Hi ${firstName}, your upcoming consultation has been cancelled. We apologize for any inconvenience.</p>
      <div style="background:#fff5f5;border:2px solid #fc8181;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
        <p style="color:#c53030;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;font-weight:600;">Cancelled Appointment</p>
        <p style="color:${textDark};font-size:20px;font-weight:700;margin:0 0 4px;text-decoration:line-through;">${formattedDate}</p>
        <p style="color:#c53030;font-size:24px;font-weight:800;margin:0;text-decoration:line-through;">${formattedTime} ET</p>
        ${treatmentInterest ? `<p style="color:${textMedium};font-size:14px;margin:8px 0 0;">Treatment: ${treatmentInterest}</p>` : ""}
      </div>
      <p style="color:${textMedium};font-size:14px;line-height:1.6;margin:0 0 20px;">To reschedule, please visit our website or call us at <strong style="color:${textDark};">703-547-4499</strong></p>
      <a href="https://virginialaserspecialists.com/book-free-consultation" style="display:inline-block;background:${navy};color:${white};padding:14px 36px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">REBOOK CONSULTATION</a>
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
      from: "Virginia Laser Specialists <info@virginialaserspecialists.com>",
      to: [email],
      subject: `Appointment Cancelled — ${formattedDate}`,
      html: clientHtml,
      attachments: [
        {
          filename: "cancellation.ics",
          content: icsBase64,
          content_type: "text/calendar; method=CANCEL",
        },
      ],
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Cancellation email error:", error);
    return new Response(JSON.stringify({ error: "Failed to send cancellation email" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
