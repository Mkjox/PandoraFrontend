export function isStrongPassword(pw: string): boolean {
  if (!pw) return false;
  // Example criteria: length >= 8, has uppercase, lowercase, digit, special
  if (pw.length < 8) return false;
  if (!/[A-Z]/.test(pw)) return false;
  if (!/[a-z]/.test(pw)) return false;
  if (!/[0-9]/.test(pw)) return false;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw)) return false;
  return true;
}