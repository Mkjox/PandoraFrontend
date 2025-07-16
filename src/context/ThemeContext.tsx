import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StyleProp, TextStyle, ViewStyle } from 'react-native'
import { lightTheme as baseLight, darkTheme as baseDark } from '../assets/colors/theme'

type ThemeStyles = {
  container: ViewStyle
  card: ViewStyle
  button: ViewStyle
  buttonBorder: ViewStyle
  buttonText: TextStyle
  customButtonText: TextStyle
  text: TextStyle
  textBlue: TextStyle
  textGray: TextStyle
  icon: TextStyle
  iconColor: TextStyle
  [key: string]: any
}

type ThemeContextType = {
  isDark: boolean
  toggleTheme: () => void
  accent: string
  setAccent: (color: string) => void
  isLoading: boolean
  themeStyles: ThemeStyles
}

const STORAGE_KEYS = {
  dark: 'app:isDark',
  accent: 'app:accentColor',
}

const ThemeContext = createContext<ThemeContextType>(null!)

/**
 * Provides theme state (light/dark + accent color) and derived styles everywhere.
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState<boolean>(false)
  const [accent, setAccentState] = useState<string>('#4C4DDC')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // on mount: load saved theme and accent
  useEffect(() => {
    ;(async () => {
      try {
        const [darkFlag, storedAccent] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.dark),
          AsyncStorage.getItem(STORAGE_KEYS.accent),
        ])
        if (darkFlag !== null) {
          setIsDark(darkFlag === 'true')
        }
        if (storedAccent) {
          setAccentState(storedAccent)
        }
      } catch (e) {
        console.warn('Failed to load theme settings', e)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const toggleTheme = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.dark, (!isDark).toString())
    } catch {}
    setIsDark(prev => !prev)
  }

  const setAccent = async (color: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.accent, color)
    } catch {}
    setAccentState(color)
  }

  // merge base + accent overrides
  const base = isDark ? baseDark : baseLight
  const themeStyles: ThemeStyles = {
    ...base,
    button: {
      ...base.button,
      backgroundColor: accent,
    },
    buttonBorder: {
      ...base.buttonBorder,
      borderColor: accent,
    },
    customButtonText: {
      ...base.customButtonText,
      color: accent,
    },
    textBlue: {
      ...base.textBlue,
      color: accent,
    },
  }

  return (
    <ThemeContext.Provider
      value={{ isDark, toggleTheme, accent, setAccent, isLoading, themeStyles }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

/** Hook to read theme & accent from any component */
export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
