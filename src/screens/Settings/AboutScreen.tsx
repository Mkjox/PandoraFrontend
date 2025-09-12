import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../assets/colors/theme';

const { width } = Dimensions.get('window');

const AboutScreen: React.FC = () => {
      const { isDark } = useTheme();
      const themeStyles = isDark ? darkTheme : lightTheme;

    return (
        <ScrollView style={[styles.container, themeStyles.container]}>
            <View style={styles.spacer} />

            <Text style={[styles.title, themeStyles.text]}>About Pandora</Text>

            <View style={styles.section}>
                <Text style={[styles.sectionBody, themeStyles.text]}>
                    Pandora is your personal, secure vault for passwords and sensitive notes. Everything you store here is encrypted on your device.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, themeStyles.text]}>Version</Text>
                <Text style={[styles.sectionBody, themeStyles.text]}>1.0.0</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, themeStyles.text]}>Built With</Text>
                <Text style={[styles.sectionBody, themeStyles.text]}>
                    • React Native{"\n"}
                    • Redux Toolkit{"\n"}
                    • Expo{"\n"}
                    • PostgreSQL backend
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, themeStyles.text]}>Contact</Text>
                <Text style={[styles.sectionBody, themeStyles.text]}>
                    For support or feedback, email us at{"\n"}
                    <Text style={styles.link}>support@pandora.com</Text>
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    spacer: {
        height: StatusBar.currentHeight || 20,
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
        marginBottom: 6,
    },
    sectionBody: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        lineHeight: 22,
    },
    link: {
        color: '#1e90ff',
        textDecorationLine: 'underline',
    },
});

export default AboutScreen;