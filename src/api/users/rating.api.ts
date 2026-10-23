import client from "../client";
import { Rating } from "../endpoints";

export interface ReviewPayload {
    rating: number;
    comment: string;
}

export const AddRatingApi = (id: number | string, payload: ReviewPayload) =>
    client.post(Rating.ADD_TO_RATING(id), payload);

export const GetReviewsApi = (id: number | string) =>
    client.get(Rating.GET_ALL_RATING(id));

/** Only the review's author can edit or delete it. */
export const UpdateRatingApi = (id: number | string, reviewId: number | string, payload: ReviewPayload) =>
    client.put(Rating.REVIEW(id, reviewId), payload);

export const DeleteRatingApi = (id: number | string, reviewId: number | string) =>
    client.delete(Rating.REVIEW(id, reviewId));
