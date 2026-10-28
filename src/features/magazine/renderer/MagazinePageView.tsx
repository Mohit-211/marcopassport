/** @format */

import type { CSSProperties, ReactNode } from "react";
import "./magazine.css";
import { img, list, str } from "./content";
import { pdfPage, type PdfLinkArea } from "./pdf";
import { BodyText } from "./text";
import type { MagImage, MagPage, RenderContext } from "./types";

type LayoutProps = { c: Record<string, unknown>; ctx: RenderContext };

const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(" ");

const focus = (image: MagImage): CSSProperties => ({ objectPosition: `${image.focusX ?? 50}% ${image.focusY ?? 50}%` });

// An empty text slot: a faint label while editing, nothing in the reader.
const Hint = ({ ctx, children }: { ctx: RenderContext; children: ReactNode }) =>
  ctx.mode === "edit" ? <span style={{ opacity: 0.32 }}>{children}</span> : null;

const text = (ctx: RenderContext, value: string, hint: string) => value || <Hint ctx={ctx}>{hint}</Hint>;

// A photo filling the whole page.
function FillPhoto({ image, ctx, label, contain }: { image: MagImage | null; ctx: RenderContext; label: string; contain?: boolean }) {
  if (image) {
    return (
      <img
        className="mag-fill"
        src={ctx.resolveImage(image.src)}
        alt={image.alt ?? ""}
        loading="lazy"
        style={{ ...focus(image), ...(contain ? { objectFit: "contain" } : null) }}
      />
    );
  }
  return ctx.mode === "edit" ? <span className="mag-placeholder">{label}</span> : null;
}

// A photo in a frame on the page.
function Photo({
  image,
  ctx,
  label,
  className,
  style,
  contain,
  children,
}: {
  image: MagImage | null;
  ctx: RenderContext;
  label: string;
  className?: string;
  style?: CSSProperties;
  contain?: boolean;
  children?: ReactNode;
}) {
  if (!image && ctx.mode === "read") return null;
  return (
    <div className={cx("mag-photo", className)} style={style}>
      <FillPhoto image={image} ctx={ctx} label={label} contain={contain} />
      {children}
    </div>
  );
}

// "www.example.com" -> "https://www.example.com"; site paths stay relative.
// Anything else (e.g. "javascript:") ends up as a harmless https address.
// The API refuses those on save too; "/\" is out because browsers read it as
// "//", another site.
const href = (link: string) => {
  const value = link.trim();
  if (!value) return "";
  if (/^(https?:|mailto:|tel:)/i.test(value) || /^\/(?![/\\])/.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  return `https://${value}`;
};

// Clickable in the reader; plain while editing, so clicks select the page.
function MaybeLink({ link, ctx, className, style, children }: { link: string; ctx: RenderContext; className?: string; style?: CSSProperties; children: ReactNode }) {
  const url = href(link);
  if (url && ctx.mode === "read") {
    return (
      <a className={cx("mag-link", className)} style={style} href={url} target={url.startsWith("/") ? undefined : "_blank"} rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

// Page footer: masthead and issue on the inside, the number on the outside
// edge. Even pages are left-hand pages (the cover is page 1, on the right).
function Folio({ ctx }: { ctx: RenderContext }) {
  const left = ctx.pageNumber % 2 === 0;
  return (
    <div className={cx("mag-folio", left && "mag-folio-left")}>
      <span>{[ctx.issue.masthead || "Marco", ctx.issue.season].filter(Boolean).join(" · ")}</span>
      <span className="mag-folio-number">{ctx.pageNumber}</span>
    </div>
  );
}

// Text that has to fit its box; the editor checks these for overflow.
const Flow = ({ name, className, style, children }: { name: string; className?: string; style?: CSSProperties; children: ReactNode }) => (
  <div data-mag-flow={name} className={className} style={{ flex: 1, minHeight: 0, overflow: "hidden", ...style }}>
    {children}
  </div>
);

const pullQuote = (value: string) => (value ? <blockquote className="mag-pullquote">{value}</blockquote> : null);

// ---- Layouts ---------------------------------------------------------------

function Cover({ c, ctx }: LayoutProps) {
  const image = img(c, "image");
  const dark = str(c, "text") === "dark";
  const lines = str(c, "lines")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4);
  return (
    <div className={cx("mag-inner mag-cover", dark ? "mag-dark-text" : "mag-light-text mag-on-dark", !image && !dark && "mag-navy")}>
      <FillPhoto image={image} ctx={ctx} label="Cover photo" />
      {image && (dark ? <div className="mag-scrim-light" aria-hidden /> : <><div className="mag-scrim-top" aria-hidden /><div className="mag-scrim-bottom" aria-hidden /></>)}
      <p className="mag-masthead">{ctx.issue.masthead || "MARCO"}</p>
      <div className="mag-issue-line">
        <span>{ctx.issue.issue_label}</span>
        <span>{ctx.issue.season}</span>
      </div>
      <div className="mag-cover-text">
        <h1 className="mag-cover-headline">{text(ctx, str(c, "headline"), "Main cover line")}</h1>
        {str(c, "dek") && <p className="mag-dek" style={{ color: "inherit", opacity: 0.9 }}>{str(c, "dek")}</p>}
        {(lines.length > 0 || ctx.mode === "edit") && (
          <div className="mag-cover-lines">
            {lines.length ? lines.map((line, i) => <span key={i}>{line}</span>) : <Hint ctx={ctx}>Up to four smaller cover lines</Hint>}
          </div>
        )}
      </div>
    </div>
  );
}

function Contents({ c, ctx }: LayoutProps) {
  const image = img(c, "image");
  const entries = ctx.contents;
  return (
    <div className="mag-inner">
      <div className="mag-pad">
        <p className="mag-kicker">{ctx.issue.issue_label || "Contents"}</p>
        <h2 className="mag-headline" style={{ fontSize: "2.5em" }}>
          {str(c, "headline") || "In this issue"}
        </h2>
        {str(c, "intro") && <p className="mag-dek">{str(c, "intro")}</p>}
        {image && <Photo image={image} ctx={ctx} label="Photo" style={{ height: "24%", marginTop: "1.2em", flexShrink: 0 }} />}
        <Flow name="Contents" className={cx("mag-contents-list", entries.length > 5 && "mag-two-col")}>
          {entries.length
            ? entries.map((entry) => {
                const inner = (
                  <>
                    <span className="mag-contents-number">{entry.pageNumber}</span>
                    <div>
                      {entry.kicker && <p className="mag-kicker">{entry.kicker}</p>}
                      <p className="mag-contents-title">{entry.title}</p>
                      {entry.description && <p className="mag-contents-desc">{entry.description}</p>}
                    </div>
                  </>
                );
                return ctx.mode === "read" && ctx.goToPage ? (
                  <button key={entry.pageNumber} type="button" className="mag-contents-entry mag-contents-link" onClick={() => ctx.goToPage?.(entry.pageNumber - 1)}>
                    {inner}
                  </button>
                ) : (
                  <div key={entry.pageNumber} className="mag-contents-entry">
                    {inner}
                  </div>
                );
              })
            : ctx.mode === "edit" && (
                <p className="mag-caption">
                  Fills itself in: every feature, article, gallery, guide and letter with a headline is listed with its page
                  number.
                </p>
              )}
        </Flow>
      </div>
      <Folio ctx={ctx} />
    </div>
  );
}

function Letter({ c, ctx }: LayoutProps) {
  const portrait = img(c, "portrait");
  return (
    <div className="mag-inner mag-cream">
      <div className="mag-pad">
        <p className="mag-kicker">{str(c, "kicker") || "From the editor"}</p>
        <h2 className="mag-headline" style={{ fontSize: "2.2em" }}>
          {text(ctx, str(c, "headline"), "Headline")}
        </h2>
        <div className="mag-rule" />
        <Flow name="Letter">
          {str(c, "body") ? <BodyText className="mag-body" text={str(c, "body")} dropCap /> : <p className="mag-body"><Hint ctx={ctx}>Write the letter in the panel on the right.</Hint></p>}
        </Flow>
        <div className="mag-signature">
          {(portrait || ctx.mode === "edit") && <Photo image={portrait} ctx={ctx} label="Portrait" className="mag-portrait" />}
          <div>
            <p className="mag-signature-name">{text(ctx, str(c, "signature_name"), "Your name")}</p>
            {str(c, "signature_role") && <p className="mag-byline" style={{ marginTop: "0.4em" }}>{str(c, "signature_role")}</p>}
          </div>
        </div>
      </div>
      <Folio ctx={ctx} />
    </div>
  );
}

function Feature({ c, ctx }: LayoutProps) {
  const image = img(c, "image");
  const position = str(c, "position") || "bottom";
  return (
    <div className={cx("mag-inner mag-on-dark mag-light-text", !image && "mag-navy")}>
      <FillPhoto image={image} ctx={ctx} label="Opening photo" />
      {image && <div className={position === "top" ? "mag-scrim-top" : position === "center" ? "mag-scrim-full" : "mag-scrim-bottom"} style={position === "top" ? { background: "linear-gradient(to bottom, color-mix(in srgb, var(--mag-ink) 85%, transparent) 0%, transparent 55%)" } : undefined} aria-hidden />}
      <div className={cx("mag-feature-text", `mag-pos-${position}`)}>
        {str(c, "kicker") && <p className="mag-kicker">{str(c, "kicker")}</p>}
        <h2 className="mag-headline" style={{ fontSize: "3.1em" }}>
          {text(ctx, str(c, "headline"), "Feature headline")}
        </h2>
        {str(c, "dek") && <p className="mag-dek">{str(c, "dek")}</p>}
        {str(c, "byline") && <p className="mag-byline">{str(c, "byline")}</p>}
      </div>
      {str(c, "credit") && <p className="mag-credit mag-corner-credit">{str(c, "credit")}</p>}
    </div>
  );
}

function StoryHeader({ c, ctx, size = "2.1em" }: LayoutProps & { size?: string }) {
  return (
    <>
      {str(c, "kicker") && <p className="mag-kicker">{str(c, "kicker")}</p>}
      <h2 className="mag-headline" style={{ fontSize: size }}>
        {text(ctx, str(c, "headline"), "Headline")}
      </h2>
      {str(c, "dek") && <p className="mag-dek">{str(c, "dek")}</p>}
      {str(c, "byline") && <p className="mag-byline">{str(c, "byline")}</p>}
    </>
  );
}

function StoryBody({ c, ctx, columns }: LayoutProps & { columns: 1 | 2 }) {
  const body = str(c, "body");
  return (
    <Flow name="Story text" className={columns === 2 ? "mag-cols-2" : undefined} style={{ marginTop: "1.1em" }}>
      {body ? (
        <BodyText className="mag-body" text={body} dropCap={c.drop_cap !== false} aside={pullQuote(str(c, "pull_quote"))} />
      ) : (
        <p className="mag-body">
          <Hint ctx={ctx}>The story's text goes here. Write it in the panel on the right.</Hint>
        </p>
      )}
    </Flow>
  );
}

function Article({ c, ctx }: LayoutProps) {
  const image = img(c, "image");
  const placement = str(c, "image_position") || "top";
  const caption = str(c, "caption");

  if (placement === "side") {
    return (
      <div className="mag-inner" style={{ display: "grid", gridTemplateColumns: "44% 1fr" }}>
        <div style={{ position: "relative" }}>
          <Photo image={image} ctx={ctx} label="Story photo" style={{ position: "absolute", inset: 0 }} />
          {caption && (
            <p className="mag-caption mag-on-dark" style={{ position: "absolute", left: "1.4em", right: "1.4em", bottom: "1.4em", color: "var(--mag-light)", textShadow: "0 0 0.6em rgb(0 0 0 / 0.6)" }}>
              {caption}
            </p>
          )}
        </div>
        <div style={{ position: "relative" }}>
          <div className="mag-pad" style={{ left: "2em", right: "2.4em" }}>
            <StoryHeader c={c} ctx={ctx} size="1.9em" />
            <StoryBody c={c} ctx={ctx} columns={1} />
          </div>
          <Folio ctx={ctx} />
        </div>
      </div>
    );
  }

  return (
    <div className="mag-inner">
      <div className="mag-pad">
        {placement === "top" && (image || ctx.mode === "edit") && (
          <div style={{ flexShrink: 0, marginBottom: "1.2em" }}>
            <Photo image={image} ctx={ctx} label="Story photo" style={{ height: "auto", aspectRatio: "16 / 9" }} />
            {caption && <p className="mag-caption" style={{ marginTop: "0.5em" }}>{caption}</p>}
          </div>
        )}
        <StoryHeader c={c} ctx={ctx} size={placement === "none" ? "2.6em" : "2.1em"} />
        <StoryBody c={c} ctx={ctx} columns={2} />
      </div>
      <Folio ctx={ctx} />
    </div>
  );
}

function TextPage({ c, ctx }: LayoutProps) {
  const image = img(c, "image");
  return (
    <div className="mag-inner">
      <div className="mag-pad">
        {str(c, "kicker") && <p className="mag-kicker" style={{ marginBottom: "0.8em" }}>{str(c, "kicker")}</p>}
        <StoryBody c={c} ctx={ctx} columns={2} />
        {image && (
          <div style={{ flexShrink: 0, marginTop: "1.1em" }}>
            <Photo image={image} ctx={ctx} label="Photo" style={{ aspectRatio: "16 / 7" }} />
            {str(c, "caption") && <p className="mag-caption" style={{ marginTop: "0.5em" }}>{str(c, "caption")}</p>}
          </div>
        )}
      </div>
      <Folio ctx={ctx} />
    </div>
  );
}

function Quote({ c, ctx }: LayoutProps) {
  const background = str(c, "background") || "navy";
  const image = img(c, "image");
  return (
    <div className={cx("mag-inner", background === "cream" ? "mag-cream" : "mag-navy mag-on-dark")}>
      {background === "photo" && (
        <>
          <FillPhoto image={image} ctx={ctx} label="Background photo" />
          <div className="mag-scrim-full" aria-hidden />
        </>
      )}
      <div className="mag-quote" data-mag-flow="Quote" style={{ overflow: "hidden" }}>
        <span className="mag-quote-mark" aria-hidden>
          “
        </span>
        <p className="mag-quote-text">{text(ctx, str(c, "quote"), "A line worth reading twice")}</p>
        {str(c, "attribution") && <p className="mag-quote-by">{str(c, "attribution")}</p>}
      </div>
    </div>
  );
}

function PhotoPage({ c, ctx }: LayoutProps) {
  const image = img(c, "image");
  const hasText = !!(str(c, "headline") || str(c, "caption") || str(c, "credit"));
  return (
    <div className={cx("mag-inner mag-on-dark mag-light-text", !image && "mag-navy")}>
      <FillPhoto image={image} ctx={ctx} label="Full-page photo" />
      {image && hasText && <div className="mag-scrim-bottom" aria-hidden />}
      <div className="mag-photo-text">
        {str(c, "headline") && <h2 className="mag-headline" style={{ fontSize: "2em" }}>{str(c, "headline")}</h2>}
        {str(c, "caption") && <p className="mag-caption" style={{ marginTop: "0.6em" }}>{str(c, "caption")}</p>}
        {str(c, "credit") && <p className="mag-credit" style={{ marginTop: "0.6em" }}>{str(c, "credit")}</p>}
      </div>
    </div>
  );
}

function Gallery({ c, ctx }: LayoutProps) {
  const photos = list(c, "photos").slice(0, 4);
  const slots = ctx.mode === "edit" ? Math.max(photos.length, 2) : photos.length;
  const count = Math.min(Math.max(slots, 2), 4);
  const captions = photos.map((p) => str(p, "caption")).filter(Boolean);
  return (
    <div className="mag-inner">
      <div className="mag-pad">
        {str(c, "kicker") && <p className="mag-kicker">{str(c, "kicker")}</p>}
        {(str(c, "headline") || ctx.mode === "edit") && (
          <h2 className="mag-headline" style={{ fontSize: "1.9em" }}>
            {text(ctx, str(c, "headline"), "Headline (optional)")}
          </h2>
        )}
        <div className={`mag-gallery mag-gallery-${count}`}>
          {Array.from({ length: count }, (_, i) => {
            const photo = photos[i];
            return (
              <Photo key={i} image={photo ? img(photo, "image") : null} ctx={ctx} label={`Photo ${i + 1}`}>
                {captions.length > 0 && photo && str(photo, "caption") && <span className="mag-gallery-number">{i + 1}</span>}
              </Photo>
            );
          })}
        </div>
        {captions.length > 0 && (
          <div className="mag-gallery-captions">
            {photos.map((p, i) =>
              str(p, "caption") ? (
                <p key={i} className="mag-caption">
                  <strong style={{ color: "var(--mag-ink)" }}>{i + 1}</strong> {str(p, "caption")}
                </p>
              ) : null,
            )}
          </div>
        )}
        {str(c, "credit") && <p className="mag-credit" style={{ marginTop: "0.6em" }}>{str(c, "credit")}</p>}
      </div>
      <Folio ctx={ctx} />
    </div>
  );
}

function Guide({ c, ctx }: LayoutProps) {
  const items = list(c, "items").slice(0, 6);
  const shown = items.length ? items : ctx.mode === "edit" ? [{}, {}, {}] : [];
  return (
    <div className="mag-inner mag-cream">
      <div className="mag-pad">
        {str(c, "kicker") && <p className="mag-kicker">{str(c, "kicker")}</p>}
        <h2 className="mag-headline" style={{ fontSize: "2.2em" }}>
          {text(ctx, str(c, "headline"), "Guide headline")}
        </h2>
        {str(c, "intro") && <p className="mag-dek">{str(c, "intro")}</p>}
        <Flow name="Guide entries" className={cx("mag-guide-list", shown.length > 3 && "mag-two-col")}>
          {shown.map((item, i) => {
            const image = img(item, "image");
            return (
              <MaybeLink key={i} link={str(item, "link")} ctx={ctx} className="mag-guide-item">
                {image && <Photo image={image} ctx={ctx} label="Photo" />}
                <p className="mag-guide-name">
                  <span className="mag-guide-number">{i + 1}</span>
                  <span>{text(ctx, str(item, "name"), "Place name")}</span>
                </p>
                {str(item, "text") ? <p className="mag-guide-text">{str(item, "text")}</p> : <p className="mag-guide-text"><Hint ctx={ctx}>A line or two about it.</Hint></p>}
                {str(item, "details") && <p className="mag-guide-details">{str(item, "details")}</p>}
              </MaybeLink>
            );
          })}
        </Flow>
      </div>
      <Folio ctx={ctx} />
    </div>
  );
}

// The site's page for advertisers; unsold ad space points there.
const HOUSE_AD_LINK = "/advertise-with-us";

function HouseAd({ ctx }: { ctx: RenderContext }) {
  return (
    <MaybeLink link={HOUSE_AD_LINK} ctx={ctx} className="mag-ad-slot mag-house-ad">
      <p className="mag-kicker">Advertise in {ctx.issue.masthead || "Marco"}</p>
      <p className="mag-headline" style={{ fontSize: "1.8em" }}>
        Your business here
      </p>
      <p className="mag-caption" style={{ marginTop: "0.6em" }}>
        Reach visitors while they plan their Marco Island trip.
      </p>
    </MaybeLink>
  );
}

function AdHalf({ c, ctx }: LayoutProps) {
  const ads = list(c, "ads").slice(0, 2);
  return (
    <div className="mag-inner mag-cream" style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "0.15em" }}>
      {[0, 1].map((i) => {
        const ad = ads[i] ?? {};
        const image = img(ad, "image");
        if (!image && ctx.mode === "read") return <HouseAd key={i} ctx={ctx} />;
        return (
          <MaybeLink key={i} link={str(ad, "link")} ctx={ctx} className="mag-ad-slot">
            <FillPhoto image={image} ctx={ctx} label={`Half-page ad ${i + 1} · 17:11 artwork`} contain />
            {image && <span className="mag-ad-label">Advertisement</span>}
          </MaybeLink>
        );
      })}
    </div>
  );
}

function AdCards({ c, ctx }: LayoutProps) {
  const cards = list(c, "cards").slice(0, 8);
  const shown = cards.length ? cards : ctx.mode === "edit" ? Array.from({ length: 4 }, () => ({})) : [];
  return (
    <div className="mag-inner mag-cream">
      <div className="mag-pad">
        <p className="mag-kicker">{str(c, "kicker") || "Advertisement"}</p>
        <h2 className="mag-headline" style={{ fontSize: "1.9em" }}>
          {str(c, "headline") || "Local business directory"}
        </h2>
        <Flow name="Business cards" className="mag-cards">
          {shown.map((card, i) => {
            const artwork = img(card, "artwork");
            if (artwork) {
              return (
                <MaybeLink key={i} link={str(card, "website")} ctx={ctx} className="mag-card mag-card-art">
                  <img src={ctx.resolveImage(artwork.src)} alt={artwork.alt || str(card, "name")} loading="lazy" />
                </MaybeLink>
              );
            }
            const logo = img(card, "logo");
            const website = str(card, "website");
            const contact = [str(card, "phone"), website.replace(/^https?:\/\//i, "").replace(/\/$/, "")].filter(Boolean).join(" · ");
            return (
              <MaybeLink key={i} link={website} ctx={ctx} className="mag-card">
                {(logo || ctx.mode === "edit") && <Photo image={logo} ctx={ctx} label="Logo" contain />}
                <div style={{ minWidth: 0 }}>
                  <p className="mag-card-name">{text(ctx, str(card, "name"), "Business name")}</p>
                  {str(card, "line") && <p className="mag-card-line">{str(card, "line")}</p>}
                  {contact && <p className="mag-card-contact">{contact}</p>}
                </div>
              </MaybeLink>
            );
          })}
          {ctx.mode === "read" && cards.length < 8 && (
            <MaybeLink link={HOUSE_AD_LINK} ctx={ctx} className="mag-card mag-card-house">
              <div>
                <p className="mag-card-name">Your business here</p>
                <p className="mag-card-line">Reach visitors planning their Marco Island trip.</p>
                <p className="mag-card-contact">Advertise in Marco</p>
              </div>
            </MaybeLink>
          )}
        </Flow>
      </div>
      <Folio ctx={ctx} />
    </div>
  );
}

// A link kept from a PDF, over the spot it covered on the page.
function Hotspot({ area, ctx }: { area: PdfLinkArea; ctx: RenderContext }) {
  const style = { left: `${area.x}%`, top: `${area.y}%`, width: `${area.w}%`, height: `${area.h}%` };
  if (area.page_id) {
    const at = ctx.pageIndexOf?.(area.page_id) ?? -1;
    if (at < 0) return null;
    return <button type="button" className="mag-hotspot" style={style} onClick={() => ctx.goToPage?.(at)} title={`Page ${at + 1}`} aria-label={`Go to page ${at + 1}`} />;
  }
  const url = href(area.link ?? "");
  if (!url) return null;
  return <a className="mag-hotspot" style={style} href={url} target={url.startsWith("/") ? undefined : "_blank"} rel="noopener noreferrer" title={url} aria-label={url} />;
}

function ImagePage({ c, ctx }: LayoutProps) {
  const image = img(c, "image");
  const background = str(c, "background") || "white";
  const fit = str(c, "fit") !== "fill";
  const pdf = pdfPage(c);
  // A page from a PDF sits in a box of the PDF page's shape, so its links
  // land on the words they belong to.
  const pdfBox = (children: ReactNode, className?: string) =>
    pdf && <div className={cx("mag-pdf-box", !fit && "mag-pdf-fill", className)} style={{ "--mag-pdf-ratio": pdf.ratio } as CSSProperties}>{children}</div>;
  return (
    <div className={cx("mag-inner", background === "navy" && "mag-navy", background === "cream" && "mag-cream")}>
      <MaybeLink link={str(c, "link")} ctx={ctx} className="mag-ad-slot" style={{ position: "absolute", inset: 0 }}>
        {pdf && image ? (
          pdfBox(<img className="mag-fill" src={ctx.resolveImage(image.src)} alt={image.alt ?? ""} loading="lazy" />)
        ) : (
          <FillPhoto image={image} ctx={ctx} label="Full-page image or ad" contain={fit} />
        )}
      </MaybeLink>
      {pdf && ctx.mode === "read" && pdf.links.length > 0 && pdfBox(pdf.links.map((area, i) => <Hotspot key={i} area={area} ctx={ctx} />), "mag-pdf-links")}
      {pdf?.text && ctx.mode === "read" && <p className="mag-sr-only">{pdf.text}</p>}
      {c.is_ad === true && <span className="mag-ad-label">Advertisement</span>}
    </div>
  );
}

function BackCover({ c, ctx }: LayoutProps) {
  const image = img(c, "image");
  return (
    <div className={cx("mag-inner mag-on-dark mag-light-text", !image && "mag-navy")}>
      <FillPhoto image={image} ctx={ctx} label="Back cover photo (optional)" />
      {image && <div className="mag-scrim-bottom" aria-hidden />}
      <div className="mag-back-text">
        <p className="mag-back-masthead">{ctx.issue.masthead || "MARCO"}</p>
        <p className="mag-headline" style={{ fontSize: "2em", marginTop: "0.5em" }}>
          {str(c, "headline") || "Until next issue"}
        </p>
        {str(c, "text") && <p className="mag-caption" style={{ marginTop: "0.8em" }}>{str(c, "text")}</p>}
      </div>
    </div>
  );
}

function Unknown({ ctx }: LayoutProps) {
  return ctx.mode === "edit" ? <span className="mag-placeholder">Unknown layout</span> : null;
}

const RENDERERS: Record<string, (props: LayoutProps) => ReactNode> = {
  cover: Cover,
  contents: Contents,
  letter: Letter,
  feature: Feature,
  article: Article,
  text: TextPage,
  quote: Quote,
  photo: PhotoPage,
  gallery: Gallery,
  guide: Guide,
  ad_half: AdHalf,
  ad_cards: AdCards,
  image_page: ImagePage,
  back: BackCover,
};

// One magazine page at whatever width its container gives it.
export function MagazinePageView({ page, ctx, className }: { page: MagPage; ctx: RenderContext; className?: string }) {
  const Layout = RENDERERS[page.layout] ?? Unknown;
  return (
    <div className={cx("mag-page", className)} lang="en" data-layout={page.layout}>
      <Layout c={page.content} ctx={ctx} />
    </div>
  );
}
