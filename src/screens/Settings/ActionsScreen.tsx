import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    Dimensions,
    Switch,
    Alert,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { lightTheme, darkTheme } from '@assets/colors/theme';
import CustomButton from '@components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import AuthService from '@services/AuthService';
import Toast from 'react-native-toast-message';
import CustomModal from '@components/CustomModal';

const { height, width } = Dimensions.get('window');

const ActionsScreen: React.FC = () => {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;
    const navigation = useNavigation<any>()

    const [autoLock, setAutoLock] = useState(false);
    const [clearClipboard, setClearClipboard] = useState(false);
    const [visible, setVisible] = useState(false);

    const handleClear = async () => {
        const result = await AuthService.clearSessions();
        setVisible(false);

        if (!result.success) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: result.message,
            });
            return;
        }

        Toast.show({
            type: 'success',
            text1: 'Sessions Cleared',
            text2: 'All other active sessions were terminated.',
        });
    }

    return (
        <ScrollView style={[styles.container, theme.styles.container]}>
            <View style={styles.spacer} />

            <Text style={[styles.title, theme.styles.text]}>Actions</Text>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, theme.styles.text]}>Auto-Lock</Text>
                <View style={styles.optionRow}>
                    <Text style={[styles.optionText, theme.styles.text]}>
                        {autoLock ? 'Enabled' : 'Disabled'}
                    </Text>
                    <Switch value={autoLock} onValueChange={setAutoLock} />
                </View>
                <Text style={[styles.helperText, theme.styles.text]}>
                    Automatically lock the app after inactivity.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, theme.styles.text]}>Clear Clipboard</Text>
                <View style={styles.optionRow}>
                    <Text style={[styles.optionText, theme.styles.text]}>
                        {clearClipboard ? 'Enabled' : 'Disabled'}
                    </Text>
                    <Switch value={clearClipboard} onValueChange={setClearClipboard} />
                </View>
                <Text style={[styles.helperText, theme.styles.text]}>
                    Clear clipboard automatically after copying credentials.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, theme.styles.text]}>Manual Actions</Text>
                <CustomButton
                    onPress={() => navigation.navigate('Sessions')}
                    title='List Sessions'
                    style={styles.button}
                />
                <CustomButton
                    onPress={() => setVisible(true)}
                    title='Clear Sessions'
                    style={styles.button}
                />

                <CustomModal
                    visible={visible}
                    title='Clear Other Sessions'
                    message='This will log out all other devices except this one. Proceed?'
                    confirmText='Clear'
                    cancelText='Cancel'
                    destructive
                    onConfirm={handleClear}
                    onCancel={() => setVisible(false)}
                />
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
        marginBottom: 16,
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
        fontFamily: 'Poppins_400Regular',
    },
    helperText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#888',
    },
    button: {
        height: height * 0.06,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        marginTop: height * 0.02
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
    },
});

export default ActionsScreen;