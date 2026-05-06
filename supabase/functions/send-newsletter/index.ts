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

    const { subject, body, imageUrls, singleRecipient, recipientEmails } = await req.json();

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

    // Build image HTML if any image URLs provided
    const images: string[] = Array.isArray(imageUrls) ? imageUrls.filter((u: any) => typeof u === "string" && u.startsWith("http")) : [];
    const imagesHtml = images.length > 0
      ? images.map((url: string) => `<div style="text-align:center;margin:0 0 20px;"><img src="${url}" alt="Newsletter image" style="max-width:100%;height:auto;border-radius:8px;" /></div>`).join("")
      : "";

    let leads: { email: string }[] | null = null;

    if (typeof singleRecipient === "string" && singleRecipient.trim()) {
      const r = singleRecipient.trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r)) {
        return new Response(JSON.stringify({ error: "Invalid recipient email" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      leads = [{ email: r }];
    } else if (Array.isArray(recipientEmails) && recipientEmails.length > 0) {
      const cleaned = Array.from(new Set(
        recipientEmails
          .filter((e: any) => typeof e === "string")
          .map((e: string) => e.trim().toLowerCase())
          .filter((e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e))
      ));
      if (cleaned.length === 0) {
        return new Response(JSON.stringify({ error: "No valid recipients" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      // Honor opt-outs: filter out any opted-out subscribers
      const { data: optedOut } = await supabaseAdmin
        .from("email_subscribers")
        .select("email")
        .in("email", cleaned)
        .eq("opted_out", true);
      const blocked = new Set((optedOut || []).map((r: any) => r.email.toLowerCase()));
      leads = cleaned.filter((e) => !blocked.has(e)).map((email) => ({ email }));
      if (leads.length === 0) {
        return new Response(JSON.stringify({ error: "All selected recipients have opted out" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    } else {
      // Fetch active subscribers (honor opt-outs)
      const { data, error: leadsErr } = await supabaseAdmin
        .from("email_subscribers")
        .select("email")
        .eq("subscribed", true)
        .eq("opted_out", false);

      if (leadsErr || !data?.length) {
        return new Response(JSON.stringify({ error: "No subscribers found" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      leads = data;
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

    // Sanitize HTML: allow only safe tags from the formatting toolbar
    const ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'u', 'b', 'i', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'span', 'div', 'font'];
    const ALLOWED_ATTR_PATTERN = /\s(?:href|style|color|face|size|class|align)=/i;

    function sanitizeHtml(html: string): string {
      let s = html.trim();
      // Remove script tags, iframes, objects, embeds, style tags, SVGs
      s = s.replace(/<(script|iframe|object|embed|style|svg|form|input|textarea|button|link|meta|base)[\s\S]*?<\/\1>/gi, "");
      s = s.replace(/<(script|iframe|object|embed|style|svg|form|input|textarea|button|link|meta|base)[^>]*\/?>/gi, "");
      // Remove event handlers
      s = s.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "");
      // Remove javascript: and data: URIs in href/src attributes
      s = s.replace(/(href|src)\s*=\s*(?:"(?:javascript|data|vbscript):[^"]*"|'(?:javascript|data|vbscript):[^']*')/gi, "$1=\"\"");
      // Remove any remaining script-like content
      s = s.replace(/javascript\s*:/gi, "");
      s = s.replace(/\n/g, "<br>");
      return s;
    }

    const sanitizedBody = sanitizeHtml(body);

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
      <p style="color:${white};margin:0;font-size:20px;letter-spacing:2.5px;text-transform:uppercase;font-family:Georgia,'Times New Roman',serif;font-weight:400;">Virginia Laser Specialists</p>
    </div>
    <div style="padding:40px 32px;text-align:center;">
      <h1 style="color:${textDark};font-size:22px;margin:0 0 24px;font-weight:700;text-align:center;">${subject.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</h1>
      <div style="color:${textMedium};font-size:15px;line-height:1.7;margin:0 0 28px;text-align:center;">
        ${sanitizedBody}
      </div>
      ${imagesHtml}
      <div style="text-align:center;margin:0 0 28px;">
        <a href="https://www.vagaro.com/virginialaserspecialists/book-now" style="display:inline-block;background:${navy};color:${white};padding:14px 36px;text-decoration:none;border-radius:8px;font-size:15px;font-weight:700;">BOOK AN APPOINTMENT</a>
      </div>
    </div>
    <div style="background:${navyDark};padding:28px 32px;text-align:center;">
      <p style="color:${seafoamLight};margin:0 0 6px;font-size:14px;font-weight:700;">Virginia Laser Specialists</p>
      <p style="color:rgba(255,255,255,0.6);margin:0;font-size:12px;">8100 Boone Blvd, Suite 270 · Vienna, VA 22182</p>
      <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:12px;">703-547-4499 · Tue–Fri: 10am–6pm | Sat: 9am–1pm</p>
      <p style="color:rgba(255,255,255,0.6);margin:16px 0 0;font-size:11px;line-height:1.5;">
        You're receiving this email because you subscribed to updates from Virginia Laser Specialists.<br>
        <a href="https://virginialaserspecialists.com/unsubscribe" style="color:${seafoamLight};text-decoration:underline;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;

    // Send sequentially with throttling to respect Resend rate limits (2 req/s on free, 10 req/s default).
    // Concurrent sends caused silent rate-limit failures (Resend returns {error} instead of throwing).
    const emails = Array.from(new Set(leads.map((l) => l.email.toLowerCase().trim())));
    let sentCount = 0;
    const errors: string[] = [];
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const sendOne = async (to: string, attempt = 1): Promise<void> => {
      try {
        const result: any = await resend.emails.send({
          from: "Virginia Laser Specialists <hello@virginialaserspecialists.com>",
          to: [to],
          subject: subject.trim(),
          html: newsletterHtml,
          reply_to: "hello@virginialaserspecialists.com",
        });
        // Resend returns { data, error } — error does NOT throw
        if (result?.error) {
          const errName = result.error?.name || "";
          const errMsg = result.error?.message || JSON.stringify(result.error);
          // Retry rate-limit errors up to 3 times with backoff
          if (attempt < 4 && /rate|429|too_many/i.test(`${errName} ${errMsg}`)) {
            await sleep(1000 * attempt);
            return sendOne(to, attempt + 1);
          }
          errors.push(`${to}: ${errMsg}`);
          return;
        }
        sentCount++;
      } catch (e: any) {
        if (attempt < 3) {
          await sleep(1000 * attempt);
          return sendOne(to, attempt + 1);
        }
        errors.push(`${to}: ${e?.message || String(e)}`);
      }
    };

    // Throttle: ~2 sends/sec (500ms gap) — safe for Resend free tier and well under default paid limits
    for (const to of emails) {
      await sendOne(to);
      await sleep(500);
    }

    console.log(`Newsletter sent to ${sentCount}/${emails.length} recipients`);
    if (errors.length) console.error("Send errors:", errors);

    // Log send history (best-effort)
    try {
      await supabaseAdmin.from("newsletter_send_log").insert({
        subject: subject.trim(),
        body: body,
        image_urls: images,
        recipient_count: emails.length,
        sent_count: sentCount,
        failed_count: errors.length,
        errors: errors.slice(0, 50),
        sent_by: claims.claims.sub,
        sent_by_email: (claims.claims as any).email ?? null,
      });
    } catch (logErr) {
      console.error("Failed to log newsletter send:", logErr);
    }

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
