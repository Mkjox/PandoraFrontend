import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    Dimensions,
    Switch,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { lightTheme, darkTheme } from '@assets/colors/theme';
import TwoFactorSetup from '@components/TwoFactorSetup';

const { height, width } = Dimensions.get('window');

const SecurityScreen: React.FC = () => {
    const { isDark } = useTheme();
    const themeStyles = isDark ? darkTheme : lightTheme;

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [biometricEnabled, setBiometricEnabled] = useState(false);

    const toggleTwoFactor = () => {
        setTwoFactorEnabled(!twoFactorEnabled);
        Alert.alert(
            twoFactorEnabled ? '2FA Disabled' : '2FA Enabled',
            `Two-Factor Authentication has been ${twoFactorEnabled ? 'disabled' : 'enabled'}.`
        );
    };

    const toggleBiometric = () => {
        setBiometricEnabled(!biometricEnabled);
        Alert.alert(
            biometricEnabled ? 'Biometric Unlock Disabled' : 'Biometric Unlock Enabled',
            `Biometric Unlock has been ${biometricEnabled ? 'disabled' : 'enabled'}.`
        );
    };

    const resetSettings = () => {
        setTwoFactorEnabled(false);
        setBiometricEnabled(false);
        Alert.alert('Reset Security', 'All security settings have been reset.');
    };

    return (
        <ScrollView style={[styles.container, themeStyles.container]}>
            <View style={styles.spacer} />

            <Text style={[styles.title, themeStyles.text]}>Security Settings</Text>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, themeStyles.text]}>Two-Factor Authentication</Text>
                {/* <View style={styles.optionRow}>
                    <Text style={[styles.optionText, themeStyles.text]}>
                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </Text>
                    <Switch
                        value={twoFactorEnabled}
                        onValueChange={toggleTwoFactor}
                    />
                </View> */}
                <TwoFactorSetup />
                {/* <Text style={[styles.helperText, themeStyles.text]}>
                    Add an extra layer of security by requiring a code from your authenticator app when logging in.
                </Text> */}
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, themeStyles.text]}>Biometric Unlock</Text>
                <View style={styles.optionRow}>
                    <Text style={[styles.optionText, themeStyles.text]}>
                        {biometricEnabled ? 'Enabled' : 'Disabled'}
                    </Text>
                    <Switch
                        value={biometricEnabled}
                        onValueChange={toggleBiometric}
                    />
                </View>
                <Text style={[styles.helperText, themeStyles.text]}>
                    Use fingerprint or face recognition to unlock the app quickly.
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.resetButton, themeStyles.button]}
                onPress={resetSettings}
            >
                <Text style={[styles.resetButtonText, themeStyles.buttonText]}>
                    Reset All Security Settings
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    spacer: {
        height: StatusBar.currentHeight || 20
    },
    title: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        marginHorizontal: width * 0.05,
        marginBottom: 20,
    },
    section: {
        marginHorizontal: width * 0.05,
        marginBottom: 24,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#888',
        paddingBottom: 12,
    },
    sectionHeader: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: 8,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    optionText: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
    helperText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#888',
    },
    resetButton: {
        marginHorizontal: width * 0.05,
        height: height * 0.055,
        marginTop: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    resetButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
});

export default SecurityScreen;