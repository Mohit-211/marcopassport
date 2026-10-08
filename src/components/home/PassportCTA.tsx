import { Calendar, Heart, MapPin, Share2 } from "lucide-react";
import { CtaSection } from "@/components/site/CtaSection";

const features = [
  {
    icon: Heart,
    label: "Save favorites",
  },
  {
    icon: Calendar,
    label: "Plan your dates",
  },
  {
    icon: MapPin,
    label: "Map your stops",
  },
  {
    icon: Share2,
    label: "Share your trip",
  },
];

export function PassportCTA() {
  return (
    <CtaSection
      eyebrow="Your Marco Passport"
      title="Build your island itinerary, one place at a time."
      description="Save the places you love, plan when to visit them, and turn everything into one beautiful itinerary you can share."
      actions={[{ label: "Start my Passport", href: "/passport" }]}
    >
      {/* Features */}
      <div className="mt-4 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div key={feature.label} className="flex items-center gap-3">
              <Icon className="h-4 w-4 shrink-0 text-gold" />

              <span className="text-sm text-muted-foreground">
                {feature.label}
              </span>
            </div>
          );
        })}
      </div>
    </CtaSection>
  );
}
