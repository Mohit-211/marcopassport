import {
  Lightbulb,
  MapPin,
  Sun,
  Waves,
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
  { icon: Waves, label: "Beach safety", value: "Check daily surf flags" },
];

export function QuickTips() {
  return (
    <section className="bg-[#002E50] text-white py-20 md:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-[#EBBD00]" />
          <p className="text-xs uppercase tracking-[0.2em] text-[#EBBD00] font-semibold">
            Things to know
          </p>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-2xl leading-tight">
          Quick tips before you go
        </h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {quickTips.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.label}
                className="bg-[#002E50] p-6 flex items-start gap-4"
              >
                <span className="grid place-items-center h-10 w-10 rounded-full bg-[#EBBD00]/15 text-[#EBBD00] shrink-0">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/60">
                    {t.label}
                  </p>
                  <p className="mt-1 font-medium text-white">{t.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
