import { Mail, Phone, MapPin } from "lucide-react";

const contactDetails = [
  { Icon: Mail, label: "Email", value: "hello@themarcopassport.com" },
  { Icon: Phone, label: "Phone", value: "+1 (239) 555-0142" },
  { Icon: MapPin, label: "Office", value: "Marco Island, FL 34145" },
];

export function ContactInfo() {
  return (
    <aside className="space-y-4">
      {contactDetails.map(({ Icon, label, value }) => (
        <div
          key={label}
          className="bg-sand rounded-2xl p-6 border border-border flex gap-4"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-gold shrink-0">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {label}
            </p>
            <p className="font-display text-lg mt-1">{value}</p>
          </div>
        </div>
      ))}
    </aside>
  );
}
