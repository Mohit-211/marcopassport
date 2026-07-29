import { Waves, Ship, UtensilsCrossed } from "lucide-react";

const highlights = [
  {
    icon: Waves,
    label: "Prime Shelling Spots",
    description: "Rare coastal treasures along our shores",
  },
  {
    icon: Ship,
    label: "Keewaydin Water Shuttle",
    description: "Day trips to the island's untouched beauty",
  },
  {
    icon: UtensilsCrossed,
    label: "50+ Top-Class Restaurants",
    description: "From dockside casual to fine dining",
  },
];

export function AboutUs() {
  return (
    <section className="bg-sand">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-primary/60 uppercase">
              About Us
            </span>
            <h2 className="font-display mt-3 text-3xl leading-tight text-primary md:text-4xl">
              Welcome to Marco Passport
            </h2>
            <div className="mt-6 space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Welcome to Marco Passport, your premier local guide to unlocking
                the very best of Marco Island. As longtime residents who proudly
                call this slice of paradise home, we created this magazine to
                share the exclusive, insider knowledge you won&apos;t find on
                generic travel websites. Our mission is to bridge the gap
                between typical vacation itineraries and the authentic island
                lifestyle, helping you curate a seamless and unforgettable
                vacation.
              </p>
              <p>
                We serve as your ultimate resource for navigating our
                sun-drenched shores and surrounding waters. Whether you are
                looking for the absolute best shelling destinations to find rare
                coastal treasures, planning a day trip via the Keewaydin Island
                water shuttle, or choosing between our island&apos;s 50+
                top-class restaurants, we provide expert recommendations. From
                local eco-tours and hidden natural wonders to world-class dining
                and pristine beaches, let Marco Passport be your trusted
                companion in paradise.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6 md:border-l md:border-border md:pl-12">
            {highlights.map(({ icon: Icon, label, description }) => (
              <div key={label} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-base text-primary">{label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
