import React, { useState } from 'react';
import { Text, Button, Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/store/slices/authSlice';
import AuthService from '../../services/AuthService';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { darkTheme, lightTheme } from '../../assets/colors/theme';
import RegisterButton from '../../components/RegisterButton';

export default function RegisterScreen() {
    const [form, setForm] = useState({
        FirstName: '',
        LastName: '',
        PhoneNumber: '',
        Username: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
    });

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { isDark } = useTheme();

    const themeStyles = isDark ? darkTheme : lightTheme;

    const handleChange = (key: string, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const handleRegister = async () => {
        for (const [k, v] of Object.entries(form)) {
            if (!v.trim()) {
                return Alert.alert('Missing field', `Please enter your ${k}.`)
            }
        }
        if (form.Password !== form.ConfirmPassword) {
            return Alert.alert('Password mismatch', 'Passwords do not match.')
        }

        const result = await AuthService.register(form);

        if (result.success) {
            Alert.alert(
                'Registration Successful',
                'You can now log in with your credentials.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login' as never),
                    },
                ],
                { cancelable: false }
            )
        }
        else {
            Alert.alert('Registration Failed', result.message || 'Please try again.');
        }
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, themeStyles.container]}>
            <Text style={[styles.title, themeStyles.text]}>Register</Text>

            {Object.entries(form).map(([key, value]) => (
                <TextInput
                    key={key}
                    style={[styles.input, themeStyles.card]}
                    placeholder={key}
                    secureTextEntry={key.toLowerCase().includes('password')}
                    autoCapitalize='none'
                    keyboardType={key === 'PhoneNumber' ? 'phone-pad' : 'default'}
                    value={value}
                    onChangeText={(text) => handleChange(key, text)}
                />
            ))}

            <RegisterButton onPress={handleRegister} />

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={[styles.link, themeStyles.textBlue]}>
                    Already have an account? Log in
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center'
    },
    title: {
        fontSize: 32,
        marginBottom: 32,
        textAlign: 'center',
        fontFamily: 'Poppins_700Bold'
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