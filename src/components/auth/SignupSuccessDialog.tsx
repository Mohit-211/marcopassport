"use client";

import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SignupSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export function SignupSuccessDialog({
  open,
  onOpenChange,
  onContinue,
}: SignupSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="text-center">
        <DialogHeader className="items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-gold">
            <PartyPopper className="h-6 w-6" />
          </span>
          <DialogTitle className="text-xl">Account created</DialogTitle>
          <DialogDescription>
            Welcome to The Marco Passport! Your account is ready — start saving
            places and planning your visits.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button
            variant="gold"
            size="lg"
            className="w-full sm:w-auto"
            onClick={onContinue}
          >
            Continue to Passport
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
