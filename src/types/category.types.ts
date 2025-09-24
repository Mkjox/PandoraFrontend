export interface CategoryBase {
  name: string;
  description?: string;
}

export interface CreateCategoryPayload extends CategoryBase {
  userId: string;
}

export interface UpdateCategoryPayload {
  id: string;
  name: string;
  description?: string;
}

export interface Category extends CategoryBase {
  id: string;
  userId: string;
}