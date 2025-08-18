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
  expirationDate?: string;
  secureTags: string[];
  IsFavorite: boolean;
  categoryId: string;
  categoryName: string;
}

export interface PersonalVaultUpdatePayload extends Partial<PersonalVaultPayload> { }