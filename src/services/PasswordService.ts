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
import { ServiceResult } from '../types/service.types';

const PasswordService = {
  getPasswordsByUser: () => async (dispatch: AppDispatch): Promise<ServiceResult<PasswordItem[]>> => {
    dispatch(fetchPasswordsStart());
    try {
      const response = await api.get<PasswordItem[]>(`/passwordvaults`);
      dispatch(fetchPasswordsSuccess(response.data));
      return {
        success: true,
        data: response.data
      };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to fetch passwords';
      dispatch(fetchPasswordsFailure(msg));
      return {
        success: false,
        message: msg
      };
    }
  },

  getPasswordById: async (id: string): Promise<ServiceResult<PasswordItem>> => {
    try {
      const response = await api.get<PasswordItem>(`/passwordvaults/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (err: any) {
      console.error('Failed to fetch password:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to fetch password'
      };
    }
  },

  createPassword: (payload: PasswordPayload) => async (dispatch: AppDispatch): Promise<ServiceResult<PasswordItem>> => {
    try {
      const response = await api.post<PasswordItem>(`/passwordvaults`, payload);
      dispatch(addPassword(response.data));

      // re-fetching the list
      dispatch<any>(PasswordService.getPasswordsByUser());
      return {
        success: true,
        data: response.data
      };
    } catch (err: any) {
      console.error('Failed to create password:', err.response?.data?.message || err.message);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to create password'
      };
    }
  },

  updatePassword: (id: string, payload: PasswordUpdatePayload) => async (dispatch: AppDispatch): Promise<ServiceResult<PasswordItem>> => {
    try {
      const response = await api.put<PasswordItem>(`/passwordvaults/${id}`, payload);
      dispatch(updatePasswordAction(response.data));

      // re-fetching the list
      dispatch<any>(PasswordService.getPasswordsByUser());

      return {
        success: true,
        data: response.data
      };
    } catch (err: any) {
      console.error('Failed to update password:', err.response?.data?.message || err.message);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update password'
      };
    }
  },

  deletePassword: (id: string) => async (dispatch: AppDispatch): Promise<ServiceResult<null>> => {
    try {
      await api.delete(`/passwordvaults/${id}`);
      dispatch(deletePasswordAction(id));
      return {
        success: true
      }
    } catch (err: any) {
      console.error('Failed to delete password:', err.response?.data?.message || err.message);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to delete password'
      }
    }
  },
}

export default PasswordService;