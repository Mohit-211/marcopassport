"use client";

import { useCallback, useEffect, useState } from "react";
import { GetReviewsApi } from "@/api/users/rating.api";
import ReviewsList, { type ApiReview } from "@/components/listings/ReviewsList";
import WriteReviewCard from "@/components/listings/WriteReviewCard";
import { InfoTip } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";

/** The review's author: the row's user_id, or the reviewer the API includes with it. */
const authorId = (review: ApiReview) => Number(review.user_id ?? review.reviewer?.id);

export default function ReviewsSection({ id }: { id: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(() => {
    GetReviewsApi(id)
      .then((res) => {
        const data = res?.data?.data;
        setReviews(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.reviews)
              ? data.reviews
              : [],
        );
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [id]);

  // Refetch after a review is posted, edited or deleted
  const fetchReviews = useCallback(() => {
    setLoading(true);
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // One review per person: once they have one, the form becomes "Your review".
  const myReview =
    user?.id != null ? reviews.find((review) => authorId(review) === Number(user.id)) : undefined;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
          Guest feedback
        </p>
        <h2 className="mt-2 flex items-center gap-2 font-display text-2xl font-semibold text-primary md:text-3xl">
          Reviews
          <InfoTip label="About reviews">
            Reviews come from logged-in visitors, one per person. The star
            rating shown on this page is their average.
          </InfoTip>
        </h2>
        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading reviews…</p>
          ) : (
            <ReviewsList reviews={reviews} myReviewId={myReview?.id} />
          )}
        </div>
      </div>

      <WriteReviewCard id={id} review={myReview} onChange={fetchReviews} />
    </div>
  );
}
