import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ErrorDisplayProps {
    message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.errorText}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Poppins_600SemiBold'
    },
});

export default ErrorDisplay;