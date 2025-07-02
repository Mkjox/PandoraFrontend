import { ServiceResult } from './../types/service.types';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import api from "./api";
import {
    LoginPayload,
    DecodedToken,
    RegisterPayload,
    UserProfileResponse
} from "../types/auth.types";
import { isEnabled } from 'react-native/Libraries/Performance/Systrace';

const AuthService = {
    register: async (payload: RegisterPayload): Promise<ServiceResult<string>> => {
        try {
            const res = await api.post<{
                success: boolean;
                data: {
                    accessToken: string;
                    refreshToken: string,
                };
                resultStatus: number;
                message: string;
            }>("/auth/register", payload);

            if (res.data.resultStatus !== 0) {
                return { success: false, message: res.data.message };
            }

            const token = res.data.data.accessToken;
            await AsyncStorage.setItem("authToken", token);
            return {
                success: true,
                data: token
            };

            // return AuthService.login({
            //     UsernameOrEmail: payload.Email,  // or payload.Username
            //     Password: payload.Password
            // });
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Registration failed"
            };
        }
    },

    login: async (payload: LoginPayload): Promise<ServiceResult<string>> => {
        try {
            const response = await api.post<{
                data: {
                    accessToken: string;
                    refreshToken: string;
                };
                resultStatus: number;
                message: string;
            }>("/auth/login", payload);

            if (response.data.resultStatus !== 0) {
                return {
                    success: false,
                    message: response.data.message
                };
            }

            const token = response.data.data.accessToken;
            await AsyncStorage.setItem("authToken", token);

            return {
                success: true,
                data: token
            };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || "Login failed",
            };
        }
    },

    getToken: async (): Promise<string | null> => {
        return AsyncStorage.getItem("authToken");
    },

    decodeToken: async (): Promise<DecodedToken | null> => {
        const token = await AuthService.getToken();

        if (!token) {
            console.error("No token found.");
            return null;
        }

        try {
            return jwtDecode<DecodedToken>(token);
        } catch (err) {
            console.error("Failed to decode token", err);
            return null;
        }
    },

    fetchUserProfile: async (): Promise<UserProfileResponse> => {
        const decoded = await AuthService.decodeToken();

        if (!decoded?.nameid) {
            return {
                success: false,
                message: "Invalid or missing token"
            };
        }

        try {
            const response = await api.get(`/users/${decoded.nameid}`);

            return {
                success: true,
                userData: response.data
            };
        } catch (err: any) {
            console.error("Error fetching user profile:", err);
            return {
                success: false,
                message: err.response?.data?.message || "Failed to fetch user data",
            };
        }
    },

    logout: async (): Promise<ServiceResult<null>> => {
        try {
            await AsyncStorage.removeItem("authToken");
            return {
                success: true
            };
        } catch (err) {
            console.error("Logout failed:", err);
            return {
                success: false,
                message: "Logout failed"
            };
        }
    },

    updateProfile: async (
        payload: { username: string; email: string; photoBase64?: string }
    ): Promise<ServiceResult<{ username: string; email: string; photoUrl?: string }>> => {
        try {
            const decoded = await AuthService.decodeToken();
            const userId = decoded?.nameid;
            if (!userId) {
                return { success: false, message: 'No valid token / user ID.' };
            }
            // PUT to /users/{id}
            const response = await api.put<{
                username: string;
                email: string;
                photoUrl?: string;
            }>(`/users/${userId}`, payload);
            return { success: true, data: response.data };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || 'Failed to update profile',
            };
        }
    },

    getTwoFactorStatus: async (): Promise<{
        success: boolean;
        data?: {
            isEnabled: boolean;
            enabledAt: string | null;
            backupCodesRemaining: number
        };
        message?: string;
    }> => {
        try {
            const res = await api.get<{
                data: {
                    isEnabled: boolean;
                    enabledAt: string | null;
                    backupCodesRemaining: number
                };
                resultStatus: number;
                message: string;
            }>("/TwoFactor/status");

            if (res.data.resultStatus == 0) throw new Error(res.data.message);
            return {
                success: true,
                data: res.data.data
            };
        }
        catch (err: any) {
            return {
                success: false,
                message: err.message
            };
        }
    },

    setupTwoFactor: async (): Promise<{
        success: boolean;
        data?: {
            secretKey: string;
            qrCodeUri: string;
            manualEntryKey: string;
            backupCodes: string[];
        };
        message?: string;
    }> => {
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
            }>("/TwoFactor/setup", {});

            if (res.data.resultStatus !== 0) throw new Error(res.data.message);
            return {
                success: true,
                data: res.data.data
            };
        }
        catch (err: any) {
            return {
                success: false,
                message: err.message
            };
        }
    },

    verifyTwoFactor: async (code: string): Promise<{
        success: boolean;
        message?: string;
    }> => {
        try {
            const res = await api.post<{
                resultStatus: number;
                message: string;
            }>("/TwoFactor/verify", { code });

            if (res.data.resultStatus !== 0) throw new Error(res.data.message);
            return {
                success: true
            };
        }
        catch (err: any) {
            return {
                success: false,
                message: err.message
            };
        }
    },

    disableTwoFactor: async (): Promise<{
        success: boolean;
        message?: string
    }> => {
        try {
            const res = await api.post<{
                resultStatus: number;
                message: string;
            }>("/TwoFactor/disable", {});

            if (res.data.resultStatus !== 0) throw new Error(res.data.message);
            return {
                success: true
            };
        }
        catch (err: any) {
            return {
                success: false,
                message: err.message
            };
        }
    },

};

export default AuthService;
