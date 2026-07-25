"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  FileText,
  Phone,
  ImagePlus,
  Link2,
  Package,
  Upload,
  X,
  Check,
  Sparkles,
  Star,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type PackageId = "basic" | "featured" | "banner";

const packages: {
  id: PackageId;
  name: string;
  price: string;
  desc: string;
  Icon: typeof Star;
  perks: string[];
}[] = [
  {
    id: "basic",
    name: "Basic Listing",
    price: "Free",
    desc: "A clean, searchable profile with contact info and website link.",
    Icon: Check,
    perks: ["Searchable profile", "Contact & website", "Standard placement"],
  },
  {
    id: "featured",
    name: "Featured Listing",
    price: "$29/mo",
    desc: "Priority placement in category and on relevant guides.",
    Icon: Star,
    perks: ["Priority placement", "Featured badge", "Photo gallery"],
  },
  {
    id: "banner",
    name: "Banner Promotion",
    price: "$79/mo",
    desc: "Premium homepage banner exposure with maximum reach.",
    Icon: Megaphone,
    perks: ["Homepage banner", "Top of category", "Analytics report"],
  },
];

function SectionCard({
  index,
  Icon,
  title,
  subtitle,
  children,
}: {
  index: string;
  Icon: typeof FileText;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#002E50] text-[#EBBD00]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-widest text-muted-foreground">
              {index}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#002E50] mt-1">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-[#002E50]">
        {label} {required && <span className="text-[#EBBD00]">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function SubmitBusinessPage() {
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageId>("featured");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    setImages((prev) => [...prev, ...next].slice(0, 12));
  }, []);

  const removeImage = (i: number) =>
    setImages((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-[#002E50]/5 to-transparent border-b border-border">
        <div className="container mx-auto px-4 py-10 sm:py-14 max-w-4xl">
          <Link
            href="/business"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#002E50] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List Your Business
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBBD00]/15 px-3 py-1 text-xs font-semibold text-[#002E50]">
              <Sparkles className="h-3.5 w-3.5" />
              Step 1 of 2 — Submission
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#002E50] tracking-tight">
            Submit Your Business
          </h1>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg max-w-2xl">
            A quick, guided form to add your listing. Takes about 3–5 minutes —
            you can save and continue later.
          </p>

          {/* Progress */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-[#002E50]/10 overflow-hidden">
              <div className="h-full w-1/2 bg-[#EBBD00] rounded-full" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              50%
            </span>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-10 sm:py-14 max-w-4xl">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: wire up real submission handling once backend is available
              router.push("/business/package");
            }}
          >
            {/* Basic Info */}
            <SectionCard
              index="01"
              Icon={Building2}
              title="Basic Information"
              subtitle="Tell us about your business at a glance."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Business Name" required>
                  <Input
                    placeholder="e.g. Sunset Grill Marco"
                    className="rounded-xl h-11"
                  />
                </Field>
                <Field label="Category" required>
                  <Select>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stay">Stay</SelectItem>
                      <SelectItem value="eat">Eat</SelectItem>
                      <SelectItem value="activities">Activities</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <div className="sm:col-span-2">
                  <Field
                    label="Short Tagline"
                    hint="One sentence travelers will see under your name."
                  >
                    <Input
                      placeholder="Waterfront dining with the island's best sunsets"
                      className="rounded-xl h-11"
                    />
                  </Field>
                </div>
              </div>
            </SectionCard>

            {/* Description */}
            <SectionCard
              index="02"
              Icon={FileText}
              title="Business Description"
              subtitle="Help visitors understand what makes you special."
            >
              <Field
                label="Description"
                required
                hint="Aim for 80–200 words. Write clearly and concisely — avoid sales language."
              >
                <Textarea
                  placeholder="Share your story, signature offerings, and what guests can expect..."
                  className="rounded-xl min-h-[160px] resize-y"
                />
              </Field>
            </SectionCard>

            {/* Contact */}
            <SectionCard
              index="03"
              Icon={Phone}
              title="Contact Information"
              subtitle="How travelers can reach and find you."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Phone Number" required>
                  <Input
                    type="tel"
                    placeholder="(239) 555-0123"
                    className="rounded-xl h-11"
                  />
                </Field>
                <Field label="Email Address" required>
                  <Input
                    type="email"
                    placeholder="hello@yourbusiness.com"
                    className="rounded-xl h-11"
                  />
                </Field>
                <Field label="Website URL">
                  <Input
                    type="url"
                    placeholder="https://yourbusiness.com"
                    className="rounded-xl h-11"
                  />
                </Field>
                <Field label="Physical Address" required>
                  <Input
                    placeholder="123 Collier Blvd, Marco Island, FL"
                    className="rounded-xl h-11"
                  />
                </Field>
              </div>
            </SectionCard>

            {/* Images */}
            <SectionCard
              index="04"
              Icon={ImagePlus}
              title="Images Upload"
              subtitle="Upload high-quality photos — interiors, products, ambiance."
            >
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFiles(e.dataTransfer.files);
                }}
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center cursor-pointer transition-all",
                  dragOver
                    ? "border-[#EBBD00] bg-[#EBBD00]/5"
                    : "border-border bg-muted/30 hover:border-[#002E50]/30 hover:bg-muted/50"
                )}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#002E50]/5 text-[#002E50] mb-4">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-[#002E50]">
                  Drag and drop images here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 10MB each • Up to 12 images
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#002E50] text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Booking / Link */}
            <SectionCard
              index="05"
              Icon={Link2}
              title="Booking / External Link"
              subtitle='Used for the "Book Now" or "Visit Website" button on your listing.'
            >
              <Field
                label="Booking or Website URL"
                hint="Use a direct reservation link if available, otherwise your homepage."
              >
                <Input
                  type="url"
                  placeholder="https://yourbusiness.com/book"
                  className="rounded-xl h-11"
                />
              </Field>
            </SectionCard>

            {/* Package */}
            <SectionCard
              index="06"
              Icon={Package}
              title="Select Your Listing Package"
              subtitle="Choose the plan that best fits your goals."
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packages.map((p) => {
                  const selected = selectedPackage === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPackage(p.id)}
                      className={cn(
                        "relative text-left rounded-2xl border-2 p-5 transition-all",
                        selected
                          ? "border-[#EBBD00] bg-[#EBBD00]/5 shadow-md"
                          : "border-border bg-card hover:border-[#002E50]/30"
                      )}
                    >
                      {selected && (
                        <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#EBBD00] text-[#002E50]">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                      )}
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl mb-3",
                          selected
                            ? "bg-[#002E50] text-[#EBBD00]"
                            : "bg-[#002E50]/5 text-[#002E50]"
                        )}
                      >
                        <p.Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-[#002E50]">{p.name}</h3>
                      <p className="text-lg font-semibold text-[#002E50] mt-1">
                        {p.price}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {p.desc}
                      </p>
                      <ul className="mt-4 space-y-1.5">
                        {p.perks.map((perk) => (
                          <li
                            key={perk}
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                          >
                            <Check className="h-3.5 w-3.5 text-[#EBBD00]" />
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            {/* Actions */}
            <div className="sticky bottom-4 z-10">
              <div className="rounded-2xl border border-border bg-card/95 backdrop-blur p-4 sm:p-5 shadow-lg flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-[#002E50] hover:bg-[#002E50]/5"
                >
                  Save & Continue Later
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="group w-full sm:w-auto"
                >
                  Continue to Package
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              By submitting, you agree to Marco Passport's listing terms and
              review process.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
