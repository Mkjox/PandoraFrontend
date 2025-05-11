import React, { useState } from 'react'
import {
    View,
    Text,
    Alert,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native'
import { useDispatch } from 'react-redux'
import { login as loginAction } from '../../redux/store/slices/authSlice'
import { useNavigation } from '@react-navigation/native'
import AuthService from '../../services/AuthService'
import LoginButton from '../../components/LoginButton'
import { useTheme } from '../../context/ThemeContext'
import { darkTheme, lightTheme } from '../../assets/colors/theme'
import { MaterialIcons } from '@expo/vector-icons'

export default function LoginScreen() {
    const [credentials, setCredentials] = useState({
        UsernameOrEmail: '',
        Password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { isDark } = useTheme()
    const themeStyles = isDark ? darkTheme : lightTheme

    const handleChange = (key: string, value: string) => {
        setCredentials({ ...credentials, [key]: value })
    }

    const handleLogin = async () => {
        // ← validate before calling service
        if (!credentials.UsernameOrEmail.trim() || !credentials.Password) {
            return Alert.alert(
                'Missing fields',
                'Please enter both username (or email) and password.'
            )
        }

        setLoading(true);
        const result = await AuthService.login(credentials)
        setLoading(false);

        if (result.success) {
            dispatch(loginAction())
        } else {
            Alert.alert('Login Failed', result.message || 'Please try again.')
        }
    }

    return (
        <View style={[styles.container, themeStyles.container]}>
            <Text style={[styles.title, themeStyles.text]}>Login</Text>

            <TextInput
                style={[styles.input, themeStyles.card]}
                placeholder="Username or Email"
                placeholderTextColor={isDark ? '#888' : '#666'}
                autoCapitalize="none"
                value={credentials.UsernameOrEmail}
                onChangeText={(text) => handleChange('UsernameOrEmail', text)}
                keyboardType='email-address'
            />

            <View style={[styles.input, styles.passwordRow, themeStyles.card]}>
                <TextInput
                    style={[styles.passwordInput, themeStyles.card]}
                    placeholder="Password"
                    placeholderTextColor={isDark ? '#888' : '#666'}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    value={credentials.Password}
                    onChangeText={(text) => handleChange('Password', text)}
                />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeIcon}>
                    <MaterialIcons
                        name={showPassword ? 'visibility' : 'visibility-off'}
                        size={24}
                        color={themeStyles.icon.color}
                    />
                </TouchableOpacity>
            </View>

            <LoginButton onPress={handleLogin} loading={loading} />

            <TouchableOpacity onPress={() => navigation.navigate('Register' as any)}>
                <Text style={[styles.link, themeStyles.textBlue]}>
                    Don't have an account? Register here
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        marginBottom: 32,
        textAlign: 'center',
        fontFamily: 'Poppins_700Bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 14,
        borderRadius: 8,
        marginBottom: 16,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12
    },
    link: {
        marginTop: 24,
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
    },
    passwordRow: {
        paddingHorizontal: 14,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 0,
    },
    eyeIcon: {
        marginLeft: 8
    }
})