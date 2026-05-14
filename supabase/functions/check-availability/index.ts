import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CALENDAR_ID = "admin@virginialaserspecialists.com";

// Business hours in ET
const BUSINESS_HOURS: Record<number, { start: string; end: string } | null> = {
  0: null,
  1: null,
  2: { start: "10:00", end: "17:30" },
  3: { start: "10:00", end: "17:30" },
  4: { start: "10:00", end: "17:30" },
  5: { start: "10:00", end: "17:30" },
  6: { start: "09:00", end: "12:30" },
};

async function getAccessToken(serviceAccountKey: any): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccountKey.client_email,
    scope: "https://www.googleapis.com/auth/calendar.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const claimB64 = btoa(JSON.stringify(claim)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const signInput = `${headerB64}.${claimB64}`;

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
  if (!tokenData.access_token) throw new Error("Failed to get access token");
  return tokenData.access_token;
}

async function getGCalBusySlots(date: string): Promise<string[]> {
  const serviceAccountKeyRaw = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
  if (!serviceAccountKeyRaw) {
    console.warn("GOOGLE_SERVICE_ACCOUNT_KEY not configured — skipping Google Calendar check");
    return [];
  }

  try {
    const serviceAccountKey = JSON.parse(serviceAccountKeyRaw);
    const accessToken = await getAccessToken(serviceAccountKey);

    // Get the day of week to know business hours
    const d = new Date(date + "T12:00:00");
    const dow = d.getDay();
    const hours = BUSINESS_HOURS[dow];
    if (!hours) return [];

    // DST-aware America/New_York offset for the given local date+time.
    // Returns "-04:00" during EDT, "-05:00" during EST. Uses Intl to ask the
    // IANA tz database what offset applies at that wall-clock instant, so
    // spring-forward / fall-back transitions are handled correctly.
    const etOffset = (localDate: string, localTime: string): string => {
      // Interpret the local wall time as if it were UTC, then ask what offset
      // America/New_York has at that instant. The offset string from
      // formatToParts has the form "GMT-4" / "GMT-5" / "GMT-04:30" etc.
      const asUtc = new Date(`${localDate}T${localTime}:00Z`);
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        timeZoneName: "longOffset",
      }).formatToParts(asUtc);
      const tzName = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT-05:00";
      const m = tzName.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
      if (!m) return "-05:00";
      const sign = m[1];
      const hh = m[2].padStart(2, "0");
      const mm = (m[3] ?? "00").padStart(2, "0");
      return `${sign}${hh}:${mm}`;
    };

    const offsetStart = etOffset(date, hours.start);
    const offsetEnd = etOffset(date, hours.end);
    const timeMin = `${date}T${hours.start}:00${offsetStart}`;
    const timeMax = `${date}T${hours.end}:00${offsetEnd}`;

    const freeBusyRes = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeMin,
        timeMax,
        timeZone: "America/New_York",
        items: [{ id: CALENDAR_ID }],
      }),
    });

    const freeBusyData = await freeBusyRes.json();
    const busyPeriods = freeBusyData?.calendars?.[CALENDAR_ID]?.busy || [];

    // Convert busy periods to 30-min slot format (HH:MM)
    const busySlots: string[] = [];
    for (const period of busyPeriods) {
      const start = new Date(period.start);
      const end = new Date(period.end);
      // Generate all 30-min slots that overlap with this busy period
      const [startH, startM] = hours.start.split(":").map(Number);
      const [endH, endM] = hours.end.split(":").map(Number);
      const dayStart = startH * 60 + startM;
      const dayEnd = endH * 60 + endM;

      for (let m = dayStart; m < dayEnd; m += 30) {
        const slotStart = new Date(date + "T00:00:00");
        slotStart.setHours(Math.floor(m / 60), m % 60, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);

        // Check if this slot overlaps with the busy period
        if (slotStart < end && slotEnd > start) {
          const hh = Math.floor(m / 60).toString().padStart(2, "0");
          const mm = (m % 60).toString().padStart(2, "0");
          busySlots.push(`${hh}:${mm}`);
        }
      }
    }
    return [...new Set(busySlots)];
  } catch (err) {
    console.error("Google Calendar free/busy check failed:", err);
    return [];
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { date } = await req.json();
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return new Response(JSON.stringify({ error: "Invalid date" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Check office closure first — if the office is closed, block ALL slots that day
    const { data: closureRow, error: closureErr } = await supabaseAdmin
      .from("office_closures")
      .select("closure_date, reason")
      .eq("closure_date", date)
      .maybeSingle();
    if (closureErr) console.warn("office_closures lookup failed:", closureErr);

    if (closureRow) {
      // Generate every 30-min slot in business hours for that DOW and mark them all booked
      const d = new Date(date + "T12:00:00");
      const dow = d.getDay();
      const hours = BUSINESS_HOURS[dow];
      const allSlots: string[] = [];
      if (hours) {
        const [sh, sm] = hours.start.split(":").map(Number);
        const [eh, em] = hours.end.split(":").map(Number);
        for (let m = sh * 60 + sm; m < eh * 60 + em; m += 30) {
          allSlots.push(
            `${Math.floor(m / 60).toString().padStart(2, "0")}:${(m % 60).toString().padStart(2, "0")}`,
          );
        }
      }
      return new Response(
        JSON.stringify({
          bookedSlots: allSlots,
          closed: true,
          closureReason: closureRow.reason || "",
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    // Get booked slots from database
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .select("appointment_time")
      .eq("appointment_date", date)
      .eq("status", "confirmed");

    if (error) throw error;

    const dbBookedSlots = (data || []).map((r: any) => r.appointment_time.substring(0, 5));

    // Get busy slots from Google Calendar (catches Vagaro bookings)
    const gcalBusySlots = await getGCalBusySlots(date);

    // Merge and deduplicate
    const allBookedSlots = [...new Set([...dbBookedSlots, ...gcalBusySlots])];

    return new Response(JSON.stringify({ bookedSlots: allBookedSlots, closed: false }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    console.error("Check availability error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
