export interface PersonalVaultPayload {
  UserId: string;
  Title: string;
  Content: string;
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