import { StyleSheet } from "react-native";

export const lightTheme = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    button: {
        backgroundColor: '#4C4DDC',
    },
    buttonText: {
        color: '#FFFFFF'
    },
    buttonBorder: {
        borderColor: '#4C4DDC',
    },
    customButtonText: {
        color: '#4C4DDC'
    },
    iconBackground: {
        backgroundColor: '#E5E5F7',
    },
    icon: {
        color: '#4F4F4F'
    },
    text: {
        color: '#002055'
    },
    textBlue: {
        color: '#0C7DAE'
    },
    card: {
        backgroundColor: '#fff'
    },
    textGray: {
        color: '#656565'
    },
    iconColor: {
        color: '#4F4F4F'
    }
});

export const darkTheme = StyleSheet.create({
    container: {
        backgroundColor: '#0A0C16'
    },
    button: {
        backgroundColor: '#3580FF',
    },
    buttonText: {
        color: '#FFFFFF',
    },
    buttonBorder: {
        borderColor: '#3580FF',
    },
    customButtonText: {
        color: '#3580FF'
    },
    iconBackground: {
        backgroundColor: '#2A2432',
    },
    icon: {
        color: '#E0E0E0'
    },
    text: {
        color: '#FFFFFF'
    },
    textBlue: {
        color: '#0C7DAE'
    },
    card: {
        backgroundColor: '#151720',
        // backgroundColor: '#1F1B24'               ALTERNATIVE
    },
    textGray: {
        color: '#656565'
    },
    iconColor: {
        color: '#E0E0E0'
    }
});