"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogIn, Pencil, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { AddRatingApi, DeleteRatingApi, UpdateRatingApi } from "@/api/users/rating.api";
import type { ApiReview } from "@/components/explore/ReviewsList";
import { useAuth } from "@/hooks/useAuth";
import { requestLogin } from "@/lib/login-popup";

type WriteReviewCardProps = {
  id: string;
  /** The signed-in visitor's existing review of this place, if any */
  review?: ApiReview;
  /** Called after a review is posted, edited or deleted, to reload the list */
  onChange?: () => void;
};

/**
 * The visitor's side of the reviews: a prompt to log in, a form for a first
 * review, or their own review with Edit and Delete (one review per person).
 */
export default function WriteReviewCard({ id, review, onChange }: WriteReviewCardProps) {
  const { isAuthenticated, ready } = useAuth();
  const [editing, setEditing] = useState(false);

  if (ready && !isAuthenticated) {
    return (
      <div className="rounded-card border border-border bg-card p-7 shadow-soft">
        <p className="eyebrow text-gold">
          Share your experience
        </p>
        <h3 className="font-display text-2xl font-semibold mt-2">Write a review</h3>
        <p className="mt-2 text-sm text-muted-foreground">Log in to rate this place and leave a review.</p>
        <Button variant="gold" size="lg" className="mt-5 w-full" onClick={() => void requestLogin()}>
          <LogIn className="h-4 w-4" /> Log in to review
        </Button>
      </div>
    );
  }

  if (review && !editing) {
    return (
      <YourReview
        placeId={id}
        review={review}
        onEdit={() => setEditing(true)}
        onDeleted={() => onChange?.()}
      />
    );
  }

  return (
    <ReviewForm
      key={review?.id ?? "new"}
      placeId={id}
      review={review}
      onCancel={review ? () => setEditing(false) : undefined}
      onSaved={() => {
        setEditing(false);
        onChange?.();
      }}
    />
  );
}

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden
          className={cn("h-4 w-4", value >= star ? "fill-gold text-gold" : "text-muted-foreground/40")}
        />
      ))}
    </div>
  );
}

function YourReview({
  placeId,
  review,
  onEdit,
  onDeleted,
}: {
  placeId: string;
  review: ApiReview;
  onEdit: () => void;
  onDeleted: () => void;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    if (review.id == null) return;
    setDeleting(true);
    try {
      await DeleteRatingApi(placeId, review.id);
      toast.success("Review deleted");
      onDeleted();
      router.refresh();
    } catch {
      // The error popup is shown by the global API error handler.
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-card border border-border bg-card p-7 shadow-soft">
      <p className="eyebrow text-gold">
        Your review
      </p>
      <Stars value={Number(review.rating) || 0} className="mt-3" />
      {review.comment && (
        <p className="mt-3 text-sm text-foreground/85 leading-relaxed">{review.comment}</p>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" /> Edit review
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(true)} disabled={deleting}>
          <Trash2 className="h-3.5 w-3.5" /> {deleting ? "Deleting…" : "Delete"}
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your review?</AlertDialogTitle>
            <AlertDialogDescription>
              Your rating and comment will be removed from this page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false);
                void remove();
              }}
            >
              Delete review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ReviewForm({
  placeId,
  review,
  onSaved,
  onCancel,
}: {
  placeId: string;
  /** Set when editing an existing review */
  review?: ApiReview;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const editing = review?.id != null;
  const [rating, setRating] = useState(review ? Number(review.rating) || 0 : 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(review?.comment ?? "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a short review");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { rating, comment: comment.trim() };
      if (editing) {
        await UpdateRatingApi(placeId, review.id!, payload);
        toast.success("Review updated");
      } else {
        await AddRatingApi(placeId, payload);
        toast.success("Thanks for your review!");
      }
      onSaved();
      // The average rating shown at the top of the page comes from the server.
      router.refresh();
    } catch (error) {
      // The error popup is shown by the global API error handler. A 400 on a
      // new review means they've already posted one (say, in another tab):
      // reload the list so it shows up as theirs, ready to edit.
      const status = (error as { response?: { status?: number } } | null)?.response?.status;
      if (!editing && status === 400) onSaved();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-card border border-border bg-card p-7 shadow-soft">
      <p className="eyebrow text-gold">
        {editing ? "Your review" : "Share your experience"}
      </p>
      <h3 className="font-display text-2xl font-semibold mt-2">
        {editing ? "Edit your review" : "Write a review"}
      </h3>

      <div className="mt-5 space-y-1.5">
        <Label className="text-sm font-medium text-primary">Your rating</Label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
              aria-pressed={rating === value}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  (hoverRating || rating) >= value
                    ? "fill-gold text-gold"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <Label className="text-sm font-medium text-primary">Your review</Label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell other travelers what stood out about your visit..."
          className="rounded-tile min-h-[110px]"
        />
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button
          variant="gold"
          size="lg"
          className="w-full sm:flex-1"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Saving..." : editing ? "Save changes" : "Submit review"}
        </Button>
        {onCancel && (
          <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
