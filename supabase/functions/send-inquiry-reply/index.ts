import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

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
    // Verify admin auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
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
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Check admin role
    const { data: isAdmin } = await supabaseAdmin.rpc("has_role", {
      _user_id: claims.claims.sub,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { inquiryId, replyMessage } = await req.json();

    if (!inquiryId || !replyMessage || typeof replyMessage !== "string" || replyMessage.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Missing inquiryId or replyMessage" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Fetch inquiry
    const { data: inquiry, error: fetchErr } = await supabaseAdmin
      .from("contact_inquiries")
      .select("*")
      .eq("id", inquiryId)
      .single();

    if (fetchErr || !inquiry) {
      return new Response(JSON.stringify({ error: "Inquiry not found" }), {
        status: 404,
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
    const textMedium = "#4a5568";

    const replyHtml = `
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
      <p style="color:${seafoamLight};margin:0;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;">Expert Laser Treatments</p>
    </div>
    <div style="padding:40px 32px;">
      <h1 style="color:${textDark};font-size:22px;margin:0 0 16px;font-weight:700;">Hello ${inquiry.name},</h1>
      <p style="color:${textMedium};font-size:15px;line-height:1.7;margin:0 0 24px;">
        Thank you for reaching out to Virginia Laser Specialists. Here is our response to your inquiry:
      </p>
      <div style="background:${cream};border-left:4px solid ${seafoam};border-radius:0 8px 8px 0;padding:20px 24px;margin:0 0 24px;">
        <p style="color:${textDark};font-size:15px;line-height:1.7;margin:0;white-space:pre-wrap;">${replyMessage.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
      </div>
      <p style="color:${textMedium};font-size:14px;line-height:1.6;margin:0 0 24px;">
        If you have any further questions, feel free to reply to this email or call us at <strong style="color:${textDark};">703-547-4499</strong>.
      </p>
      <div style="text-align:center;">
        <a href="https://www.vagaro.com/virginialaserspecialists/book-now" style="display:inline-block;background:${navy};color:${white};padding:14px 36px;text-decoration:none;border-radius:8px;font-size:15px;font-weight:700;">BOOK AN APPOINTMENT</a>
      </div>
    </div>
    <div style="background:${navyDark};padding:28px 32px;text-align:center;">
      <p style="color:${seafoamLight};margin:0 0 6px;font-size:14px;font-weight:700;">Virginia Laser Specialists</p>
      <p style="color:rgba(255,255,255,0.6);margin:0;font-size:12px;">8100 Boone Blvd, Suite 270 · Vienna, VA 22182</p>
      <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:12px;">703-547-4499 · Tue–Fri: 10am–6pm | Sat: 9am–1pm</p>
    </div>
  </div>
</body>
</html>`;

    // Send reply from info@
    const emailResult = await resend.emails.send({
      from: "Virginia Laser Specialists <info@virginialaserspecialists.com>",
      to: [inquiry.email],
      subject: `Re: Your Inquiry – Virginia Laser Specialists`,
      html: replyHtml,
      reply_to: "info@virginialaserspecialists.com",
    });

    console.log("Reply sent:", emailResult);

    // Update inquiry record
    await supabaseAdmin
      .from("contact_inquiries")
      .update({
        admin_reply: replyMessage.trim(),
        replied_at: new Date().toISOString(),
        status: "replied",
      })
      .eq("id", inquiryId);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending reply:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
