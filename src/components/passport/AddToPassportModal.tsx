"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PassportItem } from "@/components/passport/PassportItemCard";

interface AddToPassportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: {
    refId: string;
    name: string;
    category: string;
    image: string;
    location?: string;
  };
  existing?: PassportItem | null;
}

export function AddToPassportModal({
  open,
  onOpenChange,
  source,
  existing,
}: AddToPassportModalProps) {
  const [date, setDate] = useState(existing?.date ?? "");
  const [time, setTime] = useState(existing?.time ?? "");

  const handleSave = () => {
    // TODO: wire up to real store once one exists — for now this is a
    // static UI-only bypass so the flow can be tried end to end.
    toast.success(
      existing ? "Passport entry updated" : "Added to your Passport",
      {
        description: date
          ? `${source.name} · ${date}${time ? ` at ${time}` : ""}`
          : source.name,
      }
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-[#002E50]">
            {existing ? "Edit Passport entry" : "Add to your Passport"}
          </DialogTitle>
          <DialogDescription>
            Pick a date and time to help plan your visit.
          </DialogDescription>
        </DialogHeader>

        {/* Place preview */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
            <img
              src={source.image}
              alt={source.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-[#EBBD00] font-semibold">
              {source.category}
            </p>
            <p className="font-display font-semibold text-[#002E50] truncate">
              {source.name}
            </p>
            {source.location && (
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {source.location}
              </p>
            )}
          </div>
        </div>

        {/* Date & time */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-primary flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5" /> Date
            </Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-primary flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Time
            </Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="gold" onClick={handleSave}>
            {existing ? "Save changes" : "Add to Passport"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
