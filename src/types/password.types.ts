{/* For Getting Passwords */ }
export interface PasswordItem {
    id: string;
    UserId: string;
    SiteName: string;
    UsernameOrEmail: string;
    Password: string;
    Notes?: string;
    PasswordExpirationDate?: string;
    CategoryId: string;
}

{/* For Creating New Password */ }
export interface PasswordPayload {
    UserId: string;
    SiteName: string;
    UsernameOrEmail: string;
    Password: string;
    PasswordRepeat: string;
    Notes: string;
    PasswordExpirationDate?: string;
    CategoryId: string;
}

{/* For Getting the Secured Passwords */ }
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

export type PasswordUpdatePayload = Partial<PasswordPayload>;