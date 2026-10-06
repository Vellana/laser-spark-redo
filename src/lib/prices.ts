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
};

// Fallback used before the database answers (and for crawlers), matches the seeded prices.
const D = (key: string, name: string, s: number, p: number, o: number, category = "laser_hair"): ServicePrice => ({
  key, name, single_price: s, package_price: p, display_order: o, category,
});
export const DEFAULT_PRICES: ServicePrice[] = [
  D("abdomen", "Abdomen", 250, 937.5, 1),
  D("arms_half", "Arms (Half)", 300, 1125, 2),
  D("arms_full", "Arms (Full)", 400, 1500, 3),
  D("back_half", "Back (Half)", 250, 937.5, 4),
  D("back_full", "Back (Full)", 400, 1500, 5),
  D("bikini", "Bikini Line", 250, 937.5, 6),
  D("brazilian", "Brazilian/Brozilian", 300, 1125, 7),
  D("breasts", "Breasts", 100, 375, 8),
  D("chest", "Chest", 250, 937.5, 9),
  D("chin", "Chin", 100, 375, 10),
  D("face", "Face (Full)", 250, 937.5, 11),
  D("feet", "Feet", 100, 375, 12),
  D("hands", "Hands", 100, 375, 13),
  D("legs_half", "Legs (Half)", 350, 1312.5, 14),
  D("legs_full", "Legs (Full)", 500, 1875, 15),
  D("neck", "Neck (Front or Back)", 100, 375, 16),
  D("shoulders", "Shoulders", 100, 375, 17),
  D("sideburns", "Sideburns", 100, 375, 18),
  D("underarms", "Underarms", 150, 562.5, 19),
  D("upper_lip", "Upper Lip", 100, 375, 20),
  D("full_body", "Full Body", 1850, 6937.5, 21),
  D("coolpeel", "CoolPeel", 750, 2000, 30, "coolpeel"),
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
