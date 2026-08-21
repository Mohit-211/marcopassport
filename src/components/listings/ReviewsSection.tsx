"use client";

import { useCallback, useEffect, useState } from "react";
import { GetReviewsApi } from "@/api/users/rating.api";
import ReviewsList, { type ApiReview } from "@/components/listings/ReviewsList";
import WriteReviewCard from "@/components/listings/WriteReviewCard";

export default function ReviewsSection({ id }: { id: string }) {
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(() => {
    setLoading(true);
    GetReviewsApi(id)
      .then((res) => {
        const data = res?.data?.data;
        setReviews(Array.isArray(data) ? data : Array.isArray(data?.reviews) ? data.reviews : []);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
          Guest feedback
        </p>
        <h2 className="font-display text-3xl font-semibold mt-2">Reviews</h2>
        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading reviews…</p>
          ) : (
            <ReviewsList reviews={reviews} />
          )}
        </div>
      </div>

      <WriteReviewCard id={id} onSuccess={fetchReviews} />
    </div>
  );
}
