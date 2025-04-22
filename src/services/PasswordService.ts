import { AppDispatch } from '../redux/store/index';
import api from '../services/api';
import {
  fetchPasswordsStart,
  fetchPasswordsSuccess,
  fetchPasswordsFailure,
  addPassword,
  updatePassword as updatePasswordAction,
  deletePassword as deletePasswordAction
} from '../redux/store/slices/passwordSlice';

import {
  PasswordItem,
  PasswordPayload,
  PasswordUpdatePayload
} from '../types/password.types';

export const getPasswordsByUser = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchPasswordsStart());
    const response = await api.get<PasswordItem[]>(`/passwordvaults`);
    dispatch(fetchPasswordsSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchPasswordsFailure(error.response?.data?.message || 'Failed to fetch passwords'));
  }
};

export const getPasswordById = async (id: string): Promise<PasswordItem | null> => {
  try {
    const response = await api.get<PasswordItem>(`/passwordvaults/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch password:', error);
    return null;
  }
};

export const createPassword = (payload: PasswordPayload) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.post<PasswordItem>(`/passwordvaults`, payload);
    dispatch(addPassword(response.data));
  } catch (error: any) {
    console.error('Failed to create password:', error.response?.data?.message || error.message);
  }
};

export const updatePassword = (id: string, payload: PasswordUpdatePayload) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.put<PasswordItem>(`/passwordvaults/${id}`, payload);
    dispatch(updatePasswordAction(response.data));
  } catch (error: any) {
    console.error('Failed to update password:', error.response?.data?.message || error.message);
  }
};

export const deletePassword = (id: string) => async (dispatch: AppDispatch) => {
  try {
    await api.delete(`/passwordvaults/${id}`);
    dispatch(deletePasswordAction(id));
  } catch (error: any) {
    console.error('Failed to delete password:', error.response?.data?.message || error.message);
  }
};
