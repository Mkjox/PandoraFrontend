import React, { useCallback, useState } from 'react';
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
import AuthService from '../../services/AuthService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { darkTheme, lightTheme } from '../../assets/colors/theme';
import { useAppDispatch } from '../../redux/hooks';


const { height, width } = Dimensions.get('window');

const AccountScreen: React.FC = () => {
    const { isDark } = useTheme();
    const themeStyles = isDark ? darkTheme : lightTheme;
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();

    const [profile, setProfile] = useState<any>(null);

    const loadProfile = useCallback(async () => {
        const res = await AuthService.fetchUserProfile();
        if (res.success) {
            setProfile(res.userData);
        }
    }, []);

    useFocusEffect(useCallback(() => { loadProfile(); }, [loadProfile]));


    return (
        <ScrollView style={[styles.container, themeStyles.container]}>
            <View style={styles.spacer} />

            <Text style={[styles.title, themeStyles.text]}>My Account</Text>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, themeStyles.text]}>Profile</Text>
                <Text style={[styles.sectionBody, themeStyles.text]}>
                    {/* Replace with real data from Redux or context */}
                    Username: <Text style={styles.bold}>
                        {profile.username}
                    </Text>
                </Text>
                <Text style={[styles.sectionBody, themeStyles.text]}>
                    Email: <Text style={styles.bold}>
                        {profile.email}
                    </Text>
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, themeStyles.text]}>Security</Text>
                <TouchableOpacity style={[styles.option, themeStyles.button]}>
                    <Text style={[styles.optionText, themeStyles.buttonText]}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.option, themeStyles.button]} onPress={() => navigation.navigate("TwoFactor" as never)}>
                    <Text style={[styles.optionText, themeStyles.buttonText]}>Two-Factor Authentication</Text>
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
        paddingHorizontal: 10,
        borderRadius: 6,
        marginTop: 8,
        height: height * 0.055,
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    optionText: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
    },
});

export default AccountScreen;