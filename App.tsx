import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@redux/store';
import { ThemeProvider, useTheme } from '@context/ThemeContext';
import AppNavigator from '@navigation/AppNavigator';
import WelcomeScreen from '@screens/Home/WelcomeScreen';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
} from '@expo-google-fonts/jost';
import { YesevaOne_400Regular } from '@expo-google-fonts/yeseva-one';

import { tokenStorage } from './src/services/tokenStorage';
import { isBiometricAvailable, promptBiometric } from './src/services/biometric';
import { jwtDecode } from 'jwt-decode';
import AuthService from './src/services/AuthService';
import { login as loginAction } from './src/redux/store/slices/authSlice';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@components/ToastConfig';

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
          await AsyncStorage.setItem('hasLaunched', 'true');
          setHasLaunched(false);
        } else {
          setHasLaunched(true);
        }
      } catch {
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
      } catch {
        return null;
      }
    };

    const tryBiometricSignIn = async () => {
      try {
        const enabled = await tokenStorage.isBiometricEnabled();
        if (!enabled) return;

        const available = await isBiometricAvailable();
        if (!available) return;

        const ok = await promptBiometric('Unlock Pandora');
        if (!ok) return;

        const access = await tokenStorage.getAccessToken(true);
        const refresh = await tokenStorage.getRefreshToken(true);

        if (access) {
          const decoded = safeJwtDecode(access);
          const now = Date.now() / 1000;
          if (!decoded?.exp || decoded.exp > now) {
            if (mounted) dispatch(loginAction());
            return;
          }
        }

        if (refresh && typeof (AuthService as any).refreshToken === 'function') {
          const refreshRes = await (AuthService as any).refreshToken({ refreshToken: refresh });
          if (refreshRes?.success && refreshRes.accessToken) {
            await tokenStorage.setTokens(
              refreshRes.accessToken,
              refreshRes.refreshToken ?? refresh,
              { secure: true }
            );
            if (mounted) dispatch(loginAction());
            return;
          }
        }
      } catch {
        // ignore biometric errors silently
      }
    };

    tryBiometricSignIn();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  if (isLoadingTheme || hasLaunched === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1c6d79" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* {hasLaunched ? (
        <AppNavigator />
      ) : (
        <WelcomeScreen onDone={() => setHasLaunched(true)} />
      )} */}
        <AppNavigator />
    </NavigationContainer>
  );
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
    YesevaOne_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
        <Toast config={toastConfig}/>
      </ThemeProvider>
    </Provider>
  );
}
