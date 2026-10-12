import client from "../client";
import { AUTH_ENDPOINTS } from "../endpoints";

/** Login and verify-email both return this. */
export interface AuthSession {
  id: number;
  name: string;
  email: string;
  role_id: number;
  tokens: { access: { token: string; expires: string } };
}

// These screens show the backend message inline, so the global error toast is skipped.
const inline = { skipGlobalError: true };

export const loginApi = (payload: { email: string; password: string }) =>
  client.post(AUTH_ENDPOINTS.LOGIN, payload, inline);
export const registerApi = (payload: {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}) => client.post(AUTH_ENDPOINTS.REGISTER, payload, inline);
export const logoutApi = () => client.get(AUTH_ENDPOINTS.LOGOUT);

// Email verification
export const verifyEmailApi = (token: string) =>
  client.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token }, inline);
export const resendVerificationApi = (email: string) =>
  client.post(AUTH_ENDPOINTS.RESEND_VERIFICATION, { email }, inline);

// Password
export const forgotPasswordApi = (email: string) =>
  client.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email }, inline);
export const resetPasswordApi = (payload: { token: string; password: string; confirm_password: string }) =>
  client.post(AUTH_ENDPOINTS.RESET_PASSWORD, payload, inline);
export const changePasswordApi = (payload: { old_password: string; new_password: string; confirm_password: string }) =>
  client.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, payload, inline);
