export function EditorLetter() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
        <div className="relative rounded-3xl border border-border bg-card p-8 shadow-elegant md:p-14">
          <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
            Letter From The Editor
          </span>
          <h2 className="font-display mt-3 text-3xl leading-tight text-primary md:text-4xl">
            Welcome to Paradise!
          </h2>

          <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
            <div className="float-right mb-4 ml-6 w-40 shrink-0 sm:w-52 md:w-60">
              <div className="overflow-hidden rounded-2xl border border-border shadow-soft">
                <img
                  src="/assets/editor.png"
                  alt="A quiet beach inlet on Marco Island, Florida"
                  loading="lazy"
                  className="h-32 w-full object-cover sm:h-40 md:h-44"
                />
              </div>
              <p className="mt-2 text-center text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
                Marco Island, FL
              </p>
            </div>

            <p>
              <span className="font-display float-left mr-3 mt-1 text-6xl leading-[0.8] text-gold">
                A
              </span>
              s the Editor-in-Chief of Marco Passport, it is my absolute
              pleasure to welcome you to our spectacular home. Whether you are a
              first-time visitor stepping onto our powder-white sands or a
              returning traveler drawn back by the rhythm of the Gulf, this
              issue is designed to be your ultimate island companion.
            </p>
            <p>
              Marco Island is a truly unique destination. It is a place where
              world-class luxury seamlessly blends with untamed natural beauty.
              In this edition, we have curated the very best experiences our
              island has to offer. We guide you to the premier spots to uncover
              rare treasures along our shores, and map out the island&apos;s
              culinary landscape, featuring over 50 top-class restaurants that
              showcase everything from casual dockside dining to fine cuisine.
            </p>
            <p>
              We also take you beyond the main beaches. You will find details on
              hopping aboard the Hemingway Water Shuttle to explore the
              pristine, untouched beauty of Keewaydin Island.
            </p>
            <p>
              Our mission is simple: to help you look past the standard tourist
              paths and dive straight into the authentic, breathtaking
              experiences that make Southwest Florida so unforgettable. So, grab
              your sunscreen, flip the page, and let your adventure begin.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-8 border-t border-border pt-8 md:flex-row md:items-end">
            <div>
              <p className="text-sm text-muted-foreground">Warmest regards,</p>
              <p className="font-display mt-1 text-3xl italic text-primary">
                The Editor
              </p>
              <p className="mt-1 text-xs tracking-[0.15em] text-muted-foreground uppercase">
                Marco Passport Magazine
              </p>
            </div>

            {/* Signature flourish: passport-style stamp */}
            <svg
              viewBox="0 0 160 160"
              className="h-28 w-28 shrink-0 -rotate-6 text-gold opacity-80 md:h-32 md:w-32"
              aria-hidden="true"
            >
              <defs>
                <path
                  id="stampTopArc"
                  d="M 20,80 A 60,60 0 0 1 140,80"
                  fill="none"
                />
                <path
                  id="stampBottomArc"
                  d="M 138,84 A 60,60 0 0 1 22,84"
                  fill="none"
                />
              </defs>
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="3 5"
              />
              <circle
                cx="80"
                cy="80"
                r="58"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <text
                fill="currentColor"
                fontSize="10"
                fontWeight="600"
                style={{ letterSpacing: "2px" }}
              >
                <textPath
                  href="#stampTopArc"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  MARCO PASSPORT
                </textPath>
              </text>
              <text
                fill="currentColor"
                fontSize="10"
                fontWeight="600"
                style={{ letterSpacing: "2px" }}
              >
                <textPath
                  href="#stampBottomArc"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  MARCO ISLAND, FL
                </textPath>
              </text>
              <text
                x="80"
                y="86"
                fill="currentColor"
                fontSize="20"
                fontWeight="700"
                textAnchor="middle"
                fontFamily="var(--font-display)"
              >
                MP
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
