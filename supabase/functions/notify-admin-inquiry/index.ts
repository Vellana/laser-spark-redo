import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, service, contactMethod, message } = await req.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const LOGO_URL = "https://xdjynkgqksdbtbetmrsj.supabase.co/storage/v1/object/public/email-assets/logo.png";
    const navy = "#3d5a80";
    const navyDark = "#2c4360";
    const seafoam = "#6dbfa0";
    const seafoamLight = "#85ccb3";
    const cream = "#f8f7f4";
    const white = "#ffffff";
    const textDark = "#1f2d3d";
    const textMedium = "#2d3748";

    const esc = (s: string | null | undefined) =>
      (s || "N/A").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const notificationHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
</head>
<body style="margin:0;padding:0;background-color:${cream};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:${white};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(61,90,128,0.10);">
    <div style="background:${navy};padding:32px 30px;text-align:center;">
      <img src="${LOGO_URL}" alt="Virginia Laser Specialists" width="160" style="display:block;margin:0 auto 16px;max-width:160px;height:auto;" />
      <p style="color:${white};margin:0;font-size:20px;letter-spacing:2.5px;text-transform:uppercase;font-family:Georgia,'Times New Roman',serif;font-weight:400;">Virginia Laser Specialists</p>
    </div>
    <div style="padding:40px 32px;">
      <h1 style="color:${textDark};font-size:22px;margin:0 0 8px;font-weight:700;">📩 New Contact Inquiry</h1>
      <p style="color:${textMedium};font-size:14px;line-height:1.5;margin:0 0 24px;">
        A new inquiry has been submitted on the website. Details below:
      </p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
        <tr>
          <td style="padding:10px 12px;background:${cream};border-bottom:1px solid #e2e8f0;font-weight:700;color:${textDark};font-size:14px;width:140px;">Name</td>
          <td style="padding:10px 12px;background:${cream};border-bottom:1px solid #e2e8f0;color:${textMedium};font-size:14px;">${esc(name)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;color:${textDark};font-size:14px;">Email</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:${textMedium};font-size:14px;"><a href="mailto:${esc(email)}" style="color:${seafoam};">${esc(email)}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 12px;background:${cream};border-bottom:1px solid #e2e8f0;font-weight:700;color:${textDark};font-size:14px;">Phone</td>
          <td style="padding:10px 12px;background:${cream};border-bottom:1px solid #e2e8f0;color:${textMedium};font-size:14px;">${esc(phone)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;color:${textDark};font-size:14px;">Service Interest</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:${textMedium};font-size:14px;">${esc(service)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;background:${cream};border-bottom:1px solid #e2e8f0;font-weight:700;color:${textDark};font-size:14px;">Preferred Contact</td>
          <td style="padding:10px 12px;background:${cream};border-bottom:1px solid #e2e8f0;color:${textMedium};font-size:14px;">${esc(contactMethod)}</td>
        </tr>
      </table>
      ${message ? `
      <div style="background:${cream};border-left:4px solid ${seafoam};border-radius:0 8px 8px 0;padding:16px 20px;margin:0 0 24px;">
        <p style="color:${textDark};font-size:13px;font-weight:700;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Message</p>
        <p style="color:${textMedium};font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap;">${esc(message)}</p>
      </div>` : ""}
      <div style="text-align:center;">
        <a href="https://laser-spark-redo.lovable.app/admin" style="display:inline-block;background:${navy};color:${white};padding:14px 36px;text-decoration:none;border-radius:8px;font-size:15px;font-weight:700;">VIEW IN ADMIN DASHBOARD</a>
      </div>
    </div>
    <div style="background:${navyDark};padding:20px 32px;text-align:center;">
      <p style="color:${seafoamLight};margin:0 0 4px;font-size:13px;font-weight:700;">Virginia Laser Specialists – Admin Notification</p>
      <p style="color:rgba(255,255,255,0.5);margin:0;font-size:11px;">This is an automated notification. Do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;

    const emailResult = await resend.emails.send({
      from: "Virginia Laser Specialists <info@virginialaserspecialists.com>",
      to: ["info@virginialaserspecialists.com"],
      subject: `New Inquiry from ${name} – ${service || "General"}`,
      html: notificationHtml,
    });

    console.log("Admin notification sent:", emailResult);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending admin notification:", error);
    return new Response(JSON.stringify({ error: "Failed to send notification" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
