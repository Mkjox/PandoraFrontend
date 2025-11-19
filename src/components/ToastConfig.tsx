import React from "react";
import { BaseToast, ErrorToast, InfoToast } from "react-native-toast-message";
import { StyleSheet } from "react-native";

export const toastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={[styles.toast, { borderLeftColor: '#4CAF50' }]}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={styles.text1}
            text2Style={styles.text2}
            text2NumberOfLines={2}
        />
    ),
    info: (props: any) => (
        <InfoToast
            {...props}
            style={[styles.toast, { borderLeftColor: '#88cefa' }]}
            text1Style={styles.text1}
            text2Style={styles.text2}
            text2NumberOfLines={2}
        />
    ),
    error: (props: any) => (
        <ErrorToast
            {...props}
            style={[styles.toast, { borderLeftColor: '#F44336' }]}
            text1Style={styles.text1}
            text2Style={styles.text2}
            text2NumberOfLines={2}
        />
    ),
};

const styles = StyleSheet.create({
    toast: {
        borderRadius: 8,
        minHeight: 60,
        marginHorizontal: 8,
        elevation: 3,
    },
    text1: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
    text2: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
    },
});