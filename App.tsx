import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@redux/store';
import { ThemeProvider, useTheme } from '@context/ThemeContext';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokenStorage } from '@services/tokenStorage';
import { isBiometricAvailable, promptBiometric } from '@services/biometric';
import { jwtDecode } from 'jwt-decode';
import AuthService from '@services/AuthService';
import { login as loginAction } from '@redux/store/slices/authSlice';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@components/ToastConfig';
import { enableScreens } from 'react-native-screens';
import AnimatedSplash from '@components/AnimatedSplash';
import ThemedStatusBar from '@components/ThemedStatusBar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Linking from "expo-linking";
import AppNavigator from '@navigation/AppNavigator';

enableScreens();

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

SplashScreen.preventAutoHideAsync();

const prefix = Linking.createURL("/");

const linking = {
    prefixes: [prefix, "pandoraapp://"],
    config: {
        screens: {
            VerifyEmail: "verify",
        },
    },
};

const AppContent = () => {
  const { isLoading } = useTheme();
  const [isAppReady, setIsAppReady] = useState(false);
  const [hasLaunched, setHasLaunched] = useState<boolean | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const initApp = async () => {
      try {
        // Handle first launch
        const launchedBefore = await AsyncStorage.getItem('hasLaunched');
        if (!launchedBefore) {
          await AsyncStorage.setItem('hasLaunched', 'true');
          setHasLaunched(false);
        } else {
          setHasLaunched(true);
        }

        // Biometric or token-based login
        await handleBiometricLogin();

      } catch (err) {
        console.log('Init error:', err);
      } finally {
        setIsAppReady(true);
      }
    };

    initApp();
  }, []);

  const safeJwtDecode = (token: string | null) => {
    if (!token) return null;
    try {
      return jwtDecode<{ exp?: number }>(token);
    } catch {
      return null;
    }
  };

  const handleBiometricLogin = async () => {
    const biometricEnabled = await tokenStorage.isBiometricEnabled();
    if (!biometricEnabled) return;

    const available = await isBiometricAvailable();
    if (!available) return;

    const authenticated = await promptBiometric('Unlock Pandora');
    if (!authenticated) return;

    const access = await tokenStorage.getAccessToken(true);
    const refresh = await tokenStorage.getRefreshToken(true);

    if (access) {
      const decoded = safeJwtDecode(access);
      const now = Date.now() / 1000;

      if (!decoded?.exp || decoded.exp > now) {
        dispatch(loginAction());
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
        dispatch(loginAction());
      }
    }
  };

  if (isLoading || !isAppReady || hasLaunched === null) {
    return <AnimatedSplash />;
  }

  return (
    <NavigationContainer  linking={linking}>
      <ThemedStatusBar />
      <AppNavigator />
      {/* {hasLaunched ? ( <AppNavigator /> ) : ( <WelcomeScreen onDone={() => setHasLaunched(true)} /> )} */}
    </NavigationContainer>
  );
};

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

  if (!fontsLoaded && !fontError) return null;

  return (
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AppContent />
          <Toast config={toastConfig} position="bottom" />
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}
