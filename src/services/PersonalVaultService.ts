import { AppDispatch } from "../redux/store";
import api from "./api";
import {
  fetchVaultsStart,
  fetchVaultsSuccess,
  fetchVaultsFailure,
  addVault,
  deleteVault,
  updateVault as updateVaultAction
} from '../redux/store/slices/vaultSlice';
import {
  PersonalVaultPayload,
  PersonalVaultUpdatePayload
} from './../types/personalVault.types';
import { ServiceResult } from "../types/service.types";

interface VaultItem extends PersonalVaultPayload {
  id: string;
}

const PersonalVaultService = {
  getPersonalVaults: () => async (dispatch: AppDispatch): Promise<ServiceResult<VaultItem[]>> => {
    dispatch(fetchVaultsStart());
    try {
      const response = await api.get<VaultItem[]>('/personalvaults');
      dispatch(fetchVaultsSuccess(response.data));
      return {
        success: true,
        data: response.data
      };
    }
    catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch vaults';
      dispatch(fetchVaultsFailure(msg));
      return {
        success: false,
        message: msg
      }
    }
  },

  getVaultsById: async (vaultId: string): Promise<ServiceResult<VaultItem>> => {
    try {
      const response = await api.get<VaultItem>(`/personalvaults/${vaultId}`);
      return {
        success: true,
        data: response.data
      };
    }
    catch (err: any) {
      console.error('Failed to fetch vault:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to fetch vault',
      };
    }
  },

  createVault: (payload: PersonalVaultPayload) => async (dispatch: AppDispatch): Promise<ServiceResult<VaultItem>> => {
    try {
      const response = await api.post<VaultItem>('/personalvaults', payload);
      dispatch(addVault(response.data));

      // re-fetching the list
      dispatch<any>(PersonalVaultService.getPersonalVaults());
      return {
        success: true,
        data: response.data
      };
    }
    catch (err: any) {
      console.error('Failed to create vault:', err.response?.data?.message || err.message);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to create personal vault',
      };
    }
  },

  /**
   * Update vault (maps frontend keys -> backend DTO shape and wraps as { dto })
   * Backend expects: PersonalVaultUpdateDto (PascalCase fields). We send:
   * PUT /personalvaults/ { dto: { Id, Title, Content, Summary, Tags, IsLocked, UnlockDate, CategoryId, ExpirationDate, IsFavorite, LastModifiedDate } }
   */
  updateVault: (vaultId: string, payload: PersonalVaultUpdatePayload) => async (dispatch: AppDispatch): Promise<ServiceResult<VaultItem>> => {
    try {
      // Map frontend payload to backend DTO (PascalCase). Use null for missing values (backend may require presence)
      const dto: any = {
        Id: vaultId,
        Title: (payload.secureTitle ?? payload.title ?? null),
        Content: (payload.secureContent ?? payload.content ?? null),
        Summary: (payload.secureSummary ?? payload.summary ?? null),
        Tags: Array.isArray(payload.secureTags ?? payload.tags) ? (payload.secureTags ?? payload.tags) : (payload.secureTags ? payload.secureTags : (payload.tags ? payload.tags : [])),
        IsLocked: typeof payload.IsLocked !== 'undefined' ? payload.IsLocked : (typeof payload.isLocked !== 'undefined' ? payload.isLocked : false),
        UnlockDate: payload.unlockDate ?? payload.UnlockDate ?? null,
        CategoryId: payload.categoryId ?? payload.CategoryId ?? null,
        ExpirationDate: payload.expirationDate ?? payload.ExpirationDate ?? null,
        IsFavorite: typeof payload.IsFavorite !== 'undefined' ? payload.IsFavorite : (typeof payload.isFavorite !== 'undefined' ? payload.isFavorite : false),
        LastModifiedDate: new Date().toISOString()
      };

      // ensure tags is at least an empty array (backend expects array or null)
      if (!Array.isArray(dto.Tags)) dto.Tags = [];

      const response = await api.put<VaultItem>(`/personalvaults/`, dto, {
        headers: { 'Content-Type': 'application/json' }
      });

      dispatch(updateVaultAction(response.data));
      dispatch<any>(PersonalVaultService.getPersonalVaults());
      return {
        success: true,
        data: response.data
      };
    }
    catch (err: any) {
      console.error('Failed to update vault:', err.response?.data?.message || err.message || err);
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to update personal vault',
      };
    }
  },

  removeVault: (vaultId: string) => async (dispatch: AppDispatch): Promise<ServiceResult<null>> => {
    try {
      await api.delete(`/personalvaults/${vaultId}`);
      dispatch(deleteVault(vaultId));

      // re-fetching the list
      dispatch<any>(PersonalVaultService.getPersonalVaults());
      return {
        success: true
      };
    }
    catch (err: any) {
      console.error('Failed to delete vault:', err.response?.data?.message || err.message);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to delete personal vault',
      };
    }
  },
}

export default PersonalVaultService;