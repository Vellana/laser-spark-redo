import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claims } = await supabaseUser.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (!claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const { data: isAdmin } = await supabaseAdmin.rpc("has_role", { _user_id: claims.claims.sub, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

    const RESEND_KEY = Deno.env.get("RESEND_API_KEY")!;
    let after = "";
    let total = 0;
    let inserted = 0;

    for (let page = 0; page < 50; page++) {
      const url = `https://api.resend.com/emails?limit=100${after ? `&after=${after}` : ""}`;
      const r = await fetch(url, { headers: { Authorization: `Bearer ${RESEND_KEY}` } });
      if (!r.ok) {
        const t = await r.text();
        return new Response(JSON.stringify({ error: `Resend ${r.status}: ${t}` }), { status: 500, headers: corsHeaders });
      }
      const json: any = await r.json();
      const items: any[] = json?.data ?? [];
      if (items.length === 0) break;
      total += items.length;

      for (const it of items) {
        const { error } = await supabaseAdmin.from("resend_email_events").insert({
          resend_email_id: it.id,
          recipient: Array.isArray(it.to) ? it.to[0] : it.to,
          subject: it.subject,
          event_type: it.last_event ?? "unknown",
          event_data: it,
          created_at: it.created_at,
        });
        if (!error) inserted++;
      }

      if (!json?.has_more) break;
      after = items[items.length - 1]?.id ?? "";
      if (!after) break;
    }

    return new Response(JSON.stringify({ ok: true, fetched: total, inserted }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? "error" }), { status: 500, headers: corsHeaders });
  }
});
