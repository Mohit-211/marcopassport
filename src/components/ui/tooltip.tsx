"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

type Side = "top" | "bottom" | "left" | "right";

const popupClass =
  "z-50 max-w-64 origin-(--transform-origin) rounded-tile bg-primary px-3 py-2 text-xs leading-relaxed text-primary-foreground shadow-elegant outline-hidden duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95";

/** Wrap the app once so neighbouring tooltips open instantly after the first. */
function TooltipProvider({ delay = 250, ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider delay={delay} {...props} />;
}

/**
 * Hover/focus hint for a control, e.g. an icon button. Keyboard and mouse
 * only (touch screens don't hover), so keep the control's own label
 * (aria-label or visible text) meaningful; use InfoTip for explanations
 * that phone users need too.
 */
function Tooltip({
  content,
  side = "top",
  children,
}: {
  content: React.ReactNode;
  side?: Side;
  /** The control; it must accept a ref and spread props (buttons, links, Button). */
  children: React.ReactElement;
}) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger render={children} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side={side} sideOffset={8} collisionPadding={12} className="z-50">
          <TooltipPrimitive.Popup className={popupClass}>{content}</TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

/**
 * A small ⓘ next to a label that explains it. Opens on hover and on tap, so it
 * works on phones as well.
 */
function InfoTip({
  label,
  side = "top",
  className,
  children,
}: {
  /** What it explains, for screen readers: "About visit dates" */
  label: string;
  side?: Side;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger
        openOnHover
        delay={150}
        aria-label={label}
        className={cn(
          "inline-grid size-4 shrink-0 cursor-help place-items-center rounded-full align-middle text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:text-primary",
          className,
        )}
      >
        <Info className="size-3.5" aria-hidden />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner side={side} sideOffset={8} collisionPadding={12} className="z-50">
          <PopoverPrimitive.Popup className={cn(popupClass, "font-normal normal-case tracking-normal")}>
            {children}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export { InfoTip, Tooltip, TooltipProvider };
