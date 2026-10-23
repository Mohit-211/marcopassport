import { Mail, Phone, MapPin } from "lucide-react";

// The same details as the advertising rate sheet.
const contactDetails = [
  {
    Icon: Mail,
    label: "Email",
    value: "sales@themarcopassport.com",
    href: "mailto:sales@themarcopassport.com",
  },
  { Icon: Phone, label: "Phone", value: "636-328-3133", href: "tel:+16363283133" },
  { Icon: MapPin, label: "Address", value: "1001 N Barfield Dr, Marco Island, FL 34145" },
];

export function ContactInfo() {
  return (
    <aside className="space-y-4">
      {contactDetails.map(({ Icon, label, value, href }) => (
        <div
          key={label}
          className="bg-sand rounded-2xl p-6 border border-border flex gap-4"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-gold shrink-0">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {label}
            </p>
            <p className="font-display text-lg mt-1 wrap-break-word">
              {href ? (
                <a href={href} className="transition-colors hover:text-primary">
                  {value}
                </a>
              ) : (
                value
              )}
            </p>
          </div>
        </div>
      ))}
    </aside>
  );
}
