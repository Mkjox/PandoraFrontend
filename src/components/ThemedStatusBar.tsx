import React, { useEffect } from "react";
import { StatusBar as RNStatusBar } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@context/ThemeContext";
import { darkTheme, lightTheme } from "@assets/colors/theme";

const ThemedStatusBar: React.FC = () => {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;

    useEffect(() => {
        // Matching the status bar background to the container background
        const backgroundColor = theme?.styles?.container?.backgroundColor || (isDark ? '#12141D' : '#FFFFFF')

        // Android-specific update
        RNStatusBar.setBackgroundColor(backgroundColor, true)
        RNStatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true)
    }, [isDark, theme])

    // Expo cross-platform layer (iOS + Android)
    return <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={theme.styles.container.backgroundColor} />
}

export default ThemedStatusBar