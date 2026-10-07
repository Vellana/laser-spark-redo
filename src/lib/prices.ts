import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ServicePrice {
  key: string;
  category: string;
  name: string;
  single_price: number | null;
  package_price: number | null;
  display_order: number;
}

export interface PriceDiscount {
  id: string;
  label: string;
  discount_type: "percent" | "amount";
  value: number;
  applies_to: "single" | "package" | "both";
  scope: "all" | "category" | "services";
  category: string | null;
  service_keys: string[];
  promo_code: string | null;
  note: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

export const CATEGORY_LABELS: Record<string, string> = {
  laser_hair: "Laser Hair Removal",
  coolpeel: "CoolPeel",
  // DEKA Pulse single sessions by area (Holly, 7 Oct 2026), which were "Contact for Quote".
  deka: "DEKA Pulse",
};

// Fallback used before the database answers (and for crawlers), matches the seeded prices.
const D = (key: string, name: string, s: number | null, p: number | null, o: number, category = "laser_hair"): ServicePrice => ({
  key, name, single_price: s, package_price: p, display_order: o, category,
});
export const DEFAULT_PRICES: ServicePrice[] = [
  // Holly's list of 7 Oct 2026: six new areas (package of 5 = single x 5 x 0.75, the rule every other row follows),
  // CoolPeel by area as a series of 3 only, and DEKA Pulse single sessions by area. Same rows as the database.
  D("abdomen", "Abdomen", 250, 937.5, 1),
  D("arms_half", "Arms (Half)", 300, 1125, 2),
  D("arms_full", "Arms (Full)", 400, 1500, 3),
  D("back_half", "Back (Half)", 250, 937.5, 4),
  D("back_full", "Back (Full)", 400, 1500, 5),
  D("beard", "Beard", 250, 937.5, 6),
  D("belly_line", "Belly Line", 100, 375, 7),
  D("bikini", "Bikini Line", 250, 937.5, 8),
  D("brazilian", "Brazilian/Brozilian", 300, 1125, 9),
  D("breasts", "Breasts", 100, 375, 10),
  D("buttocks", "Buttocks", 250, 937.5, 11),
  D("chest", "Chest", 250, 937.5, 12),
  D("chin", "Chin", 100, 375, 13),
  D("ears", "Ears", 100, 375, 14),
  D("face", "Face (Full)", 250, 937.5, 15),
  D("feet", "Feet", 100, 375, 16),
  D("hairline", "Hair Line", 100, 375, 17),
  D("hands", "Hands", 100, 375, 18),
  D("inner_thigh", "Inner Thigh", 150, 562.5, 19),
  D("legs_half", "Legs (Half)", 350, 1312.5, 20),
  D("legs_full", "Legs (Full)", 500, 1875, 21),
  D("neck", "Neck (Front or Back)", 100, 375, 22),
  D("shoulders", "Shoulders", 100, 375, 23),
  D("sideburns", "Sideburns", 100, 375, 24),
  D("underarms", "Underarms", 150, 562.5, 25),
  D("upper_lip", "Upper Lip", 100, 375, 26),
  D("full_body", "Full Body", 1850, 6937.5, 27),
  D("coolpeel", "Face Only", null, 1800, 30, "coolpeel"),
  D("coolpeel_face_neck", "Face & Neck", null, 2200, 31, "coolpeel"),
  D("coolpeel_face_neck_decolletage", "Face, Neck & Décolletage", null, 2600, 32, "coolpeel"),
  D("coolpeel_hands", "Hands", null, 600, 33, "coolpeel"),
  D("deka_face", "Face Only", 1800, null, 40, "deka"),
  D("deka_face_neck", "Face & Neck", 2200, null, 41, "deka"),
  D("deka_face_neck_decolletage", "Face, Neck & Décolletage", 2600, null, 42, "deka"),
];

/** Maps a page's service name (any wording) to its price keys. */
export function keysForName(name: string): string[] {
  const first = name.toLowerCase().split(/[\s/(]/)[0];
  const map: Record<string, string[]> = {
    brazilian: ["brazilian"], underarms: ["underarms"], legs: ["legs_half", "legs_full"],
    back: ["back_half", "back_full"], chin: ["chin"], face: ["face"], arms: ["arms_half", "arms_full"],
    chest: ["chest"], abdomen: ["abdomen"], bikini: ["bikini"], neck: ["neck"], sideburns: ["sideburns"],
    upper: ["upper_lip"], shoulders: ["shoulders"], hands: ["hands"], feet: ["feet"], breasts: ["breasts"],
    full: ["full_body"], coolpeel: ["coolpeel"],
  };
  return map[first] ?? [];
}

export const fmt = (n: number | null | undefined) => {
  if (n == null) return "";
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
};

function todayET() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
}

export function isDiscountLive(d: PriceDiscount, today = todayET()) {
  if (!d.is_active) return false;
  if (d.start_date && today < d.start_date) return false;
  if (d.end_date && today > d.end_date) return false;
  return true;
}

export interface PriceResult {
  original: number | null;
  final: number | null;
  discount: PriceDiscount | null;
}

/** Applies the best live discount for one price. */
export function applyDiscount(
  price: ServicePrice | undefined,
  kind: "single" | "package",
  discounts: PriceDiscount[],
): PriceResult {
  const original = price ? (kind === "single" ? price.single_price : price.package_price) : null;
  if (!price || original == null) return { original, final: original, discount: null };
  let best: PriceResult = { original, final: original, discount: null };
  for (const d of discounts) {
    if (!isDiscountLive(d)) continue;
    if (d.applies_to !== "both" && d.applies_to !== kind) continue;
    if (d.scope === "category" && d.category !== price.category) continue;
    if (d.scope === "services" && !d.service_keys.includes(price.key)) continue;
    const off = d.discount_type === "percent" ? (original * d.value) / 100 : d.value;
    const final = Math.max(0, Math.round((original - off) * 100) / 100);
    if (best.final == null || final < best.final) best = { original, final, discount: d };
  }
  return best;
}

export function usePrices() {
  const q = useQuery({
    queryKey: ["public-prices"],
    staleTime: 60_000,
    queryFn: async () => {
      const [p, d] = await Promise.all([
        supabase.from("service_prices").select("*").order("display_order"),
        supabase.from("price_discounts").select("*").eq("is_active", true),
      ]);
      return {
        prices: (p.data as ServicePrice[] | null)?.length ? (p.data as ServicePrice[]) : DEFAULT_PRICES,
        discounts: ((d.data as PriceDiscount[] | null) ?? []),
      };
    },
  });
  const prices = q.data?.prices ?? DEFAULT_PRICES;
  const discounts = q.data?.discounts ?? [];
  const byKey = (k: string) => prices.find((p) => p.key === k);
  const get = (k: string, kind: "single" | "package") => applyDiscount(byKey(k), kind, discounts);
  const liveDiscounts = discounts.filter((d) => isDiscountLive(d));
  return { prices, discounts: liveDiscounts, byKey, get };
}

/** Plain text like "$240 (was $300, Fall Sale, code FALL20)". */
export function priceLabel(r: PriceResult) {
  if (r.final == null) return "";
  if (!r.discount || r.final === r.original) return fmt(r.final);
  const code = r.discount.promo_code ? `, code ${r.discount.promo_code}` : "";
  return `${fmt(r.final)} (was ${fmt(r.original)}, ${r.discount.label}${code})`;
}
