import React, { useEffect, useState } from 'react';
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
import Toast from 'react-native-toast-message';
import CustomButton from '@components/CustomButton';
import { tokenStorage } from '@services/tokenStorage';

const { height, width } = Dimensions.get('window');

const SecurityScreen: React.FC = () => {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [biometricEnabled, setBiometricEnabled] = useState(false);

    const toggleTwoFactor = () => {
        setTwoFactorEnabled(!twoFactorEnabled);
        Toast.show({
            type: 'info',
            text1: twoFactorEnabled ? '2FA Disabled' : '2FA Enabled',
            text2: `Two-Factor Authentication has been ${twoFactorEnabled ? 'disabled' : 'enabled'}.`
        });
    };

    useEffect(() => {
        const loadBiometricStatus = async () => {
            const enabled = await tokenStorage.isBiometricEnabled()
            setBiometricEnabled(enabled)
        }
        loadBiometricStatus()
    }, [])
    
    const toggleBiometric = async (value: boolean) => {
        setBiometricEnabled(value);
        await tokenStorage.setBiometricEnabled(value)

        Toast.show({
            type: 'info',
            text1: value ? 'Biometric Unlock Enabled' : 'Biometric Unlock Disabled',
            text2: `Biometric Unlock has been ${value ? 'enabled' : 'disabled'}.`
        });
    };

    const resetSettings = () => {
        setTwoFactorEnabled(false);
        toggleBiometric(false);
        Toast.show({
            type: 'info',
            text1: 'Reset Security',
            text2: 'All security settings have been reset.'
        });
    };

    return (
        <ScrollView style={[styles.container, theme.styles.container]}>
            <View style={styles.spacer} />

            <Text style={[styles.title, theme.styles.text]}>Security Settings</Text>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, theme.styles.text]}>Two-Factor Authentication</Text>
                <TwoFactorSetup />
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, theme.styles.text]}>Biometric Unlock</Text>
                <View style={styles.optionRow}>
                    <Text style={[styles.optionText, theme.styles.text]}>
                        {biometricEnabled ? 'Enabled' : 'Disabled'}
                    </Text>
                    <Switch
                        value={biometricEnabled}
                        onValueChange={toggleBiometric}
                    />
                </View>
                <Text style={[styles.helperText, theme.styles.text]}>
                    Use fingerprint or face recognition to unlock the app quickly.
                </Text>
            </View>

            {/* <TouchableOpacity
                style={[styles.resetButton, theme.styles.button]}
                onPress={resetSettings}
            >
                <Text style={[styles.resetButtonText, theme.styles.buttonText]}>
                    Reset All Security Settings
                </Text>
            </TouchableOpacity> */}

            <CustomButton
                style={[styles.resetButton]}
                onPress={resetSettings}
                title='Reset All Security Settings'
            />
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
        height: height * 0.06,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        marginHorizontal: width * 0.05,
        marginTop: height * 0.02
    },
    resetButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
});

export default SecurityScreen;