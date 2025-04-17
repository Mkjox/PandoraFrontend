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
    iconBackgroundSquare: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E9F1FF',
        borderWidth: 1
    },
    iconBackgroundCircle: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E9F1FF',
        borderWidth: 1,
    },
    text: {
        color: '#002055'
    },
    card: {
        backgroundColor: '#fff'
    },
    textGray: {
        color: '#656565'
    },
    iconColor: {
        color:'#4F4F4F'
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
    iconBackgroundSquare: {
        backgroundColor: '#0A0C16',
        borderColor: '#191D30',
        borderWidth: 1,
    },
    iconBackgroundCircle: {
        backgroundColor: '#0A0C16',
        borderColor: '#191D30',
        borderWidth: 1,
    },
    text: {
        color: '#FFFFFF'
    },
    card: {
        backgroundColor: '#1F1B24'
    },
    textGray: {
        color: '#656565'
    },
    iconColor: {
        color:'#E0E0E0'
    }
});