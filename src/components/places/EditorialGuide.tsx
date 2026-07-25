import Link from "next/link";
import { ArrowRight, MapPin, Sun, Sunrise, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

function EditorialRow({
  eyebrow,
  icon: Icon,
  title,
  kicker,
  body,
  image,
  align,
}: {
  eyebrow: string;
  icon: typeof Sunrise;
  title: string;
  kicker: string;
  body: string[];
  image: string;
  align: "left" | "right";
}) {
  return (
    <article className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
      <div className={cn("relative", align === "right" && "md:order-2")}>
        <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-elegant">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div
          className={cn(
            "absolute -bottom-5 bg-background border border-border rounded-2xl px-5 py-4 shadow-elegant flex items-center gap-3",
            align === "right" ? "-left-4" : "-right-4"
          )}
        >
          <div className="grid place-items-center h-10 w-10 rounded-full bg-gold text-gold-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <div className="text-xs uppercase tracking-widest font-semibold text-primary">
            {eyebrow}
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
          {kicker}
        </p>
        <h3 className="font-display text-4xl md:text-5xl font-semibold mt-2 text-balance">
          {title}
        </h3>
        <div className="mt-6 space-y-4 text-foreground/80 leading-relaxed text-lg">
          {body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 mt-6 text-primary font-semibold story-link"
        >
          Read the full guide <ArrowRight className="h-4 w-4" />
        </Link>
        <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-gold" /> Marco Island, Florida
        </div>
      </div>
    </article>
  );
}

export default function EditorialGuide() {
  return (
    <section className="bg-sand py-20 md:py-28">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.22em] text-gold font-semibold">
            The guide
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mt-2 text-balance">
            How to make the most of the island
          </h2>
          <p className="text-muted-foreground mt-4">
            Three short guides from our editors — written the way we'd tell a
            friend.
          </p>
        </div>

        <div className="space-y-20 md:space-y-28">
          <EditorialRow
            eyebrow="Chapter 01"
            icon={Sunrise}
            title="Best time to visit"
            kicker="When the light is golden and the crowds are thin"
            body={[
              "Locals quietly swear by the shoulder seasons — late April through early June, and again from October into early December. The water still hovers in the high seventies, sunsets stretch on for hours, and you can actually find a parking spot at Tigertail.",
              "Plan around the tide chart, not the calendar. Low tide reveals the shell beds and the sandbar walk between Tigertail and Sand Dollar Island — arrive an hour before for the best haul.",
            ]}
            image="/assets/place-sunset.jpg"
            align="left"
          />
          <EditorialRow
            eyebrow="Chapter 02"
            icon={Waves}
            title="Hidden gems"
            kicker="The corners only longtime residents talk about"
            body={[
              "Skip the South Beach crowds and wander north along Hideaway Beach at sunrise — the shelling is unmatched and the light feels like a private museum. Pack water and a hat; there's no concession in sight.",
              "For a quiet lunch, the back patio at Old Marco Pub looks like nothing from the road and tastes like everything. Order the grouper sandwich and let the afternoon pass.",
            ]}
            image="/assets/place-mangrove.jpg"
            align="right"
          />
          <EditorialRow
            eyebrow="Chapter 03"
            icon={Sun}
            title="Perfect day itinerary"
            kicker="A single day, savored properly"
            body={[
              "Begin with coffee at the marina and a 9 a.m. dolphin cruise into the Ten Thousand Islands. Back by noon, lunch on the dock, then a slow afternoon at Residents' Beach — bring a book and the umbrella.",
              "End with stone crab claws and a glass of something cold while the sun goes down. Walk it off along South Beach. That's the day. That's the island.",
            ]}
            image="/assets/place-wildlife.jpg"
            align="left"
          />
        </div>
      </div>
    </section>
  );
}
