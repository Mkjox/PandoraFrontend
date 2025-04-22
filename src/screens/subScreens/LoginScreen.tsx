import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../../services/AuthService';
import LoginButton from '../../components/LoginButton';
import { useTheme } from '../../context/ThemeContext';
import { darkTheme, lightTheme } from '../../assets/colors/theme';

export default function LoginScreen() {
    const [credentials, setCredentials] = useState({
        UsernameOrEmail: '',
        Password: '',
    });

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { isDark } = useTheme();

    const themeStyles = isDark ? darkTheme : lightTheme;

    const handleChange = (key: string, value: string) => {
        setCredentials({ ...credentials, [key]: value });
    };

    const handleLogin = async () => {
        const result = await AuthService.login(credentials);

        if (result.success) {
            dispatch(login());
        }
        else {
            Alert.alert('Login Failed', result.message || 'Please try again.');
        }
    };

    return (
        <View style={[styles.container, themeStyles.container]}>
            <Text style={[styles.title, themeStyles.text]}>Login</Text>

            <TextInput
                style={[styles.input, themeStyles.card]}
                placeholder='Username or Email'
                autoCapitalize='none'
                value={credentials.UsernameOrEmail}
                onChangeText={(text) => handleChange('UsernameOrEmail', text)}
            />

            <TextInput
                style={[styles.input, themeStyles.card]}
                placeholder='Password'
                secureTextEntry
                autoCapitalize='none'
                value={credentials.Password}
                onChangeText={(text) => handleChange('Password', text)}
            />

            <LoginButton onPress={handleLogin} />

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.link, themeStyles.textBlue]}>Don't have an account? Register here</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        fontSize: 32,
        marginBottom: 32,
        textAlign: 'center',
        fontFamily: 'Poppins_600SemiBold'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 14,
        borderRadius: 8,
        marginBottom: 16,
        elevation: 5
    },
    link: {
        marginTop: 24,
        textAlign: 'center',
        color: '#007bff',
        fontFamily: 'Poppins_400Regular'
    }
})