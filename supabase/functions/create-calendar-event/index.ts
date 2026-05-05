import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CALENDAR_ID = "admin@virginialaserspecialists.com";

async function getAccessToken(serviceAccountKey: any): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccountKey.client_email,
    scope: "https://www.googleapis.com/auth/calendar",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const claimB64 = btoa(JSON.stringify(claim)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const signInput = `${headerB64}.${claimB64}`;

  // Import the private key
  const pemContent = serviceAccountKey.private_key
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\n/g, "");
  const binaryKey = Uint8Array.from(atob(pemContent), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, encoder.encode(signInput));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${signInput}.${sigB64}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) throw new Error("Failed to get access token: " + JSON.stringify(tokenData));
  return tokenData.access_token;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appointmentId, firstName, lastName, email, phone, treatmentInterest, date, time, notes } = await req.json();

    if (!appointmentId || !firstName || !date || !time || !treatmentInterest) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Verify the appointment was just created (within last 5 minutes) — prevents abuse
    const sbAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: aptMatch } = await sbAdmin
      .from("appointments")
      .select("id")
      .eq("id", appointmentId)
      .gte("created_at", fiveMinAgo)
      .maybeSingle();
    if (!aptMatch) {
      return new Response(JSON.stringify({ error: "No matching recent appointment" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const serviceAccountKeyRaw = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    if (!serviceAccountKeyRaw) {
      console.warn("GOOGLE_SERVICE_ACCOUNT_KEY not configured — skipping calendar event creation");
      return new Response(JSON.stringify({ success: true, skipped: true, reason: "No Google credentials configured" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let serviceAccountKey: any;
    try {
      serviceAccountKey = JSON.parse(serviceAccountKeyRaw);
    } catch {
      console.error("Invalid GOOGLE_SERVICE_ACCOUNT_KEY JSON");
      return new Response(JSON.stringify({ error: "Invalid service account key" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const accessToken = await getAccessToken(serviceAccountKey);
    const fullName = `${firstName} ${lastName || ""}`.trim();

    // Build event times
    const [h, m] = time.split(":").map(Number);
    const endM = m + 30;
    const endH = endM >= 60 ? h + 1 : h;
    const endMin = endM % 60;
    const startDateTime = `${date}T${time}:00`;
    const endDateTime = `${date}T${endH.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}:00`;

    const event = {
      summary: `VLS Booking: ${fullName} - ${treatmentInterest}`,
      description: `Client: ${fullName}\nEmail: ${email || "N/A"}\nPhone: ${phone || "N/A"}\nTreatment: ${treatmentInterest}\nNotes: ${notes || "None"}\n\nBooked via website scheduler.`,
      location: "8100 Boone Blvd, Suite 270, Vienna, VA 22182",
      start: { dateTime: startDateTime, timeZone: "America/New_York" },
      end: { dateTime: endDateTime, timeZone: "America/New_York" },
      reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 30 }] },
    };

    const calRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      },
    );

    const calData = await calRes.json();
    if (!calRes.ok) {
      console.error("Google Calendar API error:", calData);
      return new Response(JSON.stringify({ error: "Calendar API error", details: calData }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Store the event ID on the appointment record
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    await supabaseAdmin
      .from("appointments")
      .update({ gcal_event_id: calData.id })
      .eq("id", appointmentId);

    return new Response(JSON.stringify({ success: true, eventId: calData.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Create calendar event error:", error);
    return new Response(JSON.stringify({ error: "Failed to create calendar event" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
