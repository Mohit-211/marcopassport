import { Link2 } from "lucide-react";

export function ShareButton({
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      {...props}
      className="h-10 w-10 rounded-full border border-border bg-background text-primary hover:bg-gold hover:text-gold-foreground hover:border-gold transition-all flex items-center justify-center shadow-soft"
    >
      {children}
    </button>
  );
}

// lucide-react no longer ships brand/social icons (Twitter, Facebook, etc.),
// so these render as short text glyphs instead — sized and weighted to sit
// visually alongside the Link2 icon in the same row of buttons.
function TwitterGlyph() {
  return <span className="text-[13px] font-bold leading-none">X</span>;
}

function FacebookGlyph() {
  return (
    <span className="text-[11px] font-bold uppercase leading-none">Fb</span>
  );
}

export function ShareRail({
  onShare,
}: {
  onShare: (t: "twitter" | "facebook" | "copy") => void;
}) {
  return (
    <div className="flex flex-col gap-2 items-start">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-foreground">
        Share
      </p>
      <div className="flex flex-col gap-2">
        <ShareButton
          onClick={() => onShare("twitter")}
          aria-label="Share on Twitter"
        >
          <TwitterGlyph />
        </ShareButton>
        <ShareButton
          onClick={() => onShare("facebook")}
          aria-label="Share on Facebook"
        >
          <FacebookGlyph />
        </ShareButton>
        <ShareButton onClick={() => onShare("copy")} aria-label="Copy link">
          <Link2 className="h-4 w-4" />
        </ShareButton>
      </div>
    </div>
  );
}

export { TwitterGlyph, FacebookGlyph };
