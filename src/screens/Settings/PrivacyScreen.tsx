import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { lightTheme, darkTheme } from '@assets/colors/theme';

const { width } = Dimensions.get('window');

const PrivacyScreen: React.FC = () => {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;

    const openPolicyLink = (url: string) => {
        Linking.openURL(url).catch(() => { });
    };

    return (
        <ScrollView style={[styles.container, theme.styles.container]}>
            <View style={styles.spacer} />

            <Text style={[styles.title, theme.styles.text]}>Privacy Policy</Text>

            <View style={[styles.group, theme.styles.card, theme.styles.border]}>
                <Text style={[styles.sectionHeader, theme.styles.text]}>Data Collection</Text>
                <Text style={[styles.sectionBody, theme.styles.text]}>
                    We collect only the data necessary to provide the core functionality:
                    your encrypted vault items and basic usage metrics to improve performance.
                </Text>
            </View>

            <View style={[styles.group, theme.styles.card, theme.styles.border]}>
                <Text style={[styles.sectionHeader, theme.styles.text]}>Data Usage</Text>
                <Text style={[styles.sectionBody, theme.styles.text]}>
                    All your vault data is encrypted on your device. We do NOT share it with third parties.
                </Text>
            </View>

            <View style={[styles.group, theme.styles.card, theme.styles.border]}>
                <Text style={[styles.sectionHeader, theme.styles.text]}>External Links</Text>
                <TouchableOpacity onPress={() => openPolicyLink('https://pandora.com/full-policy')}>
                    <Text style={[styles.linkText, theme.styles.text]}>Read Full Policy Online</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.group, theme.styles.card, theme.styles.border]}>
                <Text style={[styles.sectionHeader, theme.styles.text]}>Contact</Text>
                <TouchableOpacity onPress={() => openPolicyLink('mailto:privacy@pandora.com')}>
                    <Text style={[styles.linkText, theme.styles.text]}>Email Privacy Team</Text>
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
        marginBottom: 16,
    },
    group: {
        marginHorizontal: width * 0.05,
        marginBottom: 16,
        borderRadius: 8,
        padding: 12,
        elevation: 1,
    },
    sectionHeader: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: 6,
    },
    sectionBody: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        lineHeight: 20,
    },
    linkText: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: '#1e90ff',
        textDecorationLine: 'underline',
        marginTop: 4,
    },
});

export default PrivacyScreen;