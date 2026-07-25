import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium transition-all outline-none select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary-soft",

        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",

        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",

        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",

        ghost: "hover:bg-accent hover:text-accent-foreground",

        link: "text-primary underline-offset-4 hover:underline",

        gold: "bg-gold text-gold-foreground shadow-gold hover:brightness-105 font-semibold",

        hero: "bg-gold text-gold-foreground shadow-gold hover:brightness-105 font-semibold tracking-wide",

        ghostLight:
          "text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/10",
      },

      size: {
        default: "h-10 px-5 py-2 rounded-full",
        sm: "h-9 px-4 rounded-full text-xs",
        lg: "h-12 px-8 rounded-full text-base",
        xl: "h-14 px-10 rounded-full text-base",
        icon: "size-10 rounded-full",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
