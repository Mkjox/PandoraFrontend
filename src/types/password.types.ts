{/* For Getting Passwords */ }
export interface PasswordItem {
    // id: string;
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
    PasswordExpirationDate: string;
    CategoryId: string;
}

export type PasswordUpdatePayload = Partial<PasswordPayload>;