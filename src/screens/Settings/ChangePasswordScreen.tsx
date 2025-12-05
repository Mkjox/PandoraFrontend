import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { darkTheme, lightTheme } from '@assets/colors/theme';
import AuthService from '@services/AuthService';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const ChangePasswordScreen: React.FC = () => {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;
    const navigation = useNavigation<any>();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage("All fields are required.");
            setSuccess(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("New passwords do not match.");
            setSuccess(false);
            return;
        }

        const res = await AuthService.changePassword(
            currentPassword,
            newPassword,
            confirmPassword
        );

        setMessage(res.message);
        setSuccess(res.success);

        if (res.success) {
            setTimeout(() => navigation.goBack(), 4000);
        }
    };

    return (
        <ScrollView style={[styles.container, theme.styles.container]}>
            <View style={styles.spacer} />

            <Text style={[styles.title, theme.styles.text]}>Change Password</Text>

            <View style={styles.section}>
                <TextInput
                    secureTextEntry
                    placeholder="Current Password"
                    placeholderTextColor={theme.colors.inputPlaceholderTextColor}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    style={[
                        styles.input,
                        theme.styles.text,
                        theme.styles.border,
                        { color: theme.colors.inputTextColor }
                    ]}
                />

                <TextInput
                    secureTextEntry
                    placeholder="New Password"
                    placeholderTextColor={theme.colors.inputPlaceholderTextColor}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    style={[
                        styles.input,
                        theme.styles.text,
                        theme.styles.border,
                        { color: theme.colors.inputTextColor }
                    ]}
                />

                <TextInput
                    secureTextEntry
                    placeholder="Confirm New Password"
                    placeholderTextColor={theme.colors.inputPlaceholderTextColor}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={[
                        styles.input,
                        theme.styles.text,
                        theme.styles.border,
                        { color: theme.colors.inputTextColor }
                    ]}
                />

                {message !== '' && (
                    <Text
                        style={[
                            styles.message,
                            { color: success ? '#4CAF50' : '#D32F2F' }
                        ]}
                    >
                        {message}
                    </Text>
                )}

                <TouchableOpacity
                    style={[styles.button, theme.styles.button]}
                    onPress={handleChangePassword}
                >
                    <Text style={[styles.buttonText, theme.styles.buttonText]}>
                        Update Password
                    </Text>
                </TouchableOpacity>
            </View>
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
        marginBottom: 12,
    },
    input: {
        height: height * 0.055,
        borderRadius: 6,
        paddingHorizontal: 12,
        fontSize: 15,
        fontFamily: 'Poppins_400Regular',
        marginBottom: 12,
    },
    message: {
        marginTop: 4,
        marginBottom: 10,
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
    },
    button: {
        height: height * 0.055,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
    },
});

export default ChangePasswordScreen;
