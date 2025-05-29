import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../assets/colors/theme';
import AuthService from '../../services/AuthService';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const AccountScreen: React.FC = () => {
    const { isDark } = useTheme();
    const themeStyles = isDark ? darkTheme : lightTheme;
    const navigation = useNavigation();

    // const handleLogout = async () => {
    //     await AuthService.logout();
    //     // navigate to login if needed...
    // };

    return (
        <ScrollView style={[styles.container, themeStyles.container]}>
            <View style={styles.spacer} />

            <Text style={[styles.title, themeStyles.text]}>My Account</Text>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, themeStyles.text]}>Profile</Text>
                <Text style={[styles.sectionBody, themeStyles.text]}>
                    {/* Replace with real data from Redux or context */}
                    Username: <Text style={styles.bold}>john_doe</Text>
                </Text>
                <Text style={[styles.sectionBody, themeStyles.text]}>
                    Email: <Text style={styles.bold}>john@example.com</Text>
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, themeStyles.text]}>Security</Text>
                <TouchableOpacity style={[styles.option, themeStyles.card]}>
                    <Text style={[styles.optionText, themeStyles.text]}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.option, themeStyles.card]} onPress={() => navigation.navigate("TwoFactor" as never)}>
                    <Text style={[styles.optionText, themeStyles.text]}>Two-Factor Authentication</Text>
                </TouchableOpacity>
            </View>

            {/* <View style={styles.section}>
                <Text style={[styles.sectionHeader, themeStyles.text]}>Other</Text>
                <TouchableOpacity style={[styles.option, themeStyles.card]} onPress={handleLogout}>
                    <Text style={[styles.optionText, themeStyles.text]}>Logout</Text>
                </TouchableOpacity>
            </View> */}
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
    sectionBody: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        marginBottom: 4,
        lineHeight: 22,
    },
    bold: {
        fontFamily: 'Poppins_600SemiBold',
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginTop: 8,
    },
    optionText: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
    },
});

export default AccountScreen;