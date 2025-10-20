import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  lightTheme as baseLight,
  darkTheme as baseDark,
} from '@assets/colors/theme';
import { ViewStyle, TextStyle } from 'react-native';

type ThemeStyles = {
  container: ViewStyle;
  card: ViewStyle;
  button: ViewStyle;
  buttonBorder?: ViewStyle;
  buttonText?: TextStyle;
  customButtonText?: TextStyle;
  text: TextStyle;
  textBlue?: TextStyle;
  textGray?: TextStyle;
  icon?: TextStyle;
  iconColor?: TextStyle;
  inputText: TextStyle;
  border?: ViewStyle;
  borderTop?: ViewStyle;
  [key: string]: any;
};

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  accent: string;
  setAccent: (color: string) => void;
  isLoading: boolean;
  theme: ThemeStyles;
}

const STORAGE_KEYS = {
  dark: 'app:isDark',
  accent: 'app:accentColor',
};

const ThemeContext = createContext<ThemeContextType>(null!);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [accent, setAccentState] = useState('#4C4DDC');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [darkFlag, storedAccent] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.dark),
          AsyncStorage.getItem(STORAGE_KEYS.accent),
        ]);
        if (darkFlag !== null) {
          setIsDark(darkFlag === 'true');
        }
        if (storedAccent) {
          setAccentState(storedAccent);
        }
      } catch (e) {
        console.warn('Failed to load theme settings', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.dark, String(next));
    } catch { }
  };

  const setAccent = async (color: string) => {
    setAccentState(color);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.accent, color);
    } catch { }
  };

  const base = isDark ? baseDark : baseLight;
  const theme: ThemeStyles = {
    ...base,
    container: { ...base.styles.container, backgroundColor: accent },
    card: { ...base.styles.card, backgroundColor: accent },
    button: { ...base.styles.button, backgroundColor: accent },
    text: { ...base.styles.text, color: accent },
    textGray: { ...base.styles.textGray, color: accent },
    inputText: { ...base.styles.inputText, color: accent },
    // buttonBorder: { ...base.styles.buttonBorder, borderColor: accent },
    // customButtonText: { ...base.styles.customButtonText, color: accent },
    // textBlue: { ...base.styles.textBlue, color: accent },
    // buttonText: { ...base.styles.buttonText, color: accent },
    // icon: { ...base.styles.icon, color: accent },
    // iconColor: { ...base.styles.iconColor, color: accent },
    // border: { ...base.styles.border, borderColor: accent },
    // borderTop: { ...base.styles.borderTop, borderTopColor: accent },
  };

  return (
    <ThemeContext.Provider
      value={{ isDark, toggleTheme, accent, setAccent, isLoading, theme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};
