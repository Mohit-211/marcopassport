import { toast } from "sonner";

/**
 * Shares a page: the device's share sheet where there is one (phones, some
 * desktops), otherwise the link is copied to the clipboard.
 */
export async function shareLink({ title, text, url }: { title: string; text?: string; url: string }) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
    } catch {
      // Dismissed.
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  } catch {
    toast.error("Couldn't copy the link. You can copy it from the address bar.");
  }
}
