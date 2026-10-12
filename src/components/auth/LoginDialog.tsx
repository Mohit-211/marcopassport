"use client";

import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AuthForm } from "@/components/auth/AuthForm";
import {
  finishLogin,
  getLoginPopupState,
  subscribeLoginPopup,
} from "@/lib/login-popup";

const closed = { open: false, message: null };

/**
 * The site-wide login popup, opened with `requestLogin()` from anywhere
 * (Save on a guest itinerary, a 401 while editing, the header menu). It sits
 * on top of the current page, so nothing the user was doing is lost.
 */
export function LoginDialog({ onLoggedIn }: { onLoggedIn: () => void | Promise<void> }) {
  const { open, message } = useSyncExternalStore(
    subscribeLoginPopup,
    getLoginPopupState,
    () => closed,
  );

  return (
    <Dialog open={open} onOpenChange={(next) => !next && finishLogin(false)}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-0 sm:max-w-[440px]">
        <DialogTitle className="sr-only">Log in or create an account</DialogTitle>
        {open && (
          <AuthForm
            variant="popup"
            message={message}
            onLeave={() => finishLogin(false)}
            onLoggedIn={async () => {
              toast.success("Welcome back");
              // Resolve waiting callers (e.g. an itinerary save retrying after a 401) first.
              finishLogin(true);
              await onLoggedIn();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
