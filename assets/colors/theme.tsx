import { StyleSheet } from "react-native";

export const lightTheme = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    button: {
        backgroundColor: '#756EF3'
    },
    buttonText: {
        color: '#FFFFFF'
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
    }
})