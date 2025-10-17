import { StyleSheet } from "react-native";

export const lightTheme = {
    colors: {
        container: '#FFFFFF',
        button: '#1c6d79',
        buttonText: '#FFFFFF',
        border: '#4C4DDC',
        icon: '#4F4F4F',
        iconBackground: '#E0F2F1',
        text: '#002055',
        textBlue: '#07638B',
        card: '#FFFFFF',
        textGray: '#505050',
        inputText: '#000000',
        borderColor: '#ccc',
        dangerBackgroundColor: '#D32F2F'
    },

    gradients: {
        button: ['#1c6d79', '#3ba7a3'],
        background: ['#FFFFFF', '#F7FAFB'],
    },

    styles: StyleSheet.create({
        container: { backgroundColor: '#FFFFFF', },
        button: { backgroundColor: '#1c6d79', },
        buttonText: { color: '#ffffffff' },
        buttonBorder: { borderColor: '#4C4DDC', },
        customButtonText: { color: '#4C4DDC' },
        icon: { color: '#4F4F4F' },
        iconBackground: { backgroundColor: '#E0F2F1' },
        text: { color: '#002055' },
        textBlue: { color: '#07638B' },
        card: { backgroundColor: '#FFFFFF' },
        textGray: { color: '#505050' },
        iconColor: { color: '#4F4F4F' },
        inputText: { color: '#000000' },
        border: { borderColor: '#ccc', borderWidth: 1 },
        borderTop: { borderColor: '#ccc', borderWidth: 1 },
        dangerBackgroundColor: { backgroundColor: '#D32F2F' },
    }),
};

export const darkTheme = {
    colors: {
        container: '#12141D',
        button: '#3580FF',
        buttonText: '#FFFFFF',
        border: '#3580FF',
        icon: '#E0E0E0',
        iconBackground: '#1F1F2A',
        text: '#FFFFFF',
        textBlue: '#0C7DAE',
        card: '#161821',
        textGray: '#B0B0B0',
        inputText: '#FFFFFF',
        borderColor: '#57555f',
        dangerBackgroundColor: '#D32F2F'
    },

    gradients: {
        button: ['#3580FF', '#2B6DDE'],
        background: ['#12141D', '#161821'],
    },

    styles: StyleSheet.create({
        container: { backgroundColor: '#12141D' },
        button: { backgroundColor: '#3580FF', },
        buttonText: { color: '#FFFFFF', },
        buttonBorder: { borderColor: '#3580FF', },
        customButtonText: { color: '#FFFFFF' },
        icon: { color: '#E0E0E0' },
        iconBackground: { backgroundColor: '#1F1F2A' },
        text: { color: '#FFFFFF' },
        textBlue: { color: '#0C7DAE' },
        card: { backgroundColor: '#161821', },
        textGray: { color: '#B0B0B0' },
        iconColor: { color: '#E0E0E0' },
        inputText: { color: '#FFFFFF' },
        border: { borderColor: '#57555f', borderWidth: 2 },
        borderTop: { borderColor: '#343434', borderWidth: 1 },
        dangerBackgroundColor: { backgroundColor: '#D32F2F' },
    })
};