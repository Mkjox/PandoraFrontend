import React, { useState } from 'react'
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native'
import { useDispatch } from 'react-redux'
import AuthService from '../../services/AuthService'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../../context/ThemeContext'
import { darkTheme, lightTheme } from '../../assets/colors/theme'

export default function RegisterScreen() {
    const { isDark } = useTheme()
    const themeStyles = isDark ? darkTheme : lightTheme
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const [form, setForm] = useState({
        FirstName: '',
        LastName: '',
        PhoneNumber: '',
        Username: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
    })

    const [errors, setErrors] = useState<Partial<typeof form>>({})
    const [serverError, setServerError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm(f => ({ ...f, [field]: value }))
        setErrors(e => ({ ...e, [field]: undefined }))
        setServerError(null)
    }

    const handleRegister = async () => {
        // clear previous
        setErrors({})
        setServerError(null)

        // validate
        const newErrors: Partial<typeof form> = {}
            ; (Object.keys(form) as (keyof typeof form)[]).forEach(key => {
                if (!form[key].trim()) {
                    newErrors[key] = 'This field is required.'
                }
            })
        if (!newErrors.Password && form.Password !== form.ConfirmPassword) {
            newErrors.ConfirmPassword = 'Passwords do not match.'
        }
        if (Object.keys(newErrors).length) {
            setErrors(newErrors)
            return
        }

        setLoading(true)
        const result = await AuthService.register(form)
        setLoading(false)

        if (result.success) {
            Alert.alert(
                'Registration is Successful',
                'You can now log in with your credentials',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login' as never),
                    },
                ],
                { cancelable: false }
            )
        } else {
            setServerError(result.message || 'Registration failed.')
        }
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, themeStyles.container]}>
            <Text style={[styles.title, themeStyles.text]}>Register</Text>

            {/* FirstName */}
            <TextInput
                style={[
                    styles.input,
                    themeStyles.card,
                    errors.FirstName ? styles.inputError : undefined,
                ]}
                placeholder="First Name"
                placeholderTextColor={isDark ? '#888' : '#666'}
                value={form.FirstName}
                onChangeText={text => handleChange('FirstName', text)}
            />
            {errors.FirstName && <Text style={styles.errorText}>{errors.FirstName}</Text>}

            <View style={styles.space} />

            {/* LastName */}
            <TextInput
                style={[
                    styles.input,
                    themeStyles.card,
                    errors.LastName ? styles.inputError : undefined
                ]}
                placeholder="Last Name"
                placeholderTextColor={isDark ? '#888' : '#666'}
                value={form.LastName}
                onChangeText={text => handleChange('LastName', text)}
            />
            {errors.LastName && <Text style={styles.errorText}>{errors.LastName}</Text>}

            <View style={styles.space} />

            {/* PhoneNumber */}
            <TextInput
                style={[
                    styles.input,
                    themeStyles.card,
                    errors.PhoneNumber ? styles.inputError : undefined
                ]}
                placeholder="Phone Number"
                placeholderTextColor={isDark ? '#888' : '#666'}
                keyboardType="phone-pad"
                value={form.PhoneNumber}
                onChangeText={text => handleChange('PhoneNumber', text)}
            />
            {errors.PhoneNumber && <Text style={styles.errorText}>{errors.PhoneNumber}</Text>}

            <View style={styles.space} />

            {/* Username */}
            <TextInput
                style={[
                    styles.input,
                    themeStyles.card,
                    errors.Username ? styles.inputError : undefined
                ]}
                placeholder="Username"
                placeholderTextColor={isDark ? '#888' : '#666'}
                autoCapitalize="none"
                value={form.Username}
                onChangeText={text => handleChange('Username', text)}
            />
            {errors.Username && <Text style={styles.errorText}>{errors.Username}</Text>}

            <View style={styles.space} />

            {/* Email */}
            <TextInput
                style={[
                    styles.input,
                    themeStyles.card,
                    errors.Email ? styles.inputError : undefined
                ]}
                placeholder="Email"
                placeholderTextColor={isDark ? '#888' : '#666'}
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.Email}
                onChangeText={text => handleChange('Email', text)}
            />
            {errors.Email && <Text style={styles.errorText}>{errors.Email}</Text>}

            <View style={styles.space} />

            {/* Password */}
            <TextInput
                style={[
                    styles.input,
                    themeStyles.card,
                    errors.Password ? styles.inputError : undefined
                ]}
                placeholder="Password"
                placeholderTextColor={isDark ? '#888' : '#666'}
                secureTextEntry
                value={form.Password}
                onChangeText={text => handleChange('Password', text)}

            />
            {errors.Password && <Text style={styles.errorText}>{errors.Password}</Text>}

            <View style={styles.space} />

            {/* ConfirmPassword */}
            <TextInput
                style={[
                    styles.input,
                    themeStyles.card,
                    errors.ConfirmPassword ? styles.inputError : undefined
                ]}
                placeholder="Confirm Password"
                placeholderTextColor={isDark ? '#888' : '#666'}
                secureTextEntry
                value={form.ConfirmPassword}
                onChangeText={text => handleChange('ConfirmPassword', text)}
            />
            {errors.ConfirmPassword && (
                <Text style={styles.errorText}>{errors.ConfirmPassword}</Text>
            )}

            <View style={styles.space} />

            {/* server error */}
            {serverError && (
                <Text style={[styles.errorText, { textAlign: 'center', marginBottom: 12 }]}>
                    {serverError}
                </Text>
            )}

            <TouchableOpacity
                style={[styles.submitButton, themeStyles.buttonBorder]}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={themeStyles.buttonText.color} />
                ) : (
                    <Text style={[styles.submitText, themeStyles.buttonText]}>Register</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={[styles.link, themeStyles.textBlue]}>
                    Already have an account? <Text style={styles.innerLink}>Log in</Text>
                </Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
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
        marginBottom: 4,
        elevation: 3,
    },
    inputError: {
        borderColor: '#D32F2F',
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 13,
        // marginBottom: 10,
        marginLeft: 4,
        fontFamily: 'Poppins_400Regular',
        fontWeight: '700'
    },
    submitButton: {
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 16,
        borderWidth: 1,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    submitText: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
    },
    link: {
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
    },
    innerLink: {
        fontWeight: '700',
    },
    space: {
        marginBottom: 12
    }
})
