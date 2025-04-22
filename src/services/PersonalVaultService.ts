import { AppDispatch } from "../redux/store";
import api from "./api";
import AuthService from "./AuthService";
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

interface VaultItem extends PersonalVaultPayload {
  id: string;
}

api.interceptors.request.use(async (config) => {
  const token = await AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPersonalVaults = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchVaultsStart());
    const response = await api.get<VaultItem[]>('/vaults');
    dispatch(fetchVaultsSuccess(response.data));
  }
  catch (error: any) {
    dispatch(fetchVaultsFailure(error.response?.data?.message || 'Failed to fetch vaults'));
  }
};

export const getVaultsById = async (vaultId: string): Promise<VaultItem | null> => {
  try {
    const response = await api.get<VaultItem>(`/vaults/${vaultId}`);
    return response.data;
  }
  catch (error: any) {
    console.error('Failed to fetch vault:', error);
    return null;
  }
};

export const createVault = (payload: PersonalVaultPayload) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.post<VaultItem>('/vaults', payload);
    dispatch(addVault(response.data));
  }
  catch (error: any) {
    console.error('Failed to create vault:', error.response?.data?.message || error.message);
  }
};

export const updateVault = (vaultId: string, payload: PersonalVaultUpdatePayload) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.put<VaultItem>(`/vaults/${vaultId}`, payload);
    dispatch(updateVaultAction(response.data));
  }
  catch (error: any) {
    console.error('Failed to update vault:', error.response?.data?.message || error.message);
  }
};

export const removeVault = (vaultId: string) => async (dispatch: AppDispatch) => {
  try {
    await api.delete(`/vaults/${vaultId}`);
    dispatch(deleteVault(vaultId));
  }
  catch (error: any) {
    console.error('Failed to delete vault:', error.response?.data?.message || error.message);
  }
};