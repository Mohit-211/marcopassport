import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/** Shared pin look for the Google map (applied to a raw DOM node) and the preview map. */
export const pinClassName = cn(
  "grid size-8 cursor-pointer place-items-center rounded-full border-2 border-white",
  "bg-primary text-xs font-semibold text-primary-foreground shadow-lg",
  "transition-transform duration-200 hover:scale-110",
  "data-[active=true]:z-10 data-[active=true]:scale-125 data-[active=true]:bg-brand-primary-hover",
  "data-[active=true]:ring-4 data-[active=true]:ring-gold",
);

export function MapControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid size-10 place-items-center rounded-lg bg-white text-primary shadow-md",
        "transition-colors hover:bg-brand-primary-tint disabled:cursor-not-allowed disabled:opacity-40",
        "outline-none focus-visible:ring-3 focus-visible:ring-brand-primary/60",
      )}
    >
      {children}
    </button>
  );
}

export function MapLoading() {
  return (
    <div
      role="status"
      className="absolute inset-0 grid place-items-center bg-brand-primary-tint text-sm text-primary/70"
    >
      <span className="flex items-center gap-2">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        Loading map…
      </span>
    </div>
  );
}
