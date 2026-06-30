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
    const cronSecretHeader = req.headers.get("x-cron-secret");
    const cronSecret = Deno.env.get("CRON_SECRET");
    const isCronCall = !!cronSecret && cronSecretHeader === cronSecret;

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let userId: string | null = null;
    let userEmail: string | null = null;

    if (!isCronCall) {
      // Verify admin auth
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

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

      userId = claims.claims.sub as string;
      userEmail = (claims.claims as any).email ?? null;
    }


    const { subject, body, imageUrls, singleRecipient, recipientEmails, attachments: attachmentInput } = await req.json();

    if (!subject || !body || typeof subject !== "string" || typeof body !== "string") {
      return new Response(JSON.stringify({ error: "Missing subject or body" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (subject.length > 500 || body.length > 10_000_000) {
      return new Response(JSON.stringify({ error: "Content too long (max 500 char subject, 10M char body)" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Build image HTML if any image URLs provided
    const images: string[] = Array.isArray(imageUrls) ? imageUrls.filter((u: any) => typeof u === "string" && u.startsWith("http")) : [];
    const imagesHtml = images.length > 0
      ? images.map((url: string) => `<div style="text-align:center;margin:0 0 20px;"><img src="${url}" alt="Newsletter image" style="max-width:100%;height:auto;border-radius:8px;" /></div>`).join("")
      : "";

    // Normalize attachments: accept [{url,name,contentType?}] from client.
    // Fetch once, base64-encode, reuse across all sends. Resend caps total message size ~40MB.
    type Attachment = { filename: string; content: string; content_type?: string };
    const rawAttachments: any[] = Array.isArray(attachmentInput) ? attachmentInput : [];
    const fetchedAttachments: Attachment[] = [];
    let totalAttachmentBytes = 0;
    const MAX_TOTAL_ATTACHMENT_BYTES = 35 * 1024 * 1024;
    for (const a of rawAttachments) {
      if (!a || typeof a.url !== "string" || !a.url.startsWith("http")) continue;
      try {
        const r = await fetch(a.url);
        if (!r.ok) { console.error("Attachment fetch failed:", a.url, r.status); continue; }
        const buf = new Uint8Array(await r.arrayBuffer());
        totalAttachmentBytes += buf.byteLength;
        if (totalAttachmentBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
          console.error("Attachment total exceeds 35MB cap; skipping remaining");
          break;
        }
        let bin = "";
        const CHUNK = 0x8000;
        for (let i = 0; i < buf.length; i += CHUNK) {
          bin += String.fromCharCode.apply(null, Array.from(buf.subarray(i, i + CHUNK)) as any);
        }
        const b64 = btoa(bin);
        const filename = (typeof a.name === "string" && a.name.trim())
          ? a.name.trim().replace(/[\r\n"<>]/g, "").slice(0, 200)
          : (a.url.split("/").pop() || "attachment");
        fetchedAttachments.push({
          filename,
          content: b64,
          content_type: typeof a.contentType === "string" ? a.contentType : undefined,
        });
      } catch (err) {
        console.error("Attachment fetch error:", a?.url, err);
      }
    }

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
      // Strip MS Office conditional comments (<!--[if ...]>...<![endif]-->)
      s = s.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, "");
      // Strip Word/Outlook namespaced tags (<o:p>, <w:*>, <v:*>, <m:*>, etc.)
      s = s.replace(/<\/?[a-z]+:[a-z0-9]+[^>]*>/gi, "");
      // Remove script tags, iframes, objects, embeds, style tags, SVGs
      s = s.replace(/<(script|iframe|object|embed|style|svg|form|input|textarea|button|link|meta|base)[\s\S]*?<\/\1>/gi, "");
      s = s.replace(/<(script|iframe|object|embed|style|svg|form|input|textarea|button|link|meta|base)[^>]*\/?>/gi, "");
      // Remove event handlers
      s = s.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "");
      // Remove javascript:/vbscript: URIs in href/src attributes
      s = s.replace(/(href|src)\s*=\s*(?:"(?:javascript|vbscript):[^"]*"|'(?:javascript|vbscript):[^']*')/gi, "$1=\"\"");
      // Strip <img> tags that reference local-only sources (cid:, file:, blob:) — they break in inboxes
      s = s.replace(/<img[^>]+src\s*=\s*["'](?:cid|file|blob):[^"']*["'][^>]*\/?>/gi, "");
      // Drop base64 data: image payloads (often huge, frequently rejected) — keep other data: uris removed too
      s = s.replace(/(href|src)\s*=\s*(?:"data:[^"]*"|'data:[^']*')/gi, "$1=\"\"");
      // Remove any remaining script-like content
      s = s.replace(/javascript\s*:/gi, "");
      // Collapse empty paragraphs left behind by Word
      s = s.replace(/<p[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "");
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
      <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:12px;">703-752-6608 · Tue–Fri: 10am–6pm | Sat: 9am–1pm</p>
      <p style="color:rgba(255,255,255,0.6);margin:16px 0 0;font-size:11px;line-height:1.5;">
        You're receiving this email because you subscribed to updates from Virginia Laser Specialists.<br>
        <a href="https://virginialaserspecialists.com/unsubscribe" style="color:${seafoamLight};text-decoration:underline;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;

    // Send via Resend batch endpoint to stay well within edge-function time limits.
    // Resend batch: up to 100 emails per request, 2 req/sec default -> ~200 emails/sec.
    // We chunk recipients, send each chunk as a batch, retry rate-limit errors,
    // and fall back to per-recipient sends only if a whole batch fails.
    const emails = Array.from(new Set(leads.map((l) => l.email.toLowerCase().trim())));
    let sentCount = 0;
    const errors: string[] = [];
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const BATCH_SIZE = 100;
    const BATCH_GAP_MS = 600; // <2 req/sec to respect Resend default limit

    const buildPayload = (to: string) => {
      const p: any = {
        from: "Virginia Laser Specialists <hello@virginialaserspecialists.com>",
        to: [to],
        subject: subject.trim(),
        html: newsletterHtml,
        reply_to: "hello@virginialaserspecialists.com",
      };
      if (fetchedAttachments.length > 0) p.attachments = fetchedAttachments;
      return p;
    };

    const sendOne = async (to: string, attempt = 1): Promise<void> => {
      try {
        const result: any = await resend.emails.send(buildPayload(to));
        if (result?.error) {
          const errName = result.error?.name || "";
          const errMsg = result.error?.message || JSON.stringify(result.error);
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

    const sendBatch = async (chunk: string[], attempt = 1): Promise<void> => {
      try {
        const payloads = chunk.map(buildPayload);
        const result: any = await (resend as any).batch.send(payloads);
        if (result?.error) {
          const errMsg = result.error?.message || JSON.stringify(result.error);
          if (attempt < 4 && /rate|429|too_many/i.test(errMsg)) {
            await sleep(1000 * attempt);
            return sendBatch(chunk, attempt + 1);
          }
          // Batch-level failure -> fall back to per-recipient with throttling
          for (const to of chunk) {
            await sendOne(to);
            await sleep(250);
          }
          return;
        }
        // Resend batch returns { data: [{ id }, ...] } in submission order
        const items: any[] = Array.isArray(result?.data) ? result.data
          : Array.isArray(result?.data?.data) ? result.data.data : [];
        if (items.length === chunk.length) {
          for (let i = 0; i < chunk.length; i++) {
            if (items[i]?.id) sentCount++;
            else errors.push(`${chunk[i]}: ${items[i]?.error?.message || "no id returned"}`);
          }
        } else {
          // Count succeeded conservatively, then re-try missing ones individually
          sentCount += items.filter((it) => it?.id).length;
          const missingFrom = items.length;
          for (let i = missingFrom; i < chunk.length; i++) {
            await sendOne(chunk[i]);
            await sleep(250);
          }
        }
      } catch (e: any) {
        if (attempt < 3) {
          await sleep(1000 * attempt);
          return sendBatch(chunk, attempt + 1);
        }
        // Fall back to per-recipient if the batch SDK throws
        for (const to of chunk) {
          await sendOne(to);
          await sleep(250);
        }
      }
    };

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const chunk = emails.slice(i, i + BATCH_SIZE);
      await sendBatch(chunk);
      if (i + BATCH_SIZE < emails.length) await sleep(BATCH_GAP_MS);
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
        sent_by: userId,
        sent_by_email: userEmail,
      });
    } catch (logErr) {
      console.error("Failed to log newsletter send:", logErr);
    }

    // Surface a friendlier diagnostic when a known systemic failure occurred
    let hint: string | undefined;
    if (sentCount === 0 && errors.length > 0) {
      const blob = errors.join(" | ").toLowerCase();
      if (/domain.*not.*verified|not_found.*domain|from.*not.*verified/.test(blob)) {
        hint = "Sender domain isn't verified in Resend. Check DNS (SPF/DKIM) for virginialaserspecialists.com.";
      } else if (/daily.*quota|monthly.*quota|quota.*exceeded|plan.*limit/.test(blob)) {
        hint = "Resend account quota hit. Upgrade plan or wait for the quota window to reset.";
      } else if (/invalid.*api.*key|unauthorized|forbidden/.test(blob)) {
        hint = "RESEND_API_KEY is invalid or revoked. Rotate it and re-save.";
      } else if (/suppress|bounced|complained/.test(blob)) {
        hint = "All recipients are on Resend's suppression list (prior bounce/complaint).";
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent: sentCount, total: emails.length, errors: errors.length, hint, sampleErrors: errors.slice(0, 3) }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error: any) {
    console.error("Error sending newsletter:", error);
    return new Response(JSON.stringify({ error: error?.message || "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
