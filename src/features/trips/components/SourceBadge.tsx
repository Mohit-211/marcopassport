import { Landmark, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ItemSource } from "../types";

export const SOURCE_STYLES: Record<ItemSource, { label: string; className: string; Icon: typeof Landmark }> = {
  places: {
    label: "Place",
    className: "bg-sky-100 text-sky-800 ring-sky-200",
    Icon: Landmark,
  },
  business: {
    label: "Business",
    className: "bg-amber-100 text-amber-900 ring-amber-200",
    Icon: Store,
  },
};

/** Colour + icon that tells places and businesses apart everywhere they appear. */
export function SourceBadge({ source, className }: { source: ItemSource; className?: string }) {
  const { label, className: color, Icon } = SOURCE_STYLES[source];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1",
        color,
        className,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}
