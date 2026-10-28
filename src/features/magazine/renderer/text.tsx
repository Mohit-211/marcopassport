/** @format */

import { Fragment, type ReactNode } from "react";

// Body text is plain text with a few marks, so it stays safe and portable:
// a blank line starts a new paragraph, "## " starts a subheading, and
// **bold** / *italic* work inside a paragraph.
const INLINE = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g;

const inline = (text: string, key: string): ReactNode[] =>
  text.split(INLINE).flatMap((part, i) => {
    if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) return [<strong key={`${key}-${i}`}>{part.slice(2, -2)}</strong>];
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) return [<em key={`${key}-${i}`}>{part.slice(1, -1)}</em>];
    return part.split("\n").flatMap((line, j, lines) => (j < lines.length - 1 ? [line, <br key={`${key}-${i}-${j}`} />] : [line]));
  });

// `aside` (e.g. a pull quote) goes after the second paragraph, or at the end
// of shorter text.
export function BodyText({
  text,
  dropCap = false,
  className,
  aside,
}: {
  text: string;
  dropCap?: boolean;
  className?: string;
  aside?: ReactNode;
}) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const paragraphs = blocks.filter((block) => !block.startsWith("## ")).length;
  const asideAfter = Math.min(2, paragraphs);
  let paragraph = 0;
  return (
    <div className={className}>
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h4 key={i} className="mag-subhead">
              {block.slice(3)}
            </h4>
          );
        }
        paragraph += 1;
        return (
          <Fragment key={i}>
            <p className={dropCap && paragraph === 1 ? "mag-dropcap" : undefined}>{inline(block, String(i))}</p>
            {aside && paragraph === asideAfter && aside}
          </Fragment>
        );
      })}
      {aside && asideAfter === 0 && aside}
    </div>
  );
}
