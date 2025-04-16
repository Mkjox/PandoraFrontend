import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../../services/AuthService';

export default function LoginScreen() {
    const [credentials, setCredentials] = useState({
        UsernameOrEmail: '',
        Password: '',
    });

    const dispatch = useDispatch();
    const navigation = useNavigation();

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
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder='Username or Email'
                autoCapitalize='none'
                value={credentials.UsernameOrEmail}
                onChangeText={(text) => handleChange('UsernameOrEmail', text)}
            />

            <TextInput
                style={styles.input}
                placeholder='Password'
                secureTextEntry
                autoCapitalize='none'
                value={credentials.Password}
                onChangeText={(text) => handleChange('Password', text)}
            />

            <Button title='Login' onPress={handleLogin} />

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Don't have an account? Register here</Text>
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