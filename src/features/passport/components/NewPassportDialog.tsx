"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_PASSPORT_NAME } from "../types";

/** Names a new passport. Dates and places are set on the passport page. */
export function NewPassportDialog({
  open,
  onOpenChange,
  placeName,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Shown as "… will be added" when creating from an Add to passport button */
  placeName?: string;
  /** Resolves true once created, which closes the dialog */
  onCreate: (name: string) => Promise<boolean>;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        {open && (
          <NameForm
            placeName={placeName}
            onCancel={() => onOpenChange(false)}
            onCreate={onCreate}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function NameForm({
  placeName,
  onCancel,
  onCreate,
}: {
  placeName?: string;
  onCancel: () => void;
  onCreate: (name: string) => Promise<boolean>;
}) {
  const [name, setName] = useState(DEFAULT_PASSPORT_NAME);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (await onCreate(name.trim() || DEFAULT_PASSPORT_NAME)) onCancel();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <DialogHeader>
        <DialogTitle className="font-display text-2xl text-primary">
          New passport
        </DialogTitle>
        <DialogDescription>
          {placeName
            ? `${placeName} will be its first stop. You can add dates and more places later.`
            : "Give it a name. You can add dates and places next."}
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4 space-y-1.5">
        <Label
          htmlFor="new-passport-name"
          className="text-sm font-medium text-primary"
        >
          Name
        </Label>
        <Input
          id="new-passport-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={(e) => e.target.select()}
          maxLength={150}
          autoFocus
          className="rounded-tile"
        />
      </div>
      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="gold" disabled={saving}>
          {saving ? "Creating…" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  );
}
