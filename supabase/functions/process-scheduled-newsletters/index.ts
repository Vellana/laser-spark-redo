import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const cronSecret = Deno.env.get("CRON_SECRET");
  const provided = req.headers.get("x-cron-secret") ?? new URL(req.url).searchParams.get("secret");
  if (!cronSecret || provided !== cronSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const nowIso = new Date().toISOString();
  const { data: due, error: dueErr } = await supabase
    .from("scheduled_newsletters")
    .select("*")
    .eq("status", "pending")
    .lte("scheduled_for", nowIso)
    .order("scheduled_for", { ascending: true })
    .limit(5);

  if (dueErr) {
    return new Response(JSON.stringify({ error: dueErr.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const results: Array<{ id: string; status: string; error?: string }> = [];

  for (const row of due ?? []) {
    // Claim the row to avoid double-send if cron overlaps
    const { data: claimed, error: claimErr } = await supabase
      .from("scheduled_newsletters")
      .update({ status: "sending", attempts: (row.attempts ?? 0) + 1, updated_at: new Date().toISOString() })
      .eq("id", row.id)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();

    if (claimErr || !claimed) {
      results.push({ id: row.id, status: "skipped" });
      continue;
    }

    try {
      const sendUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-newsletter`;
      const recipientEmails = Array.isArray(row.recipient_emails) ? row.recipient_emails : null;
      const payload: Record<string, unknown> = {
        subject: row.subject,
        body: row.body,
        imageUrls: Array.isArray(row.image_urls) ? row.image_urls : [],
      };
      if (recipientEmails && recipientEmails.length > 0) payload.recipientEmails = recipientEmails;

      const resp = await fetch(sendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cron-secret": cronSecret,
          // Edge functions in this project deploy with verify_jwt = false, but
          // include service-role auth as a safety net for hardened deployments.
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          "apikey": Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        },
        body: JSON.stringify(payload),
      });

      const text = await resp.text();
      let data: any = null;
      try { data = JSON.parse(text); } catch { /* ignore */ }

      if (!resp.ok) {
        const errMsg = data?.error || text || `HTTP ${resp.status}`;
        await supabase
          .from("scheduled_newsletters")
          .update({
            status: row.attempts >= 2 ? "failed" : "pending",
            last_error: String(errMsg).slice(0, 1000),
            updated_at: new Date().toISOString(),
          })
          .eq("id", row.id);
        results.push({ id: row.id, status: "error", error: String(errMsg) });
        continue;
      }

      await supabase
        .from("scheduled_newsletters")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          sent_count: data?.sent ?? null,
          failed_count: data?.failed ?? null,
          total_count: data?.total ?? null,
          last_error: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);

      results.push({ id: row.id, status: "sent" });
    } catch (err: any) {
      await supabase
        .from("scheduled_newsletters")
        .update({
          status: row.attempts >= 2 ? "failed" : "pending",
          last_error: String(err?.message ?? err).slice(0, 1000),
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);
      results.push({ id: row.id, status: "error", error: String(err?.message ?? err) });
    }
  }

  return new Response(JSON.stringify({ processed: results.length, results }), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
});
