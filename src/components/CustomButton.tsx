import React from "react";
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
    ViewStyle,
    TextStyle,
    GestureResponderEvent,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { darkTheme, lightTheme } from "../assets/colors/theme";

interface CustomButtonProps {
    title: string
    onPress: (event: GestureResponderEvent) => void
    loading?: boolean
    disabled?: boolean
    style?: ViewStyle | ViewStyle[]
    textStyle?: TextStyle | TextStyle[]
    icon?: React.ReactNode
    iconRight?: React.ReactNode
}

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    style,
    textStyle,
    icon,
    iconRight,
}) => {
    const { themeStyles } = useTheme()
    
    const isDisabled = disabled || loading

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[
                styles.buttonBase,
                themeStyles.button,
                isDisabled && styles.disabledButton,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    color={themeStyles.buttonText.color || '#fff'}
                />
            ) : (
                <React.Fragment>
                    {icon ? <Text style={styles.iconWrapper}>{icon}</Text> : null}
                    <Text
                        style={[
                            styles.textBase,
                            textStyle
                        ]}
                    >
                        {title}
                    </Text>
                    {iconRight ? <Text style={styles.iconWrapper}>{iconRight}</Text> : null}
                </React.Fragment>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonBase: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    textBase: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: '#ffffff'
    },
    disabledButton: {
        opacity: 0.6,
    },
    iconWrapper: {
        marginHorizontal: 4,
    },
})

export default CustomButton