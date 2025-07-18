import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
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
  Jost_100Thin,
  Jost_100Thin_Italic,
  Jost_200ExtraLight,
  Jost_200ExtraLight_Italic,
  Jost_300Light,
  Jost_300Light_Italic,
  Jost_400Regular,
  Jost_400Regular_Italic,
  Jost_500Medium,
  Jost_500Medium_Italic,
  Jost_600SemiBold,
  Jost_600SemiBold_Italic,
  Jost_700Bold,
  Jost_700Bold_Italic,
  Jost_800ExtraBold,
  Jost_800ExtraBold_Italic,
  Jost_900Black,
  Jost_900Black_Italic,
} from '@expo-google-fonts/jost'
import {
YesevaOne_400Regular
} from '@expo-google-fonts/yeseva-one'

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isLoadingTheme } = useTheme();
  const [hasLaunched, setHasLaunched] = useState<boolean | null>(null);

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
