import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";
import TwoFactorSetup from "@components/TwoFactorSetup";

export default function TwoFactorScreen() {
    const { theme } = useTheme();

    return (
        <ScrollView 
            style={[styles.container, theme.styles.container]} 
            contentContainerStyle={styles.content}
        >
            <View style={[styles.card, theme.styles.card]}>
                <TwoFactorSetup />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
        paddingBottom: 60,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        width: "100%",
    },
});
