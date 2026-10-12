"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { InfoTip } from "@/components/ui/tooltip";
import { EXPLORE_TYPE_LABELS, type ExploreType } from "@/lib/explore";
import { cn } from "@/lib/utils";

export interface CategoryOption {
  /** `${type}:${slug}`, since a place and a business category can share a slug */
  key: string;
  name: string;
  type: ExploreType;
  count: number;
}

interface ExploreFiltersProps {
  categories: CategoryOption[];
  selectedCats: string[];
  onToggleCategory: (key: string) => void;
  prices: string[];
  selectedPrices: string[];
  onTogglePrice: (price: string) => void;
  /** Hidden until at least one listing has a rating */
  showRating: boolean;
  minRating: number;
  onMinRating: (value: number) => void;
  featuredOnly: boolean;
  onFeaturedOnly: (value: boolean) => void;
  activeCount: number;
  onClear: () => void;
}

function Section({ title, hint, children }: { title: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="border-b border-border py-5 first:pt-0 last:border-b-0 last:pb-0">
      <h3 className="mb-3.5 flex items-center gap-1.5 font-sans text-sm font-semibold tracking-normal text-primary">
        {title}
        {hint && <InfoTip label={`About ${title.toLowerCase()}`}>{hint}</InfoTip>}
      </h3>
      {children}
    </section>
  );
}

export function ExploreFilters({
  categories,
  selectedCats,
  onToggleCategory,
  prices,
  selectedPrices,
  onTogglePrice,
  showRating,
  minRating,
  onMinRating,
  featuredOnly,
  onFeaturedOnly,
  activeCount,
  onClear,
}: ExploreFiltersProps) {
  const groups = (["place", "business"] as const)
    .map((type) => ({ type, options: categories.filter((c) => c.type === type) }))
    .filter((g) => g.options.length > 0);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-primary">Filters</h2>
        {activeCount > 0 && (
          <button type="button" onClick={onClear} className="text-xs font-medium text-primary underline-offset-4 hover:underline">
            Clear all
          </button>
        )}
      </div>

      <Section title="Featured" hint="Places and businesses hand-picked by the Marco Passport team.">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="featured-only" className="cursor-pointer text-sm font-normal">
            Featured only
          </Label>
          <Switch id="featured-only" checked={featuredOnly} onCheckedChange={onFeaturedOnly} />
        </div>
      </Section>

      {groups.map(({ type, options }) => (
        <Section
          key={type}
          title={groups.length > 1 ? EXPLORE_TYPE_LABELS[type] : "Category"}
          hint={groups.length > 1 ? undefined : "Tick several to see listings in any of them."}
        >
          <div className="space-y-2.5">
            {options.map((category) => (
              <label key={category.key} className="group flex cursor-pointer items-center gap-3">
                <Checkbox
                  checked={selectedCats.includes(category.key)}
                  onCheckedChange={() => onToggleCategory(category.key)}
                />
                <span className="flex-1 text-sm transition-colors group-hover:text-primary">{category.name}</span>
                <span className="text-xs text-muted-foreground">{category.count}</span>
              </label>
            ))}
          </div>
        </Section>
      ))}

      {prices.length > 0 && (
        <Section title="Price" hint="Typical cost, from $ (budget) to $$$$ (splurge). Applies to businesses only.">
          <div className="flex flex-wrap gap-2">
            {prices.map((price) => {
              const active = selectedPrices.includes(price);
              return (
                <button
                  key={price}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onTogglePrice(price)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary hover:text-primary",
                  )}
                >
                  {price}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {showRating && (
        <Section
          title={minRating ? `Minimum rating · ${minRating.toFixed(1)}+` : "Minimum rating"}
          hint="Average rating from visitor reviews. Listings without reviews yet are hidden while this is set."
        >
          <Slider
            value={minRating}
            onValueChange={(value) => onMinRating(Array.isArray(value) ? (value[0] ?? 0) : value)}
            min={0}
            max={5}
            step={0.5}
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Any</span>
            <span>5.0</span>
          </div>
        </Section>
      )}
    </div>
  );
}
