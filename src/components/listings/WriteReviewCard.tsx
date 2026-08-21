"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AddRatingApi } from "@/api/users/rating.api";

type WriteReviewCardProps = {
  id: string;
  onSuccess?: () => void;
};

export default function WriteReviewCard({ id, onSuccess }: WriteReviewCardProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      await AddRatingApi(id, { rating, comment: comment.trim() });
      setSubmitted(true);
      toast.success("Thanks for your review!");
      onSuccess?.();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-border bg-card p-7 shadow-soft text-center">
        <p className="font-display text-xl font-semibold text-primary">
          Review submitted
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Thanks for sharing your experience.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
      <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
        Share your experience
      </p>
      <h3 className="font-display text-2xl font-semibold mt-2">
        Write a review
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
          className="rounded-xl min-h-[110px]"
        />
      </div>

      <Button
        variant="gold"
        size="lg"
        className="w-full mt-5"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit review"}
      </Button>
    </div>
  );
}
