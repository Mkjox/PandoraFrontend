import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Switch,
    Alert,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import AuthService from "@services/AuthService";

const TwoFactorSetup: React.FC = () => {
    const { isDark, themeStyles } = useTheme();

    const [loading, setLoading] = useState(true);
    const [isEnabled, setIsEnabled] = useState(false);
    const [setupData, setSetupData] = useState<{
        secretKey: string;
        qrCodeUri: string;
        manualEntryKey: string;
        backupCodes: string[];
    } | null>(null);
    const [code, setCode] = useState("");
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await AuthService.getTwoFactorStatus();
            if (res.success && res.data) setIsEnabled(res.data.isEnabled);
            else if (!res.success)
                Alert.alert("Error", res.message || "Could not fetch 2FA status");
            setLoading(false);
        })();
    }, []);

    const onToggle = async (value: boolean) => {
        if (value) {
            setLoading(true);
            const res = await AuthService.setupTwoFactor();
            setLoading(false);
            if (res.success && res.data) setSetupData(res.data);
            else Alert.alert("Error", res.message || "Could not start setup");
        } else {
            Alert.alert("Disable 2FA?", "Are you sure you want to turn off 2FA?", [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Disable",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        const res = await AuthService.disableTwoFactor();
                        setLoading(false);
                        if (res.success) {
                            setIsEnabled(false);
                            setSetupData(null);
                        } else Alert.alert("Error", res.message || "Could not disable 2FA");
                    },
                },
            ]);
        }
    };

    const onVerify = async () => {
        if (!code.trim()) {
            Alert.alert("Validation", "Please enter the code from your authenticator app.");
            return;
        }
        setVerifying(true);
        const res = await AuthService.enableTwoFactor(code.trim());
        setVerifying(false);
        if (res.success) {
            setIsEnabled(true);
            setSetupData(null);
            setCode("");
            Alert.alert("Success", "Two-factor authentication enabled.");
        } else Alert.alert("Error", res.message || "Verification failed");
    };

    if (loading) {
        return (
            <View style={[styles.center, themeStyles.container]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (setupData) {
        return (
            <ScrollView contentContainerStyle={[styles.container, themeStyles.container]}>
                <Text style={[styles.title, themeStyles.text]}>Enable Two-Factor</Text>
                <Text style={[styles.helpText, themeStyles.text]}>
                    Scan the QR code below or enter the key manually into your authenticator app.
                </Text>

                <Image source={{ uri: setupData.qrCodeUri }} style={styles.qrImage} />

                <Text selectable style={[styles.manualKey, themeStyles.text]}>
                    {setupData.manualEntryKey}
                </Text>

                <TextInput
                    style={[styles.input, themeStyles.card, themeStyles.inputText]}
                    placeholder="Enter code"
                    placeholderTextColor={isDark ? "#888" : "#666"}
                    keyboardType="number-pad"
                    value={code}
                    onChangeText={setCode}
                />

                <TouchableOpacity
                    style={[styles.button, themeStyles.button]}
                    onPress={onVerify}
                    disabled={verifying}
                >
                    {verifying ? (
                        <ActivityIndicator color={themeStyles.buttonText.color} />
                    ) : (
                        <Text style={[styles.buttonText, themeStyles.buttonText]}>Verify & Enable</Text>
                    )}
                </TouchableOpacity>

                <Text style={[styles.backupHeader, themeStyles.text]}>Backup codes remaining:</Text>
                {setupData.backupCodes.map((c) => (
                    <Text key={c} style={[styles.backupCode, themeStyles.text]}>
                        {c}
                    </Text>
                ))}
            </ScrollView>
        );
    }

    return (
        <View style={[styles.section, themeStyles.card]}>
            <View style={styles.row}>
                <Text style={[styles.label, themeStyles.text]}>
                    {isEnabled ? 'Enabled' : 'Disabled'}
                </Text>
                <Switch value={isEnabled} onValueChange={onToggle} />
            </View>
            <Text style={[styles.helpText, themeStyles.text]}>
                Add an extra layer of security by requiring a code from your authenticator app.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 22,
        fontFamily: "Poppins_700Bold",
        marginBottom: 16,
        textAlign: "center",
    },
    section: {
        borderRadius: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontSize: 16,
        fontFamily: "Poppins_600SemiBold"
    },
    helpText: {
        marginTop: 10,
        fontSize: 14,
        fontFamily: "Poppins_400Regular"
    },
    qrImage: {
        alignSelf: "center",
        width: 200,
        height: 200,
        marginVertical: 16
    },
    manualKey: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: "Poppins_500Medium",
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    button: {
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20
    },
    buttonText: {
        fontSize: 16,
        fontFamily: "Poppins_500Medium"
    },
    backupHeader: {
        marginTop: 20,
        fontSize: 14,
        fontFamily: "Poppins_600SemiBold"
    },
    backupCode: {
        fontSize: 14,
        fontFamily: "Poppins_400Regular",
        marginVertical: 2
    },
});

export default TwoFactorSetup;
