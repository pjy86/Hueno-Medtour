/** Policy for new passwords (change-password + ops script). Existing logins are not blocked if shorter. */

export const MIN_ADMIN_PASSWORD_LENGTH = 12

export const BCRYPT_SALT_ROUNDS = 12

export function validateNewAdminPassword(password: string): string | null {
  if (!password || password.length < MIN_ADMIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_ADMIN_PASSWORD_LENGTH} characters`
  }
  return null
}
