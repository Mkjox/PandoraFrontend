// import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_KEY = 'auth:accessToken';
const REFRESH_KEY = 'auth:refreshToken';

export const tokenStorage = {
  getAccessToken: (): Promise<string | null> => AsyncStorage.getItem(ACCESS_KEY),
  getRefreshToken: (): Promise<string | null> => AsyncStorage.getItem(REFRESH_KEY),

  setTokens: async (accessToken: string, refreshToken: string): Promise<void> =>  {
    await AsyncStorage.multiSet([
      [ACCESS_KEY, accessToken],
      [REFRESH_KEY, refreshToken],
    ])
  },

  clear: async(): Promise<void> => {
    await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY])
  },
}
