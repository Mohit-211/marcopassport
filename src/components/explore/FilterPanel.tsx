"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { categories } from "@/data/content";
import { cn } from "@/lib/utils";

export const PRICE_OPTIONS = ["$", "$$", "$$$", "$$$$"] as const;
export const NEIGHBORHOODS = [
  "Crescent Beach",
  "Marco Marina",
  "Old Marco",
  "Tigertail",
  "Esplanade",
] as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[11px] uppercase tracking-[0.18em] font-bold text-muted-foreground mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function FilterPanel(props: {
  selectedCats: string[];
  onToggleCat: (c: string) => void;
  selectedPrices: string[];
  onTogglePrice: (p: string) => void;
  selectedHoods: string[];
  onToggleHood: (h: string) => void;
  minRating: number;
  onMinRating: (v: number) => void;
  featuredOnly: boolean;
  onFeaturedOnly: (v: boolean) => void;
  activeCount: number;
  onClear: () => void;
}) {
  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Filters</h2>
        {props.activeCount > 0 && (
          <button
            onClick={props.onClear}
            className="text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-primary transition"
          >
            Clear
          </button>
        )}
      </div>

      <Section title="Featured">
        <div className="flex items-center justify-between">
          <Label htmlFor="featured-only" className="text-sm cursor-pointer">
            Featured listings only
          </Label>
          <Switch
            id="featured-only"
            checked={props.featuredOnly}
            onCheckedChange={props.onFeaturedOnly}
          />
        </div>
      </Section>

      <Section title="Category">
        <div className="space-y-2.5">
          {categories.map((c) => (
            <label
              key={c.slug}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={props.selectedCats.includes(c.name)}
                onCheckedChange={() => props.onToggleCat(c.name)}
              />
              <span className="text-sm flex-1 group-hover:text-primary transition">
                {c.name}
              </span>
              <span className="text-xs text-muted-foreground">{c.count}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Price">
        <div className="flex flex-wrap gap-2">
          {PRICE_OPTIONS.map((p) => {
            const active = props.selectedPrices.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => props.onTogglePrice(p)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-semibold border transition",
                  active
                    ? "bg-gold text-gold-foreground border-gold"
                    : "bg-background text-foreground border-border hover:border-gold"
                )}
              >
                {p}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Neighborhood">
        <div className="space-y-2.5">
          {NEIGHBORHOODS.map((h) => (
            <label
              key={h}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={props.selectedHoods.includes(h)}
                onCheckedChange={() => props.onToggleHood(h)}
              />
              <span className="text-sm flex-1 group-hover:text-primary transition">
                {h}
              </span>
            </label>
          ))}
        </div>
      </Section>

      <Section
        title={`Minimum rating${props.minRating ? ` · ${props.minRating.toFixed(1)}+` : ""}`}
      >
        <Slider
          value={props.minRating}
          onValueChange={(v) =>
            props.onMinRating(Array.isArray(v) ? (v[0] ?? 0) : v)
          }
          min={0}
          max={5}
          step={0.5}
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Any</span>
          <span>5.0</span>
        </div>
      </Section>
    </div>
  );
}
