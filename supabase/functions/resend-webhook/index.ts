import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Webhook } from "https://esm.sh/svix@1.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, svix-id, svix-timestamp, svix-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const rawBody = await req.text();
    const secret = Deno.env.get("RESEND_WEBHOOK_SECRET");

    let payload: any;
    if (secret) {
      try {
        const wh = new Webhook(secret);
        payload = wh.verify(rawBody, {
          "svix-id": req.headers.get("svix-id") ?? "",
          "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
          "svix-signature": req.headers.get("svix-signature") ?? "",
        });
      } catch (e) {
        console.error("Signature verification failed:", e);
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    } else {
      payload = JSON.parse(rawBody);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const data = payload?.data ?? {};
    await supabase.from("resend_email_events").insert({
      resend_email_id: data.email_id ?? data.id ?? null,
      recipient: Array.isArray(data.to) ? data.to[0] : (data.to ?? null),
      subject: data.subject ?? null,
      event_type: payload?.type ?? "unknown",
      event_data: payload,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e: any) {
    console.error("resend-webhook error:", e);
    return new Response(JSON.stringify({ error: e?.message ?? "error" }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
