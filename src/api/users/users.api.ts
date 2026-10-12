import client from "../client";
import { USER_ENDPOINTS } from "../endpoints";

// Runs in the background on every page, so an expired token just signs the user out quietly.
export const UserProfileApi = () =>
  client.get(USER_ENDPOINTS.PROFILE, { skipGlobalError: true, skipLoginPopup: true })
export const UpdateUserProfileApi = (payload: Record<string, unknown>) => client.post(USER_ENDPOINTS.PROFILE, payload)
