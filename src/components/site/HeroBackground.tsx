import Image from "next/image";
import { cn } from "@/lib/utils";

type HeroBackgroundProps = {
  src: string;
  /** Leave empty for purely decorative images. */
  alt?: string;
  /** Extra classes for the image, e.g. a custom `object-[30%_center]` crop. */
  className?: string;
};

/**
 * Shared full-bleed hero image + overlay. Place inside a `.hero-viewport`
 * section so every page hero uses the same image treatment.
 */
export function HeroBackground({ src, alt = "", className }: HeroBackgroundProps) {
  return (
    <>
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={src}
          alt={alt}
          aria-hidden={alt ? undefined : true}
          fill
          priority
          sizes="100vw"
          // Remote (API) images aren't configured for the Next image optimizer.
          unoptimized={/^https?:\/\//.test(src)}
          className={cn("object-cover object-center", className)}
        />
      </div>

      {/* Image treatment */}
      <div className="absolute inset-0 -z-10 bg-primary/15" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/85 via-primary/40 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/70 via-transparent to-primary/10" />
    </>
  );
}
