import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/redux/store';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import WelcomeScreen from './src/screens/Home/WelcomeScreen';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Jost_400Regular,
  Jost_400Regular_Italic,
  Jost_500Medium,
  Jost_500Medium_Italic,
  Jost_600SemiBold,
  Jost_600SemiBold_Italic,
  Jost_700Bold,
  Jost_700Bold_Italic,
} from '@expo-google-fonts/jost'
import {
  YesevaOne_400Regular
} from '@expo-google-fonts/yeseva-one'

import { tokenStorage } from './src/services/tokenStorage';
import { isBiometricAvailable, promptBiometric } from './src/services/biometric';
import { jwtDecode } from 'jwt-decode';
import AuthService from './src/services/AuthService';
import { login as loginAction } from './src/redux/store/slices/authSlice';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isLoadingTheme } = useTheme();
  const [hasLaunched, setHasLaunched] = useState<boolean | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const flag = await AsyncStorage.getItem('hasLaunched');
        if (flag === null) {
          // first launch
          await AsyncStorage.setItem('hasLaunched', 'true');
          setHasLaunched(false);
        } else {
          setHasLaunched(true);
        }
      } catch {
        // if any storage error, skip welcome
        setHasLaunched(true);
      }
    })();
  }, []);

  useEffect(() => {
    let mounted = true;

    const safeJwtDecode = (token: string | null) => {
      if (!token) return null;

      try {
        return jwtDecode<{ exp?: number }>(token);
      }
      catch {
        return null;
      }
    };

    const tryBiometricSignIn = async () => {
      try {
        // 1) Was biometric explicitly enabled by user?
        const enabled = await tokenStorage.isBiometricEnabled();
        if (!enabled) return;

        // 2) Is biometric hardware available & enrolled?
        const available = await isBiometricAvailable();
        if (!available) return;

        // 3)  Prompt biometric auth
        const ok = await promptBiometric('Unlock Pandora');
        if (!ok) return;

        // 4) Read tokens from secure storage (requireAuth = true attempts platform-level prompt)
        const access = await tokenStorage.getAccessToken(true);
        const refresh = await tokenStorage.getRefreshToken(true);

        // 5) If access token present and not expired -> dispatch login
        if (access) {
          const decoded = safeJwtDecode(access);
          const now = Date.now() / 1000;
          if (!decoded?.exp || decoded.exp > now) {
            if (mounted) dispatch(loginAction());
            return;
          }
        }

        // 6) If access expired but refresh token exists -> attempt refresh via AuthService (optional)
        if (refresh && typeof (AuthService as any).refreshToken === 'function') {
          const refreshRes  = await (AuthService as any).refreshToken({refreshToken: refresh})
          if (refreshRes?.success  && refreshRes.accessToken) {
            await tokenStorage.setTokens(refreshRes.accessToken, refreshRes.refreshToken ?? refresh, {secure: true});
            if (mounted) dispatch(loginAction());
            return;
          }
        }

        // otherwise, nothing to do and user stays logged out
      }
      catch {
        // swallow errors here
        // biometric flow must not crash the app
      }
    }
    tryBiometricSignIn();

    return () => {mounted = false;};
  }, [dispatch]);

  if (isLoadingTheme || hasLaunched === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00adf5" />
      </View>
    );
  }

  return hasLaunched
    ? <AppNavigator />
    : <WelcomeScreen onDone={() => setHasLaunched(true)} />;
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Jost_400Regular,
    Jost_400Regular_Italic,
    Jost_500Medium,
    Jost_500Medium_Italic,
    Jost_600SemiBold,
    Jost_600SemiBold_Italic,
    Jost_700Bold,
    Jost_700Bold_Italic,
    YesevaOne_400Regular
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // don't render until fonts are ready
  if (!fontsLoaded && !fontError) {
    return null as any;
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
}
