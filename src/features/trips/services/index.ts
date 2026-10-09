import { TRIPS_API_ENABLED } from "@/api/endpoints";
import { createApiTripService } from "./api-trip-service";
import { createLocalTripService } from "./local-trip-service";
import type { TripService } from "./trip-service";

export type TripScope = "guest" | "account";

export function getTripService(scope: TripScope): TripService {
  if (scope === "account" && TRIPS_API_ENABLED) return createApiTripService();
  return createLocalTripService(scope);
}

export { createLocalTripService } from "./local-trip-service";
export type { TripService } from "./trip-service";
