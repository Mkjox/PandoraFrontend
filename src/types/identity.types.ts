export interface IdentityItem {
    id: string;
    UserId: string;
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    notes?: string;
}

export interface IdentityPayload {
    UserId: string;
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    notes?: string;
}

export type IdentityUpdatePayload = Partial<IdentityPayload>;