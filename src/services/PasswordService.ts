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
  PasswordUpdatePayload,
  RawPassword
} from '../types/password.types';
import { ServiceResult } from '../types/service.types';

function mapRaw(raw: RawPassword): PasswordItem {
  return {
    id: raw.id,
    UserId: raw.userId,
    SiteName: raw.secureSiteName,
    UsernameOrEmail: raw.secureUsernameOrEmail,
    Password: raw.password,
    Notes: raw.secureNotes,
    PasswordExpirationDate: raw.passwordExpirationDate,
    CategoryId: raw.categoryId,
  };
}

const PasswordService = {
  getPasswordsByUser: () => async (dispatch: AppDispatch) => {
    dispatch(fetchPasswordsStart());
    try {
      const resp = await api.get<RawPassword[]>("/passwordvaults");
      const data = resp.data.map(mapRaw);
      dispatch(fetchPasswordsSuccess(data));
      return { success: true, data };
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch passwords";
      dispatch(fetchPasswordsFailure(msg));
      return { success: false, message: msg };
    }
  },

  getPasswordById: async (id: string): Promise<ServiceResult<PasswordItem>> => {
    try {
      const resp = await api.get<RawPassword>(`/passwordvaults/${id}`);
      return { success: true, data: mapRaw(resp.data) };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to fetch password",
      };
    }
  },

  createPassword: (payload: PasswordPayload) => async (dispatch: AppDispatch) => {
    try {
      const resp = await api.post<RawPassword>("/passwordvaults", payload);
      const item = mapRaw(resp.data);
      dispatch(addPassword(item));
      // re-fetching the list
      dispatch(PasswordService.getPasswordsByUser() as any);
      return { success: true, data: item };
    } catch (err: any) {
      console.error("Failed to create password:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create password",
      };
    }
  },

  updatePassword: (id: string, payload: PasswordUpdatePayload) => async (dispatch: AppDispatch) => {
    try {
      const resp = await api.put<RawPassword>(`/passwordvaults/${id}`, payload);
      const item = mapRaw(resp.data);
      dispatch(updatePasswordAction(item));
      dispatch(PasswordService.getPasswordsByUser() as any);
      return { success: true, data: item };
    } catch (err: any) {
      console.error("Failed to update password:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update password",
      };
    }
  },

  deletePassword: (id: string) => async (dispatch: AppDispatch) => {
    try {
      await api.delete(`/passwordvaults/${id}`);
      dispatch(deletePasswordAction(id));
      dispatch(PasswordService.getPasswordsByUser() as any);
      return { success: true };
    } catch (err: any) {
      console.error("Failed to delete password:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete password",
      };
    }
  },
};

export default PasswordService;