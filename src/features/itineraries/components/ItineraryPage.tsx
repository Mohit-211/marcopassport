"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  LogIn,
  MapPin,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteItineraryApi,
  getItineraryApi,
  updateItineraryApi,
} from "@/api/users/itineraries.api";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroMeta, PageHero } from "@/components/site/PageHero";
import { isAuthError } from "@/errors/apiError";
import { requestLogin } from "@/lib/login-popup";
import { draftProblem, sameDraft, toDraft, toPayload } from "../logic";
import { useItineraries } from "../ItinerariesProvider";
import type { ItineraryDraft } from "../types";
import { ItineraryEditor } from "./ItineraryEditor";
import { formatDateRange } from "../format";
import { ConfirmDialog, passportShell } from "./PassportPage";

type Load =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "error" }
  | { status: "ready"; saved: ItineraryDraft };

function statusOf(error: unknown) {
  return (error as { response?: { status?: number } })?.response?.status;
}

/**
 * /passport/:id — one saved itinerary. Edits stay in local state and Save
 * sends the whole list (PUT replaces items in the order given). If the session
 * expired meanwhile, the login popup opens over the page, the edits stay, and
 * the save is retried after login.
 */
export function ItineraryPage({ id }: { id: string }) {
  const router = useRouter();
  const { ready, isAuthenticated, upsertItinerary, removeItinerary } =
    useItineraries();
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [value, setValue] = useState<ItineraryDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loadKey, setLoadKey] = useState(0);

  const loaded = load.status === "ready";
  const dirty = loaded && value !== null && !sameDraft(load.saved, value);

  // Load once signed in. Once loaded, the editor stays mounted even if the
  // session expires, so unsaved edits survive the login popup.
  useEffect(() => {
    if (!ready || !isAuthenticated || loaded) return;
    let cancelled = false;
    getItineraryApi(id)
      .then((itinerary) => {
        if (cancelled) return;
        const draft = toDraft(itinerary);
        setLoad({ status: "ready", saved: draft });
        setValue(draft);
      })
      .catch((error) => {
        if (cancelled || isAuthError(error)) return;
        setLoad({ status: statusOf(error) === 404 ? "missing" : "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [id, ready, isAuthenticated, loaded, loadKey]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const save = async (): Promise<void> => {
    if (!value) return;
    const problem = draftProblem(value);
    if (problem) {
      toast.error(problem);
      return;
    }
    setSaving(true);
    try {
      const itinerary = await updateItineraryApi(id, toPayload(value));
      const draft = toDraft(itinerary);
      setLoad({ status: "ready", saved: draft });
      setValue(draft);
      upsertItinerary(itinerary);
      toast.success("Itinerary saved");
    } catch (error) {
      // Session expired: the popup is already open; retry once they're back in.
      if (isAuthError(error) && (await requestLogin())) {
        setSaving(false);
        return save();
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await deleteItineraryApi(id);
      removeItinerary(Number(id));
      toast.success("Itinerary deleted");
      router.push("/passport");
    } catch {
      // Shown by the global error popup.
    }
  };

  return (
    <>
      <PageHero
        size="compact"
        image="/assets/place-sunset.jpg"
        imageAlt="Sunset over a Marco Island pier"
        icon={Sparkles}
        eyebrow="My Passport"
        title={
          loaded && value ? value.name || "Untitled itinerary" : "Itinerary"
        }
      >
        {loaded && value ? (
          <HeroMeta
            items={[
              formatDateRange(value.start_date, value.end_date),
              `${value.items.length} ${value.items.length === 1 ? "place" : "places"}`,
              ...(dirty
                ? [
                    <span key="dirty" className="text-gold">
                      Unsaved changes
                    </span>,
                  ]
                : []),
            ]}
          />
        ) : null}
      </PageHero>
      <section className={passportShell}>
        <div className="site-container">
          <Link
            href="/passport"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> All itineraries
          </Link>

          {loaded && value ? (
            <>
              <ItineraryEditor
                value={value}
                onChange={setValue}
                actions={
                  <>
                    <Button
                      variant="gold"
                      size="lg"
                      onClick={save}
                      disabled={!dirty || saving}
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {saving ? "Saving…" : "Save changes"}
                    </Button>
                    {dirty && (
                      <Tooltip content="Undo your edits and go back to the last saved version">
                        <Button
                          variant="ghost"
                          onClick={() => setValue(load.saved)}
                          disabled={saving}
                        >
                          Discard changes
                        </Button>
                      </Tooltip>
                    )}
                    <Button
                      variant="ghost"
                      className="ml-auto text-muted-foreground hover:text-destructive"
                      onClick={() => setConfirmDelete(true)}
                      disabled={saving}
                    >
                      <Trash2 className="h-4 w-4" /> Delete itinerary
                    </Button>
                  </>
                }
              />
              <ConfirmDialog
                open={confirmDelete}
                onOpenChange={setConfirmDelete}
                title="Delete this itinerary?"
                description={`"${load.saved.name}" and its places will be removed from your account. This can't be undone.`}
                confirmLabel="Delete"
                onConfirm={remove}
              />
            </>
          ) : ready && !isAuthenticated ? (
            <Message
              title="Log in to see this itinerary"
              text="Itineraries are saved to your account."
              action={
                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => void requestLogin()}
                >
                  <LogIn className="h-4 w-4" /> Log in
                </Button>
              }
            />
          ) : load.status === "missing" ? (
            <Message
              title="Itinerary not found"
              text="It may have been deleted, or it belongs to another account."
              action={
                <Link href="/passport">
                  <Button variant="gold" size="lg">
                    Back to My Passport
                  </Button>
                </Link>
              }
            />
          ) : load.status === "error" ? (
            <Message
              title="We couldn't load this itinerary"
              text="Please check your connection and try again."
              action={
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setLoad({ status: "loading" });
                    setLoadKey((k) => k + 1);
                  }}
                >
                  Try again
                </Button>
              }
            />
          ) : (
            <EditorSkeleton />
          )}
        </div>
      </section>
    </>
  );
}

function Message({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-card p-10 text-center shadow-sm">
      <MapPin className="mx-auto h-8 w-8 text-gold" />
      <h1 className="mt-4 font-display text-3xl font-semibold text-primary">
        {title}
      </h1>
      <p className="mt-2 text-muted-foreground">{text}</p>
      <div className="mt-6 flex justify-center">{action}</div>
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
      aria-busy="true"
      aria-label="Loading itinerary"
    >
      <div className="space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-36 rounded-3xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-[420px] rounded-3xl" />
    </div>
  );
}
