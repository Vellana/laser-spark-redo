import { fmt, type PriceResult } from "@/lib/prices";

/** Shows a price, with the old price struck through and the code when a discount applies. */
const PriceDisplay = ({ result, className = "", showCode = true }: { result: PriceResult; className?: string; showCode?: boolean }) => {
  if (result.final == null) return null;
  const discounted = result.discount && result.final !== result.original;
  if (!discounted) return <span className={className}>{fmt(result.final)}</span>;
  return (
    <span className="inline-flex flex-col items-center sm:items-inherit leading-tight">
      <span className="inline-flex items-baseline gap-2">
        <span className={className}>{fmt(result.final)}</span>
        <span className="text-sm text-muted-foreground line-through font-normal">{fmt(result.original)}</span>
      </span>
      <span className="text-[0.8rem] font-semibold uppercase tracking-wide text-destructive">
        {result.discount!.label}
        {showCode && result.discount!.promo_code ? ` · Code ${result.discount!.promo_code}` : ""}
      </span>
    </span>
  );
};

export default PriceDisplay;

/** Lists live discounts that have codes or notes, so customers know what to enter in Vagaro. */
export const DiscountNotice = ({ discounts }: { discounts: { id: string; label: string; promo_code: string | null; note: string | null; end_date: string | null }[] }) => {
  if (!discounts.length) return null;
  return (
    <div className="mt-6 p-4 bg-accent/10 rounded-lg text-center space-y-1">
      {discounts.map((d) => (
        <p key={d.id} className="text-sm text-foreground">
          <strong>{d.label}</strong>
          {d.promo_code ? <> - use code <span className="font-mono font-bold">{d.promo_code}</span> when booking</> : null}
          {d.end_date ? <> (ends {new Date(d.end_date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })})</> : null}
          {d.note ? <>. {d.note}</> : null}
        </p>
      ))}
    </div>
  );
};
