import api from './api'
import { tokenStorage } from './tokenStorage'
import { ServiceResult } from '@appTypes/service.types'
import {
    LoginPayload,
    DecodedToken,
    RegisterPayload,
    UserProfileResponse,
} from '../types/auth.types'
import { jwtDecode } from 'jwt-decode'
import { API_URL } from '@config/apiConfig'
import axios from 'axios'

const AuthService = {
    register: async (payload: RegisterPayload): Promise<ServiceResult<void>> => {
        try {
            const res = await api.post<{
                data: { accessToken: string; refreshToken: string }
                resultStatus: number
                message: string
            }>('/auth/register', payload)

            if (res.data.resultStatus !== 0) {
                return { success: false, message: res.data.message }
            }

            const { accessToken, refreshToken } = res.data.data
            await tokenStorage.setTokens(accessToken, refreshToken)
            return { success: true }
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || 'Registration failed',
            }
        }
    },

    login: async (payload: LoginPayload): Promise<ServiceResult<void>> => {
        try {
            const res = await api.post<{
                data: { accessToken: string; refreshToken: string; requiresTwoFactor?: boolean; tempToken?: string | null }
                resultStatus: number
                message: string
            }>('/auth/login', payload)

            if (res.data.resultStatus !== 0) {
                return { success: false, message: res.data.message }
            }

            const { accessToken, refreshToken, requiresTwoFactor, tempToken } = res.data.data

            // If backend signals 2FA, you may want to short-circuit here and return temp token instead.
            // For now, assume tokens are present on success:
            if (requiresTwoFactor && !accessToken) {
                // Keep any handling you already built for 2FA flows.
                return { success: false, message: 'Two-factor verification required.' }
            }

            await tokenStorage.setTokens(accessToken, refreshToken)
            return { success: true }
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || 'Login failed',
            }
        }
    },

    // Exposed so other modules/components can decode without duplicating logic
    decodeToken: async (): Promise<DecodedToken | null> => {
        const raw = await tokenStorage.getAccessToken()
        if (!raw) return null
        try {
            return jwtDecode<DecodedToken>(raw)
        } catch {
            return null
        }
    },

    logout: async (): Promise<ServiceResult<null>> => {
        try {
            // Optionally inform backend (POST /auth/logout) – ignoring result is fine
            try {
                await api.post('/auth/logout')
            } catch {
                // swallow network/logout endpoint errors
            }
            await tokenStorage.clear()
            return { success: true }
        } catch {
            return { success: false, message: 'Logout failed' }
        }
    },

    // --- Profile ---

    fetchUserProfile: async (): Promise<UserProfileResponse> => {
        const decoded = await AuthService.decodeToken()
        if (!decoded?.nameid) {
            return { success: false, message: 'Invalid or missing token' }
        }
        try {
            const response = await api.get(`/users/${decoded.nameid}`)
            return { success: true, userData: response.data }
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || 'Failed to fetch user data',
            }
        }
    },

    updateProfile: async (
        // payload: { username: string; email: string; photoBase64?: string }
        // ): Promise<ServiceResult<{ username: string; email: string; photoUrl?: string }>> => {
        payload: { username: string; email: string }
    ): Promise<ServiceResult<{ username: string; email: string }>> => {
        try {
            const decoded = await AuthService.decodeToken()
            const userId = decoded?.nameid
            if (!userId) {
                return { success: false, message: 'No valid token / user ID.' }
            }

            const payloadWithId = { ...payload, id: userId }

            const response = await api.put<{
                username: string
                email: string
                // photoUrl?: string
            }>(`/users/${userId}`, payloadWithId)

            return { success: true, data: response.data }
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || 'Failed to update profile',
            }
        }
    },

    // --- Two-Factor (aligned to /auth/2fa/* routes) ---

    getTwoFactorStatus: async (): Promise<
        ServiceResult<{
            isEnabled: boolean
            enabledAt: string | null
            backupCodesRemaining: number
        }>
    > => {
        try {
            const res = await api.get<{
                data: { isEnabled: boolean; enabledAt: string | null; backupCodesRemaining: number }
                resultStatus: number
                message: string
            }>('/auth/2fa/status')

            if (res.data.resultStatus !== 0) {
                return { success: false, message: res.data.message }
            }
            return { success: true, data: res.data.data }
        } catch (err: any) {
            return { success: false, message: err.message }
        }
    },

    setupTwoFactor: async (): Promise<
        ServiceResult<{
            secretKey: string
            qrCodeUri: string
            manualEntryKey: string
            backupCodes: string[]
        }>
    > => {
        try {
            const res = await api.post<{
                data: { secretKey: string; qrCodeUri: string; manualEntryKey: string; backupCodes: string[] }
                resultStatus: number
                message: string
            }>('/auth/2fa/setup')

            if (res.data.resultStatus !== 0) {
                return { success: false, message: res.data.message }
            }
            return { success: true, data: res.data.data }
        } catch (err: any) {
            return { success: false, message: err.message }
        }
    },

    enableTwoFactor: async (code: string): Promise<ServiceResult<void>> => {
        try {
            const res = await api.post<{ resultStatus: number; message: string }>(
                '/auth/2fa/enable',
                { code }
            )
            if (res.data.resultStatus !== 0) {
                return { success: false, message: res.data.message }
            }
            return { success: true }
        } catch (err: any) {
            return { success: false, message: err.message }
        }
    },

    disableTwoFactor: async (): Promise<ServiceResult<void>> => {
        try {
            const res = await api.post<{ resultStatus: number; message: string }>('/auth/2fa/disable')
            if (res.data.resultStatus !== 0) {
                return { success: false, message: res.data.message }
            }
            return { success: true }
        } catch (err: any) {
            return { success: false, message: err.message }
        }
    },

    refreshToken: async (): Promise<ServiceResult<{ accessToken?: string; refreshToken?: string }>> => {
        try {
            const refreshToken = await tokenStorage.getRefreshToken()
            if (!refreshToken) {
                return {
                    success: false,
                    message: 'No refresh token available'
                }
            }

            // Using a bare axios instance to avoid interceptor loops
            const bare = axios.create({ baseURL: API_URL })
            const res = await bare.post<{
                data: {
                    accessToken: string;
                    refreshToken: string
                }
                resultStatus: number
                message: string
            }>('/auth/refresh', { refreshToken })

            if (res.data.resultStatus !== 0) {
                // invalid refresh or server refused -> clear tokens
                await tokenStorage.clear()
                return {
                    success: false,
                    message: res.data.message || 'Refresh failed'
                }
            }

            const { accessToken, refreshToken: newRefresh } = res.data.data
            // store tokens: access in AsyncStorage, refresh in SecureStore (tokenStorage handles it)
            await tokenStorage.setTokens(accessToken, newRefresh)
            return {
                success: true,
                data: {
                    accessToken,
                    refreshToken: newRefresh
                }
            }
        }
        catch (err: any) {
            // on any error, clear tokens to force re-login
            try {
                await tokenStorage.clear()
            }
            catch { }
            return {
                success: false,
                message: err?.response?.data?.message || err.message || 'Refresh failed'
            }
        }
    },

    getSessions: async (): Promise<ServiceResult<any>> => {
        try {
            const currentRefreshToken = await tokenStorage.getRefreshToken();
            if (!currentRefreshToken) {
                return { success: false, message: 'No refresh token found.' };
            }

            // Backend expects "currentRefreshToken"
            const res = await api.get(`/auth/sessions?currentRefreshToken=${currentRefreshToken}`);

            const data = res.data?.data || [];
            if (res.data.resultStatus !== 0) {
                return { success: false, message: res.data.message };
            }

            return {
                success: true,
                data,
                message: res.data.message,
            };
        } catch (err: any) {
            console.log('ERROR:', err.response?.data || err.message);
            return {
                success: false,
                message: err.response?.data?.message || 'Failed to retrieve sessions.',
            };
        }
    },
}

export default AuthService
