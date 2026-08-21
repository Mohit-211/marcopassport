import { Star, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type ApiReview = {
  id?: number | string;
  rating: number;
  comment: string;
  user_name?: string;
  user?: { name?: string };
  created_at?: string;
};

function formatDate(value?: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ReviewsList({ reviews }: { reviews: ApiReview[] }) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border p-7 text-center text-sm text-muted-foreground">
        No reviews yet — be the first to share your experience.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, i) => {
        const name = review.user_name || review.user?.name || "Guest";
        return (
          <div
            key={review.id ?? i}
            className="rounded-3xl border border-border bg-card p-6 shadow-soft"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center h-9 w-9 rounded-full bg-sand text-primary shrink-0">
                  <User className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-foreground text-sm">{name}</p>
                  {review.created_at && (
                    <p className="text-xs text-muted-foreground">
                      {formatDate(review.created_at)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={cn(
                      "h-3.5 w-3.5",
                      review.rating >= value
                        ? "fill-gold text-gold"
                        : "text-muted-foreground/40"
                    )}
                  />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-foreground/85 leading-relaxed">
              {review.comment}
            </p>
          </div>
        );
      })}
    </div>
  );
}
