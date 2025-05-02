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

  updateVault: (vaultId: string, payload: PersonalVaultUpdatePayload) => async (dispatch: AppDispatch): Promise<ServiceResult<VaultItem>> => {
    try {
      const response = await api.put<VaultItem>(`/personalvaults/${vaultId}`, payload);
      dispatch(updateVaultAction(response.data));

      // re-fetching the list
      dispatch<any>(PersonalVaultService.getPersonalVaults());
      return {
        success: true,
        data: response.data
      };
    }
    catch (err: any) {
      console.error('Failed to update vault:', err.response?.data?.message || err.message);
      return {
        success: false,
        data: err.response?.data?.message || 'Failed to update personal vault',
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