"use client";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { GetBusinessCategoryApi } from "@/api/users/business.api";
export const PRICE_OPTIONS = ["100", "1000", "10000", "10000"] as const;
export const NEIGHBORHOODS = [
  "Marco Marina",
  "Old Marco",
  "Tigertail",
  "Esplanade",
] as const;
type ApiCategory = {
  id?: string | number;
  name?: string;
  title?: string;
  category_name?: string;
  slug?: string;
  count?: number;
  business_count?: number;
  total?: number;
};
type Category = {
  slug: string;
  name: string;
  count: number;
};
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-border py-5 first:pt-0 last:border-b-0">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}
type FilterPanelProps = {
  selectedCats: string[];
  toggleCategoryAction: (category: string) => void;
  selectedPrices: string[];
  togglePriceAction: (price: string) => void;
  selectedHoods: string[];
  toggleNeighborhoodAction: (hood: string) => void;
  minRating: number;
  setMinRatingAction: (rating: number) => void;
  featuredOnly: boolean;
  setFeaturedOnlyAction: (value: boolean) => void;
  activeCount: number;
  clearFiltersAction: () => void;
};
export function FilterPanel({
  selectedCats,
  toggleCategoryAction,
  selectedPrices,
  togglePriceAction,
  selectedHoods,
  toggleNeighborhoodAction,
  minRating,
  setMinRatingAction,
  featuredOnly,
  setFeaturedOnlyAction,
  activeCount,
  clearFiltersAction,
}: FilterPanelProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState("");
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError("");
        const res = await GetBusinessCategoryApi();
        const responseData = res?.data?.data ?? res?.data ?? [];
        if (!Array.isArray(responseData)) {
          console.error(
            "Business category API did not return an array:",
            responseData
          );
          setCategories([]);
          setCategoryError("Unable to load categories.");
          return;
        }
        const mapped = responseData
          .map((category: ApiCategory): Category | null => {
            const name =
              category.name || category.title || category.category_name || "";
            if (!name) return null;
            return {
              slug: category.slug || name.toLowerCase().replace(/\s+/g, "-"),
              name,
              count:
                category.count ?? category.business_count ?? category.total ?? 0,
            };
          })
          .filter((c): c is Category => c !== null);
        setCategories(mapped);
      } catch (error) {
        console.error("Failed to fetch business categories:", error);
        setCategories([]);
        setCategoryError("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Filters</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearFiltersAction}
            className="text-xs font-medium text-primary transition-colors hover:text-primary/70"
          >
            Clear
          </button>
        )}
      </div>
      {/* Featured */}
      <Section title="Featured">
        <div className="flex items-center justify-between">
          <Label htmlFor="featured-only" className="cursor-pointer text-sm">
            Featured listings only
          </Label>
          <Switch
            id="featured-only"
            checked={featuredOnly}
            onCheckedChange={setFeaturedOnlyAction}
          />
        </div>
      </Section>
      {/* Category */}
      <Section title="Category">
        <div className="space-y-2.5">
          {loadingCategories && (
            <p className="text-xs text-muted-foreground">
              Loading categories...
            </p>
          )}
          {!loadingCategories && categoryError && (
            <p className="text-xs text-red-500">{categoryError}</p>
          )}
          {!loadingCategories &&
            !categoryError &&
            categories.map((category) => (
              <label
                key={category.slug}
                className="group flex cursor-pointer items-center gap-3"
              >
                <Checkbox
                  checked={selectedCats.includes(category.slug)}
                  onCheckedChange={() => toggleCategoryAction(category.slug)}
                />
                <span className="flex-1 text-sm transition-colors group-hover:text-primary">
                  {category.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {category.count}
                </span>
              </label>
            ))}
        </div>
      </Section>
      {/* Price */}
      <Section title="Price">
        <div className="flex flex-wrap gap-2">
          {PRICE_OPTIONS.map((price) => {
            const active = selectedPrices.includes(price);
            return (
              <button
                key={price}
                type="button"
                onClick={() => togglePriceAction(price)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
                )}
              >
                {price}
              </button>
            );
          })}
        </div>
      </Section>
      {/* Rating */}
      <Section
        title={
          minRating
            ? `Minimum rating · ${minRating.toFixed(1)}+`
            : "Minimum rating"
        }
      >
        <Slider
          value={minRating}
          onValueChange={(value) =>
            setMinRatingAction(Array.isArray(value) ? (value[0] ?? 0) : value)
          }
          min={0}
          max={5}
          step={0.5}
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>Any</span>
          <span>5.0</span>
        </div>
      </Section>
    </div>
  );
}