import { ServiceResult } from '../types/service.types';
import api from './api';
import { tokenStorage } from './tokenStorage';
import {
    LoginPayload,
    DecodedToken,
    RegisterPayload,
    UserProfileResponse
} from '../types/auth.types';
import { jwtDecode } from 'jwt-decode';

export default {
    register: async (payload: RegisterPayload): Promise<ServiceResult<void>> => {
        try {
            const res = await api.post<{
                data: { accessToken: string; refreshToken: string };
                resultStatus: number;
                message: string;
            }>('/auth/register', payload);

            if (res.data.resultStatus !== 0) {
                return { success: false, message: res.data.message };
            }

            const { accessToken, refreshToken } = res.data.data;
            await tokenStorage.setTokens(accessToken, refreshToken);
            return { success: true };
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
    },

    login: async (payload: LoginPayload): Promise<ServiceResult<void>> => {
        try {
            const res = await api.post<{
                data: { accessToken: string; refreshToken: string };
                resultStatus: number;
                message: string;
            }>('/auth/login', payload);

            if (res.data.resultStatus !== 0) {
                return { success: false, message: res.data.message };
            }

            const { accessToken, refreshToken } = res.data.data;
            await tokenStorage.setTokens(accessToken, refreshToken);
            return { success: true };
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    },

    refreshToken: async (): Promise<string> => {
        const old = await tokenStorage.getRefreshToken();
        if (!old) throw new Error('No refresh token stored');

        const res = await api.post<{
            data: { accessToken: string; refreshToken: string };
            resultStatus: number;
            message: string;
        }>('/auth/refresh', { refreshToken: old });

        if (res.data.resultStatus !== 0) {
            throw new Error(res.data.message);
        }

        const { accessToken, refreshToken } = res.data.data;
        await tokenStorage.setTokens(accessToken, refreshToken);
        return accessToken;
    },

    logout: async (): Promise<ServiceResult<null>> => {
        try {
            await tokenStorage.clearTokens();
            // you can also notify backend: await api.post('/auth/logout');
            return { success: true };
        } catch {
            return { success: false, message: 'Logout failed' };
        }
    },

    decodeToken: async (): Promise<DecodedToken | null> => {
        const raw = await tokenStorage.getAccessToken();
        if (!raw) return null;
        try {
            return jwtDecode<DecodedToken>(raw);
        } catch {
            return null;
        }
    },

    fetchUserProfile: async (): Promise<UserProfileResponse> => {
        const decoded = await this.decodeToken();
        if (!decoded?.nameid) {
            return { success: false, message: 'Invalid or missing token' };
        }
        try {
            const response = await api.get(`/users/${decoded.nameid}`);
            return { success: true, userData: response.data };
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || 'Failed to fetch user data' };
        }
    },

    // two‐factor endpoints:
    getTwoFactorStatus: async (): Promise<ServiceResult<{
        isEnabled: boolean;
        enabledAt: string | null;
        backupCodesRemaining: number;
    }>> => {
        try {
            const res = await api.get<{
                data: {
                    isEnabled: boolean;
                    enabledAt: string | null;
                    backupCodesRemaining: number;
                };
                resultStatus: number;
                message: string;
            }>('/auth/2fa/status');

            if (res.data.resultStatus !== 0) {
                return { success: false, message: res.data.message };
            }
            return { success: true, data: res.data.data };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    },

    setupTwoFactor: async (): Promise<ServiceResult<{
        secretKey: string;
        qrCodeUri: string;
        manualEntryKey: string;
        backupCodes: string[];
    }>> => {
        try {
            const res = await api.post<{
                data: {
                    secretKey: string;
                    qrCodeUri: string;
                    manualEntryKey: string;
                    backupCodes: string[];
                };
                resultStatus: number;
                message: string;
            }>('/auth/2fa/setup');

            if (res.data.resultStatus !== 0) {
                return { success: false, message: res.data.message };
            }
            return { success: true, data: res.data.data };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    },

    enableTwoFactor: async (code: string): Promise<ServiceResult<void>> => {
        try {
            const res = await api.post<{
                resultStatus: number;
                message: string;
            }>('/auth/2fa/enable', { code });

            if (res.data.resultStatus !== 0) {
                return { success: false, message: res.data.message };
            }
            return { success: true };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    },

    disableTwoFactor: async (): Promise<ServiceResult<void>> => {
        try {
            const res = await api.post<{
                resultStatus: number;
                message: string;
            }>('/auth/2fa/disable');

            if (res.data.resultStatus !== 0) {
                return { success: false, message: res.data.message };
            }
            return { success: true };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    },
};
