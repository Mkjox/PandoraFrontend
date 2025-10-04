export interface PersonalVaultPayload {
  id: string;
  userId: string;
  secureTitle: string;
  secureContent: string;
  secureSummary: string;
  IsLocked: boolean;
  unlockDate?: string; // ISO format
  IsShareable: boolean;
  shareToken?: string;
  sharedAt?: string; // ISO FORMAT
  shareViewCount?: string;
  createdDate: string; // ISO FORMAT
  lastModifiedDate?: string; // ISO FORMAT
  expirationDate?: string; // ISO FORMAT
  secureTags: string[];
  IsFavorite: boolean;
  categoryId: string;
  categoryName: string;
}

export interface PersonalVaultAddPayload {
  userId: string;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  isLocked: boolean;
  unlockDate?: string;
  isShareable: boolean;
  categoryId: string;
  expirationDate?: string;
  isFavorite: boolean;
}

export interface PersonalVaultUpdatePayload extends Partial<PersonalVaultPayload> { }