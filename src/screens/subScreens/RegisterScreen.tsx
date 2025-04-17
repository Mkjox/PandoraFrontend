import React, { useState } from 'react';
import { Text, Button, Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import AuthService from '../../services/AuthService';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
    const [form, setForm] = useState({
        Username: '',
        Email: '',
        PhoneNumber: '',
        FirstName: '',
        LastName: '',
        Password: '',
        ConfirmPassword: '',
    });

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const handleChange = (key: string, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const handleRegister = async () => {
        const result = await AuthService.register(form);

        if (result.success) {
            dispatch(login());
        }
        else {
            Alert.alert('Error', result.message || 'Registration failed');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Register</Text>

            {Object.entries(form).map(([key, value]) => (
                <TextInput
                    key={key}
                    style={styles.input}
                    placeholder={key}
                    secureTextEntry={key.toLowerCase().includes('password')}
                    autoCapitalize='none'
                    keyboardType={key === 'PhoneNumber' ? 'phone-pad' : 'default'}
                    value={value}
                    onChangeText={(text) => handleChange(key, text)}
                />
            ))}

            <Button title='Register' onPress={handleRegister} />
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.link}>
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
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 14,
        borderRadius: 8,
        marginBottom: 16
    },
    link: {
        marginTop: 24,
        textAlign: 'center',
        color: '#007bff'
    }
})