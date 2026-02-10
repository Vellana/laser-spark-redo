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
      return new Response(JSON.stringify({ error: "Invalid email" }), {
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

    const emailResponse = await resend.emails.send({
      from: "Virginia Laser Specialists <noreply@virginialaserspecialists.com>",
      to: [email],
      subject: "Welcome! Here's Your 5% Discount 🎉",
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8f7f4;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:40px 30px;text-align:center;">
      <h1 style="color:#c9a96e;margin:0;font-size:28px;letter-spacing:2px;">VIRGINIA LASER SPECIALISTS</h1>
      <p style="color:#e8e0d4;margin:8px 0 0;font-size:14px;letter-spacing:1px;">Expert Laser Treatments</p>
    </div>
    
    <!-- Body -->
    <div style="padding:40px 30px;">
      <h2 style="color:#1a1a2e;font-size:24px;margin:0 0 20px;">Welcome to Our Community!</h2>
      <p style="color:#444;font-size:16px;line-height:1.6;">
        Thank you for signing up for our newsletter! As promised, here is your exclusive <strong style="color:#c9a96e;">5% discount</strong> on your first service.
      </p>
      
      <!-- Discount Box -->
      <div style="background:linear-gradient(135deg,#faf8f5,#f0ece4);border:2px solid #c9a96e;border-radius:12px;padding:30px;text-align:center;margin:30px 0;">
        <p style="color:#1a1a2e;font-size:14px;text-transform:uppercase;letter-spacing:2px;margin:0;">Your Exclusive Offer</p>
        <p style="color:#c9a96e;font-size:48px;font-weight:bold;margin:10px 0;">5% OFF</p>
        <p style="color:#666;font-size:14px;margin:0;">Your First Service</p>
      </div>
      
      <h3 style="color:#1a1a2e;font-size:18px;margin:30px 0 15px;">How to Redeem:</h3>
      <ol style="color:#444;font-size:15px;line-height:1.8;padding-left:20px;">
        <li><strong>Book a free consultation</strong> through our online booking system</li>
        <li><strong>Mention this email</strong> in the notes section when booking, or show it in person at the clinic</li>
        <li>Enjoy your 5% discount on your first treatment!</li>
      </ol>
      
      <!-- CTA Button -->
      <div style="text-align:center;margin:35px 0;">
        <a href="${VAGARO_LINK}" style="display:inline-block;background:#c9a96e;color:#1a1a2e;padding:16px 40px;text-decoration:none;border-radius:8px;font-size:16px;font-weight:bold;letter-spacing:1px;">
          BOOK YOUR FREE CONSULTATION
        </a>
      </div>
      
      <p style="color:#444;font-size:15px;line-height:1.6;">
        Your discount email: <strong>${email}</strong><br>
        <em>Please mention this email or show it at your appointment to receive your discount.</em>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background:#1a1a2e;padding:30px;text-align:center;">
      <p style="color:#c9a96e;margin:0 0 8px;font-size:14px;font-weight:bold;">Virginia Laser Specialists</p>
      <p style="color:#999;margin:0;font-size:12px;">8100 Boone Blvd, Suite 270 · Vienna, VA 22182</p>
      <p style="color:#999;margin:4px 0 0;font-size:12px;">703-547-4499 · Tue-Fri: 10am-6pm | Sat: 9am-1pm</p>
    </div>
  </div>
</body>
</html>
      `,
    });

    console.log("Newsletter confirmation sent:", emailResponse);

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
