import {
  ArrowUpRight,
  Lightbulb,
  Landmark,
  MapPin,
  Sun,
  Calendar,
  Languages,
  Phone,
} from "lucide-react";

const quickTips = [
  { icon: Calendar, label: "Time zone", value: "Eastern (ET)" },
  {
    icon: Languages,
    label: "Language",
    value: "English · Spanish widely spoken",
  },
  {
    icon: Phone,
    label: "Emergency",
    value: "911 · Non-emergency 239-389-5050",
  },
  { icon: MapPin, label: "Getting here", value: "RSW · 50 min · APF · 30 min" },
  { icon: Sun, label: "Average temp", value: "75°F winter · 88°F summer" },
  {
    icon: Landmark,
    label: "Official city info",
    value: "cityofmarcoisland.com",
    href: "https://www.cityofmarcoisland.com/",
  },
];

export function QuickTips() {
  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-24">
      <div className="site-container">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-gold" />
          <p className="eyebrow text-gold">
            Things to know
          </p>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-2xl leading-tight">
          Quick tips before you go
        </h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-primary-foreground/10 rounded-card overflow-hidden">
          {quickTips.map((t) => {
            const Icon = t.icon;
            const content = (
              <>
                <span className="grid place-items-center h-10 w-10 rounded-full bg-gold/15 text-gold shrink-0">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="eyebrow text-primary-foreground/60">
                    {t.label}
                  </p>
                  <p className="mt-1 font-medium text-primary-foreground">
                    {t.value}
                    {t.href && (
                      <ArrowUpRight className="ml-1 inline-block h-4 w-4 align-middle text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    )}
                  </p>
                </div>
              </>
            );
            // A tip with a link opens it in a new tab, and the whole tile is clickable.
            return t.href ? (
              <a
                key={t.label}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-primary p-6 flex items-start gap-4 transition-colors hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
              >
                {content}
              </a>
            ) : (
              <div
                key={t.label}
                className="bg-primary p-6 flex items-start gap-4"
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
