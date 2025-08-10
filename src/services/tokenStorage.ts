import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

const ACCESS_KEY = 'pandora_access'
const REFRESH_KEY = 'pandora_refresh'
const BIOMETRIC_FLAG = 'pandora_biometric_enabled'

const isNative = Platform.OS !== 'web'

/**
 * Pattern:
 * - Access token -> AsyncStorage (fast reads for interceptors)
 * - Refresh token -> SecureStore (native only when possible; fallback to AsyncStorage on web)
 * - Biometric flag -> SecureStore when native, otherwise AsyncStorage
 */

export const tokenStorage = {
  setTokens: async (accessToken: string | null, refreshToken: string | null) => {
    try {
      if (accessToken != null) {
        await AsyncStorage.setItem(ACCESS_KEY, accessToken)
      }
      if (refreshToken != null) {
        if (isNative) {
          await SecureStore.setItemAsync(REFRESH_KEY, refreshToken)
        } else {
          await AsyncStorage.setItem(REFRESH_KEY, refreshToken)
        }
      }
    } catch (e) {
      // swallow; upper layers will handle auth errors
    }
  },

  getAccessToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(ACCESS_KEY)
    } catch {
      return null
    }
  },

  getRefreshToken: async (): Promise<string | null> => {
    try {
      if (isNative) {
        // read from SecureStore first
        const val = await SecureStore.getItemAsync(REFRESH_KEY)
        if (val) return val
        // fallback to AsyncStorage if something odd
        return await AsyncStorage.getItem(REFRESH_KEY)
      } else {
        return await AsyncStorage.getItem(REFRESH_KEY)
      }
    } catch {
      return null
    }
  },

  /**
   * Remove tokens from all stores (used on logout / failed refresh)
   */
  clear: async () => {
    try {
      await AsyncStorage.removeItem(ACCESS_KEY)
      await AsyncStorage.removeItem(REFRESH_KEY)
      if (isNative) {
        await SecureStore.deleteItemAsync(REFRESH_KEY)
        await SecureStore.deleteItemAsync(BIOMETRIC_FLAG)
      } else {
        await AsyncStorage.removeItem(BIOMETRIC_FLAG)
      }
    } catch {}
  },

  setBiometricEnabled: async (enabled: boolean) => {
    try {
      const v = enabled ? '1' : '0'
      if (isNative) {
        await SecureStore.setItemAsync(BIOMETRIC_FLAG, v)
      } else {
        await AsyncStorage.setItem(BIOMETRIC_FLAG, v)
      }
    } catch {}
  },

  isBiometricEnabled: async (): Promise<boolean> => {
    try {
      if (isNative) {
        const v = await SecureStore.getItemAsync(BIOMETRIC_FLAG)
        return v === '1'
      } else {
        const v = await AsyncStorage.getItem(BIOMETRIC_FLAG)
        return v === '1'
      }
    } catch {
      return false
    }
  },
}
