import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    Dimensions,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { lightTheme, darkTheme } from '@assets/colors/theme';
import Toast from 'react-native-toast-message';
import CustomButton from '@components/CustomButton';
import * as MailComposer from 'expo-mail-composer';

const { height, width } = Dimensions.get('window');

const SuggestScreen: React.FC = () => {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;

    const sendEmail = async () => {
        const isAvailable = await MailComposer.isAvailableAsync();

        if (!isAvailable) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Mail services are not available or not installed on this device.'
            });
            return;
        }

        await MailComposer.composeAsync({
            recipients: ['test_email@example.com'],
            subject: 'About Pandora App',
            body: 'Hey! I think you should implement X feature to this app.'
        });
    };

    return (
        <ScrollView style={[styles.container, theme.styles.container]}>
            <View style={styles.spacer} />

            <Text style={[styles.title, theme.styles.text]}>Send Us Your Suggestions</Text>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, theme.styles.text]}>We’re Listening</Text>
                <Text style={[styles.sectionBody, theme.styles.text]}>
                    Got an idea or feedback? Let us know how we can improve Pandora. Your input helps shape future updates!
                </Text>
            </View>

            <CustomButton
                onPress={sendEmail}
                title="Send Email"
                style={[
                    styles.button,
                ]}
            />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    spacer: { height: StatusBar.currentHeight || 20 },
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
        marginBottom: 6,
    },
    sectionBody: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        lineHeight: 22,
    },
    textArea: {
        height: 120,
        borderRadius: 8,
        padding: 12,
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        marginTop: 8,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#ccc',
        elevation: 2,
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
        marginHorizontal: width * 0.05,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
});

export default SuggestScreen;
