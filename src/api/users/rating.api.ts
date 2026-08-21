import client from "../client";
import { Rating } from "../endpoints";

export const AddRatingApi = (id: number | string, payload: { rating: number; comment: string }) =>
    client.post(Rating.ADD_TO_RATING(id), payload);

export const GetReviewsApi = (id: number | string) =>
    client.get(Rating.GET_ALL_RATING(id));