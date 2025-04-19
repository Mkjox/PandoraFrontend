import api from "./api";
import {
    PasswordItem,
    PasswordPayload,
    PasswordUpdatePayload
} from "../types/password.types";
import { ServiceResult } from "../types/service.types";

const PasswordService = {
    getPasswordsByUser: async (): Promise<ServiceResult<PasswordItem[]>> => {
        try {
            const response = await api.get<PasswordItem[]>(`/passwordvaults`);
            return {
                success: true,
                data: response.data
            };

        }
        catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch passwords',
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
        }
        catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch password',
            };
        }
    },

    createPassword: async (payload: PasswordPayload): Promise<ServiceResult<PasswordItem>> => {
        try {
            const response = await api.post<PasswordItem>(`/passwordvaults`, payload);
            return {
                success: true,
                data: response.data
            };
        }
        catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create password',
            };
        }
    },

    updatePassword: async (id: string, payload: PasswordUpdatePayload): Promise<ServiceResult<PasswordItem>> => {
        try {
            const response = await api.put<PasswordItem>(`/passwordvaults/${id}`, payload);
            return {
                success: true,
                data: response.data
            }
        }
        catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update password',
            };
        }
    },

    deletePassword: async (id: string): Promise<ServiceResult<null>> => {
        try {
            await api.delete(`/passwordvaults/${id}`);
            return {
                success: true
            };
        }
        catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete password',
            };
        }
    },
};

export default PasswordService;