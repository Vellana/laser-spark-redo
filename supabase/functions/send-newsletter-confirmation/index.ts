import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter (per-instance)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 3600000; // 1 hour

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const lastRequest = rateLimitMap.get(email);
  if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW_MS) {
    return true;
  }
  rateLimitMap.set(email, now);
  return false;
}

interface NewsletterRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    // Length check
    if (!email || email.length > 255) {
      return new Response(JSON.stringify({ error: "Invalid email", v: "email-polish-1004" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Check for header injection attempts
    if (/[\r\n]/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid characters" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Rate limiting: 1 email per hour per address
    if (isRateLimited(email)) {
      return new Response(JSON.stringify({ error: "Please wait before requesting another confirmation" }), {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Verify email exists in email_leads table before sending
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: lead, error: lookupError } = await supabaseAdmin
      .from("email_leads")
      .select("id, confirmation_sent")
      .eq("email", email)
      .maybeSingle();

    if (lookupError || !lead) {
      return new Response(JSON.stringify({ error: "Email not found" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Don't resend if already confirmed
    if (lead.confirmation_sent) {
      return new Response(JSON.stringify({ success: true, message: "Already confirmed" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const VAGARO_LINK = "https://www.vagaro.com/virginialaserspecialists/book-now";
    const LOGO_URL = "https://virginialaserspecialists.com/email-assets/logo.png";
    const ADMIN_EMAIL = "admin@virginialaserspecialists.com";

    // Brand colors
    const navy = "#3d5a80";
    const navyDark = "#2c4360";
    const seafoam = "#6dbfa0";
    const seafoamLight = "#85ccb3";
    const cream = "#f8f7f4";
    const white = "#ffffff";
    const textDark = "#1f2d3d";
    const textMedium = "#2d3748";

    const brandedEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
</head>
<body style="margin:0;padding:0;background-color:${cream};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">Here is your 10% welcome code, VLS10, for your next service.</div>
  <div style="max-width:600px;margin:0 auto;background:${white};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(61,90,128,0.10);">
    
    <!-- Header -->
    <div style="background:${navy};padding:32px 30px;text-align:center;">
      <img src="${LOGO_URL}" alt="Virginia Laser Specialists" width="160" style="display:block;margin:0 auto 16px;max-width:160px;height:auto;" />
      <p style="color:${seafoamLight};margin:0;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;">Expert Laser Treatments</p>
    </div>
    
    <!-- Body -->
    <div style="padding:40px 32px;">
      <h1 style="color:${textDark};font-size:22px;margin:0 0 16px;font-weight:700;">Welcome to Our Community!</h1>
      <p style="color:${textMedium};font-size:15px;line-height:1.7;margin:0 0 24px;">
        Thank you for signing up for our newsletter! As promised, here is your exclusive discount.
      </p>
      
      <!-- Discount Box -->
      <div style="background:${cream};border:2px solid ${navy};border-radius:12px;padding:28px;text-align:center;margin:0 0 28px;">
        <p style="color:${navy};font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;font-weight:600;">Your Exclusive Offer</p>
        <p style="color:${navy};font-size:52px;font-weight:800;margin:0;line-height:1;">10% OFF</p>
        <p style="color:${textMedium};font-size:14px;margin:8px 0 0;">Your Next Service</p>
        <p style="color:${navy};font-size:28px;font-weight:800;margin:12px 0 0;letter-spacing:4px;">VLS10</p>
        <p style="color:${textMedium};font-size:12px;margin:6px 0 0;">Use this code when booking</p>
      </div>
      
      <h2 style="color:${textDark};font-size:16px;margin:0 0 12px;font-weight:700;">How to Redeem:</h2>
      <ol style="color:${textMedium};font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 28px;">
        <li style="margin-bottom:6px;"><strong style="color:${textDark};">Book a free consultation</strong> through our online booking system</li>
        <li style="margin-bottom:6px;"><strong style="color:${textDark};">Mention code VLS10</strong> in the notes when booking, or show this email at the clinic</li>
        <li>Enjoy your 10% discount on your next treatment!</li>
      </ol>
      
      <!-- CTA Button -->
      <div style="text-align:center;margin:0 0 28px;">
        <a href="${VAGARO_LINK}" style="display:inline-block;background:${navy};color:${white};padding:14px 36px;text-decoration:none;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.5px;">
          BOOK YOUR FREE CONSULTATION
        </a>
      </div>
      
      <p style="color:${textMedium};font-size:13px;line-height:1.6;margin:0;padding:16px;background:${cream};border-radius:8px;">
        Your discount email: <strong style="color:${textDark};">${email}</strong><br>
        <em>Please mention this email or show it at your appointment to receive your discount.</em>
      </p>
    </div>
    
    <!-- Footer -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${navyDark}" style="width:100%;background:${navyDark};">
      <tr><td align="center" style="padding:28px 24px;text-align:center;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 18px;">
          <tr>
            <td align="center" valign="middle" style="padding:0 8px;"><a href="https://www.instagram.com/virginialaserspecialists" style="color:${seafoamLight};font-size:12px;text-decoration:underline;"><img src="https://virginialaserspecialists.com/email-assets/social-instagram.png" alt="Instagram" width="28" height="28" style="display:block;width:28px;height:28px;border:0;outline:none;text-decoration:none;" /></a></td>
            <td align="center" valign="middle" style="padding:0 8px;"><a href="https://www.facebook.com/profile.php?id=61573588844302" style="color:${seafoamLight};font-size:12px;text-decoration:underline;"><img src="https://virginialaserspecialists.com/email-assets/social-facebook.png" alt="Facebook" width="28" height="28" style="display:block;width:28px;height:28px;border:0;outline:none;text-decoration:none;" /></a></td>
            <td align="center" valign="middle" style="padding:0 8px;"><a href="https://www.tiktok.com/@virginialaserspecialists" style="color:${seafoamLight};font-size:12px;text-decoration:underline;"><img src="https://virginialaserspecialists.com/email-assets/social-tiktok.png" alt="TikTok" width="28" height="28" style="display:block;width:28px;height:28px;border:0;outline:none;text-decoration:none;" /></a></td>
            <td align="center" valign="middle" style="padding:0 8px;"><a href="https://www.linkedin.com/company/virginia-laser-specialists" style="color:${seafoamLight};font-size:12px;text-decoration:underline;"><img src="https://virginialaserspecialists.com/email-assets/social-linkedin.png" alt="LinkedIn" width="28" height="28" style="display:block;width:28px;height:28px;border:0;outline:none;text-decoration:none;" /></a></td>
          </tr>
        </table>
        <p style="margin:0 0 18px;font-size:13px;line-height:1.5;"><a href="https://virginialaserspecialists.com" style="color:${seafoamLight};text-decoration:underline;">virginialaserspecialists.com</a></p>
      <p style="color:${seafoamLight};margin:0 0 6px;font-size:14px;font-weight:700;">Virginia Laser Specialists</p>
      <p style="color:rgba(255,255,255,0.6);margin:0;font-size:12px;">8100 Boone Blvd, Suite 270 · Vienna, VA 22182</p>
      <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:12px;">703-547-4499 · Tue to Fri 10am to 6pm, Sat 9am to 1pm</p>
      <p style="color:rgba(255,255,255,0.6);margin:16px 0 0;font-size:11px;line-height:1.5;">
        You're receiving this email because you signed up for offers from Virginia Laser Specialists.<br>
        <a href="https://virginialaserspecialists.com/unsubscribe" style="color:${seafoamLight};text-decoration:underline;">Unsubscribe</a>
      </p>
      </td></tr>
    </table>
  </div>
</body>
</html>
    `;

    // Send confirmation email to subscriber
    const emailResponse = await resend.emails.send({
      from: "Virginia Laser Specialists <noreply@virginialaserspecialists.com>",
      to: [email],
      reply_to: "info@virginialaserspecialists.com",
      headers: { "List-Unsubscribe": "<https://virginialaserspecialists.com/unsubscribe>" },
      subject: "Welcome! Here's Your 10% Discount - Code VLS10 🎉",
      html: brandedEmailHtml,
    });

    console.log("Newsletter confirmation sent:", emailResponse);

    // Send admin notification
    try {
      const adminNotification = await resend.emails.send({
        from: "Virginia Laser Specialists <noreply@virginialaserspecialists.com>",
        to: [ADMIN_EMAIL],
        subject: `New Newsletter Signup: ${email}`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:${cream};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:500px;margin:0 auto;background:${white};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(61,90,128,0.10);">
    <div style="background:${navy};padding:24px;text-align:center;">
      <img src="${LOGO_URL}" alt="VLS" width="120" style="display:block;margin:0 auto;max-width:120px;height:auto;" />
    </div>
    <div style="padding:28px 24px;">
      <h2 style="color:${textDark};font-size:18px;margin:0 0 12px;">📬 New Newsletter Signup - 10% Discount Claimed</h2>
      <p style="color:${textMedium};font-size:14px;line-height:1.6;margin:0 0 16px;">
        A new visitor has signed up for the newsletter and received their <strong>10% discount code (VLS10)</strong>.
      </p>
      <div style="background:${cream};border-radius:8px;padding:16px;">
        <p style="margin:0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Email:</strong> ${email}</p>
        <p style="margin:8px 0 0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Offer Claimed:</strong> 10% Off Next Service (Code: VLS10)</p>
        <p style="margin:8px 0 0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Source:</strong> Specials Popup - Newsletter Signup</p>
        <p style="margin:8px 0 0;font-size:14px;color:${textMedium};"><strong style="color:${textDark};">Time:</strong> ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}</p>
      </div>
    </div>
  </div>
</body>
</html>
        `,
      });
      console.log("Admin notification sent:", adminNotification);
    } catch (adminErr) {
      console.error("Failed to send admin notification (non-blocking):", adminErr);
    }

    // Update confirmation_sent flag using service role
    await supabaseAdmin
      .from("email_leads")
      .update({ confirmation_sent: true })
      .eq("id", lead.id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending newsletter confirmation:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
