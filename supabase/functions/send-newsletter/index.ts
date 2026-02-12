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

    const { subject, body } = await req.json();

    if (!subject || !body || typeof subject !== "string" || typeof body !== "string") {
      return new Response(JSON.stringify({ error: "Missing subject or body" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (subject.length > 200 || body.length > 10000) {
      return new Response(JSON.stringify({ error: "Content too long" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Fetch all email leads
    const { data: leads, error: leadsErr } = await supabaseAdmin
      .from("email_leads")
      .select("email")
      .order("subscribed_at", { ascending: false });

    if (leadsErr || !leads?.length) {
      return new Response(JSON.stringify({ error: "No subscribers found" }), {
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
    const textMedium = "#4a5568";

    // Sanitize body for HTML (convert newlines to <br>)
    const sanitizedBody = body.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");

    const newsletterHtml = `
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
      <p style="color:${seafoamLight};margin:0;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;">Newsletter</p>
    </div>
    <div style="padding:40px 32px;">
      <h1 style="color:${textDark};font-size:22px;margin:0 0 24px;font-weight:700;">${subject.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</h1>
      <div style="color:${textMedium};font-size:15px;line-height:1.7;margin:0 0 28px;">
        ${sanitizedBody}
      </div>
      <div style="text-align:center;margin:0 0 28px;">
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

    // Resend supports up to 100 recipients per batch call
    // Send in batches
    const emails = leads.map((l) => l.email);
    const batchSize = 50;
    let sentCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      try {
        // Send individually to avoid BCC exposure
        const batchPromises = batch.map((to) =>
          resend.emails.send({
            from: "Virginia Laser Specialists <hello@virginialaserspecialists.com>",
            to: [to],
            subject: subject.trim(),
            html: newsletterHtml,
            reply_to: "hello@virginialaserspecialists.com",
          })
        );
        const results = await Promise.allSettled(batchPromises);
        results.forEach((r, idx) => {
          if (r.status === "fulfilled") {
            sentCount++;
          } else {
            errors.push(`${batch[idx]}: ${r.reason}`);
          }
        });
      } catch (batchErr: any) {
        console.error("Batch error:", batchErr);
        errors.push(`Batch starting at ${i}: ${batchErr.message}`);
      }
    }

    console.log(`Newsletter sent to ${sentCount}/${emails.length} recipients`);
    if (errors.length) console.error("Send errors:", errors);

    return new Response(
      JSON.stringify({ success: true, sent: sentCount, total: emails.length, errors: errors.length }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error: any) {
    console.error("Error sending newsletter:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
