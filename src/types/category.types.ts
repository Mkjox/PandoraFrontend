export interface CategoryPayload {
    UserId: string;
    name: string;
    description?: string;
}

export interface Category extends CategoryPayload {
    id: string;
    userId: string;
}