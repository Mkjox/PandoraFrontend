/** The raw shape returned by the API */
export interface RawPassword {
  id: string;
  userId: string;
  secureSiteName: string;
  secureUsernameOrEmail: string;
  secureNotes?: string;
  password: string;
  lastPasswordChangeDate?: string | null;
  passwordExpirationDate?: string;
  categoryId: string;
}

/** How we use passwords in the app */
export interface PasswordItem {
  id: string;
  userId: string;
  siteName: string;
  usernameOrEmail: string;
  password: string;
  notes?: string;
  lastPasswordChangeDate?: string;
  passwordExpirationDate?: string;
  categoryId: string;
}

/** Payload for creating a new password */
export interface PasswordPayload {
  siteName: string | null;
  usernameOrEmail: string | null;
  password: string | null;
  passwordRepeat: string | null;
  notes: string | null;
  categoryId: string;
}

/** Payload for updating an existing password */
export interface PasswordUpdatePayload {
  /** always include the id when updating */
  id: string;
  siteName?: string | null;
  usernameOrEmail?: string | null;
  notes?: string | null;
  /** the current password, if required by the API */
  password?: string | null;
  newPassword?: string | null;
  newPasswordRepeat?: string | null;
  categoryId?: string | null;
}