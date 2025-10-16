import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Easing, View } from "react-native";
import { darkTheme, lightTheme } from "@assets/colors/theme";
import { useTheme } from "@context/ThemeContext";

const CustomSpinner: React.FC = () => {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    const fadeAnim = useRef(new Animated.Value(0.3)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true, easing: Easing.linear }),
                Animated.timing(fadeAnim, { toValue: 0.3, duration: 800, useNativeDriver: true, easing: Easing.linear }),
            ])
        ).start();
    }, []);

    return (
        <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, theme.styles.container]}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <ActivityIndicator size="large" color={theme.styles.button.backgroundColor} />
            </Animated.View>
        </View>
    )
}

export default CustomSpinner;