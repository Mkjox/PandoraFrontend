export interface PersonalVaultPayload {
  id: string;
  UserId: string;
  secureTitle: string;
  secureContent: string;
  // Url: string;
  // MediaFile: string;
  Summary: string;
  Tags: string[];
  IsLocked: boolean;
  UnlockDate?: string; // ISO format
  CategoryId: string;
  ExpirationDate?: string;
  IsShareable: boolean;
  IsFavorite: boolean;
}

export interface PersonalVaultUpdatePayload extends Partial<PersonalVaultPayload> { }