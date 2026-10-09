"use client";

import { useCallback, useEffect, useState } from "react";
import { getPlaces } from "@/services/placesService";
import type { Place } from "@/utils/normalizePlace";

type State =
  | { status: "loading"; places: Place[] }
  | { status: "error"; places: Place[] }
  | { status: "ready"; places: Place[] };

export function usePlaces() {
  const [state, setState] = useState<State>({ status: "loading", places: [] });

  const fetchPlaces = useCallback(() => {
    getPlaces()
      .then((places) => setState({ status: "ready", places }))
      .catch(() => setState({ status: "error", places: [] }));
  }, []);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const retry = useCallback(() => {
    setState({ status: "loading", places: [] });
    fetchPlaces();
  }, [fetchPlaces]);

  return {
    places: state.places,
    loading: state.status === "loading",
    error: state.status === "error",
    retry,
  };
}
