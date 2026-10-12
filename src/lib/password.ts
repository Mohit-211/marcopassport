/**
 * Same rules the backend enforces on register, reset and change password:
 * at least 8 characters, at least 2 digits, no spaces, at most 72 bytes.
 * Returns the first problem found, or undefined when the password is valid.
 */
export function passwordProblem(password: string): string | undefined {
  if (!password) return "Password is required";
  if (password.length < 8) return "Use at least 8 characters";
  if ((password.match(/\d/g) ?? []).length < 2) return "Include at least 2 numbers";
  if (/\s/.test(password)) return "Spaces aren't allowed";
  if (new TextEncoder().encode(password).length > 72) return "Password is too long";
  return undefined;
}

export const PASSWORD_HINT = "At least 8 characters with 2 numbers, no spaces.";
