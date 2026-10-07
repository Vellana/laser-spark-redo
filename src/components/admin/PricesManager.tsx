import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";
import { applyDiscount, CATEGORY_LABELS, fmt, isDiscountLive, type PriceDiscount, type ServicePrice } from "@/lib/prices";

const EMPTY: Omit<PriceDiscount, "id"> = {
  label: "Sale", discount_type: "percent", value: 10, applies_to: "both", scope: "all",
  category: "laser_hair", service_keys: [], promo_code: "", note: "", start_date: null, end_date: null, is_active: true,
};

const sel = "h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground";

const PricesManager = () => {
  const qc = useQueryClient();
  const [prices, setPrices] = useState<ServicePrice[]>([]);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [discounts, setDiscounts] = useState<PriceDiscount[]>([]);
  const [form, setForm] = useState<Omit<PriceDiscount, "id"> & { id?: string }>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [p, d] = await Promise.all([
      supabase.from("service_prices").select("*").order("display_order"),
      supabase.from("price_discounts").select("*").order("created_at", { ascending: false }),
    ]);
    if (p.error || d.error) toast.error("Could not load prices");
    setPrices((p.data as ServicePrice[]) ?? []);
    setDiscounts((d.data as PriceDiscount[]) ?? []);
    setDirty(new Set());
  };
  useEffect(() => { load(); }, []);
  const refreshSite = () => qc.invalidateQueries({ queryKey: ["public-prices"] });

  const editPrice = (key: string, field: "single_price" | "package_price", v: string) => {
    setPrices((ps) => ps.map((p) => (p.key === key ? { ...p, [field]: v === "" ? null : Number(v) } : p)));
    setDirty((s) => new Set(s).add(key));
  };

  const savePrices = async () => {
    setSaving(true);
    const rows = prices.filter((p) => dirty.has(p.key));
    for (const r of rows) {
      const { error } = await supabase.from("service_prices")
        .update({ single_price: r.single_price, package_price: r.package_price }).eq("key", r.key);
      if (error) { toast.error(`${r.name}: ${error.message}`); setSaving(false); return; }
    }
    setSaving(false);
    toast.success(`Saved ${rows.length} price${rows.length === 1 ? "" : "s"}`);
    setDirty(new Set());
    refreshSite();
  };

  const saveDiscount = async () => {
    if (!form.label.trim() || !(form.value > 0)) { toast.error("Add a name and an amount above 0"); return; }
    if (form.scope === "services" && !form.service_keys.length) { toast.error("Pick at least one service"); return; }
    const row = {
      ...form,
      promo_code: form.promo_code?.trim().toUpperCase() || null,
      note: form.note?.trim() || null,
      category: form.scope === "category" ? form.category : null,
      service_keys: form.scope === "services" ? form.service_keys : [],
    };
    const { id, ...data } = row;
    const res = id
      ? await supabase.from("price_discounts").update(data).eq("id", id)
      : await supabase.from("price_discounts").insert(data);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(id ? "Discount updated" : "Discount added");
    setForm(EMPTY);
    load(); refreshSite();
  };

  const toggle = async (d: PriceDiscount) => {
    await supabase.from("price_discounts").update({ is_active: !d.is_active }).eq("id", d.id);
    load(); refreshSite();
  };
  const remove = async (d: PriceDiscount) => {
    if (!confirm(`Delete "${d.label}"?`)) return;
    await supabase.from("price_discounts").delete().eq("id", d.id);
    load(); refreshSite();
  };

  const describe = (d: Omit<PriceDiscount, "id">) => {
    const amt = d.discount_type === "percent" ? `${d.value}% off` : `${fmt(d.value)} off`;
    const what = d.applies_to === "both" ? "single & package" : d.applies_to === "single" ? "single sessions" : "packages";
    const who = d.scope === "all" ? "all services"
      : d.scope === "category" ? CATEGORY_LABELS[d.category ?? ""] ?? d.category
      : d.service_keys.map((k) => prices.find((p) => p.key === k)?.name ?? k).join(", ");
    return `${amt} ${what} · ${who}`;
  };

  const previewSample = prices.find((p) => form.scope === "services" ? form.service_keys.includes(p.key)
    : form.scope === "category" ? p.category === form.category : true);
  const preview = previewSample ? applyDiscount(previewSample, form.applies_to === "package" ? "package" : "single",
    [{ ...form, id: "x", is_active: true, start_date: null, end_date: null } as PriceDiscount]) : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-lg">Service Prices</CardTitle>
          <Button size="sm" onClick={savePrices} disabled={!dirty.size || saving}>
            <Save className="w-4 h-4 mr-1" /> Save {dirty.size ? `(${dirty.size})` : ""}
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Changes show on the Pricing page, Laser Hair Removal page, homepage service cards and CoolPeel sections. Remember to update the same prices in Vagaro.
          </p>
          {Object.keys(CATEGORY_LABELS).map((cat) => (
            <div key={cat} className="mb-6">
              <h3 className="font-semibold text-foreground mb-2">{CATEGORY_LABELS[cat]}</h3>
              <div className="grid grid-cols-[1fr_110px_110px] gap-2 text-xs font-medium text-muted-foreground px-1 mb-1">
                <span>Service</span><span>Single ($)</span><span>{cat === "coolpeel" ? "Package of 3 ($)" : cat === "deka" ? "Package ($)" : "Package of 5 ($)"}</span>
              </div>
              {prices.filter((p) => p.category === cat).map((p) => (
                <div key={p.key} className={`grid grid-cols-[1fr_110px_110px] gap-2 items-center py-1 px-1 rounded ${dirty.has(p.key) ? "bg-accent/10" : ""}`}>
                  <span className="text-sm text-foreground">{p.name}</span>
                  <Input type="number" min="0" step="0.01" value={p.single_price ?? ""} onChange={(e) => editPrice(p.key, "single_price", e.target.value)} />
                  <Input type="number" min="0" step="0.01" value={p.package_price ?? ""} onChange={(e) => editPrice(p.key, "package_price", e.target.value)} />
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">{form.id ? "Edit Discount" : "New Discount"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Name shown to customers</Label><Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Fall Sale" /></div>
            <div><Label>Promo code (optional)</Label><Input value={form.promo_code ?? ""} onChange={(e) => setForm({ ...form, promo_code: e.target.value })} placeholder="FALL20" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Type</Label>
                <select className={sel} value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value as "percent" | "amount" })}>
                  <option value="percent">Percent off</option><option value="amount">Dollars off</option>
                </select></div>
              <div><Label>{form.discount_type === "percent" ? "Percent" : "Dollars"}</Label>
                <Input type="number" min="0" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Applies to</Label>
              <select className={sel} value={form.applies_to} onChange={(e) => setForm({ ...form, applies_to: e.target.value as PriceDiscount["applies_to"] })}>
                <option value="both">Single sessions and packages</option><option value="single">Single sessions only</option><option value="package">Packages only</option>
              </select></div>
            <div><Label>Which services</Label>
              <select className={sel} value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value as PriceDiscount["scope"] })}>
                <option value="all">All services</option><option value="category">One type of service</option><option value="services">Specific services</option>
              </select></div>
            {form.scope === "category" && (
              <div><Label>Type of service</Label>
                <select className={sel} value={form.category ?? "laser_hair"} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select></div>
            )}
            <div><Label>Starts (optional)</Label><Input type="date" value={form.start_date ?? ""} onChange={(e) => setForm({ ...form, start_date: e.target.value || null })} /></div>
            <div><Label>Ends (optional)</Label><Input type="date" value={form.end_date ?? ""} onChange={(e) => setForm({ ...form, end_date: e.target.value || null })} /></div>
          </div>
          {form.scope === "services" && (
            <div className="flex flex-wrap gap-2">
              {prices.map((p) => {
                const on = form.service_keys.includes(p.key);
                return (
                  <Button key={p.key} type="button" size="sm" variant={on ? "default" : "outline"}
                    onClick={() => setForm({ ...form, service_keys: on ? form.service_keys.filter((k) => k !== p.key) : [...form.service_keys, p.key] })}>
                    {p.name}
                  </Button>
                );
              })}
            </div>
          )}
          <div><Label>Fine print (optional)</Label><Input value={form.note ?? ""} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Cannot be combined with other offers" /></div>
          <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><span className="text-sm">On</span></div>
          {preview && preview.discount && (
            <p className="text-sm text-muted-foreground">Preview: {previewSample!.name} <span className="line-through">{fmt(preview.original)}</span> <strong className="text-foreground">{fmt(preview.final)}</strong></p>
          )}
          <p className="text-xs text-muted-foreground">Codes are shown to customers only. Create the same code in Vagaro so it works at checkout.</p>
          <div className="flex gap-2">
            <Button onClick={saveDiscount}>{form.id ? "Update" : <><Plus className="w-4 h-4 mr-1" /> Add discount</>}</Button>
            {form.id && <Button variant="outline" onClick={() => setForm(EMPTY)}>Cancel</Button>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Discounts</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {!discounts.length && <p className="text-sm text-muted-foreground">No discounts yet.</p>}
          {discounts.map((d) => (
            <div key={d.id} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">
                  {d.label}{d.promo_code && <span className="ml-2 font-mono text-xs bg-secondary px-2 py-0.5 rounded">{d.promo_code}</span>}
                  <span className={`ml-2 text-xs ${isDiscountLive(d) ? "text-accent" : "text-muted-foreground"}`}>{isDiscountLive(d) ? "Live" : d.is_active ? "Scheduled / ended" : "Off"}</span>
                </p>
                <p className="text-xs text-muted-foreground">{describe(d)}{d.start_date || d.end_date ? ` · ${d.start_date ?? "now"} to ${d.end_date ?? "no end"}` : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={d.is_active} onCheckedChange={() => toggle(d)} />
                <Button size="sm" variant="outline" onClick={() => setForm({ ...d, promo_code: d.promo_code ?? "", note: d.note ?? "", category: d.category ?? "laser_hair" })}>Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => remove(d)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PricesManager;
