import React, { useState } from 'react'
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native'
import { useDispatch } from 'react-redux'
import AuthService from '@services/AuthService'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '@context/ThemeContext'
import { darkTheme, lightTheme } from '@assets/colors/theme'
import { TextInput as PaperInput, Button } from 'react-native-paper'
import CustomButton from '@components/CustomButton'

const { height } = Dimensions.get("window")

export default function RegisterScreen() {
    const { isDark } = useTheme()
    const theme = isDark ? darkTheme : lightTheme
    const dispatch = useDispatch()
    const navigation = useNavigation<any>()

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
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm(f => ({ ...f, [field]: value }))
        setErrors(e => ({ ...e, [field]: undefined }))
        setServerError(null)
    }

    const handleRegister = async () => {
        setErrors({})
        setServerError(null)

        const newErrors: Partial<typeof form> = {};
            (Object.keys(form) as (keyof typeof form)[]).forEach(key => {
                if (!form[key].trim()) newErrors[key] = 'This field is required.'
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
            navigation.navigate('Login' as never)
        } else {
            setServerError(result.message || 'Registration failed.')
        }
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, theme.styles.container]}>
            <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
            />

            <PaperInput
                mode="outlined"
                label="First Name"
                left={<PaperInput.Icon icon="account-outline" />}
                error={!!errors.FirstName}
                value={form.FirstName}
                onChangeText={text => handleChange('FirstName', text)}
                style={[styles.input, theme.styles.card]}
                activeUnderlineColor='#1c6d79'
                activeOutlineColor='#1c6d79'
                placeholderTextColor={isDark ? '#888' : '#666'}
                textColor={isDark ? '#FFF' : '#000'}
            />
            {errors.FirstName && <Text style={styles.errorText}>{errors.FirstName}</Text>}

            <PaperInput
                mode="outlined"
                label="Last Name"
                left={<PaperInput.Icon icon="account-outline" />}
                error={!!errors.LastName}
                value={form.LastName}
                onChangeText={text => handleChange('LastName', text)}
                style={[styles.input, theme.styles.card]}
                activeUnderlineColor='#1c6d79'
                activeOutlineColor='#1c6d79'
                placeholderTextColor={isDark ? '#888' : '#666'}
                textColor={isDark ? '#FFF' : '#000'}
            />
            {errors.LastName && <Text style={styles.errorText}>{errors.LastName}</Text>}

            <PaperInput
                mode="outlined"
                label="Phone Number"
                left={<PaperInput.Icon icon="phone-outline" />}
                keyboardType="phone-pad"
                error={!!errors.PhoneNumber}
                value={form.PhoneNumber}
                onChangeText={text => handleChange('PhoneNumber', text)}
                style={[styles.input, theme.styles.card]}
                activeUnderlineColor='#1c6d79'
                activeOutlineColor='#1c6d79'
                placeholderTextColor={isDark ? '#888' : '#666'}
                textColor={isDark ? '#FFF' : '#000'}
            />
            {errors.PhoneNumber && <Text style={styles.errorText}>{errors.PhoneNumber}</Text>}

            <PaperInput
                mode="outlined"
                label="Username"
                left={<PaperInput.Icon icon="account-circle-outline" />}
                autoCapitalize="none"
                error={!!errors.Username}
                value={form.Username}
                onChangeText={text => handleChange('Username', text)}
                style={[styles.input, theme.styles.card]}
                activeUnderlineColor='#1c6d79'
                activeOutlineColor='#1c6d79'
                placeholderTextColor={isDark ? '#888' : '#666'}
                textColor={isDark ? '#FFF' : '#000'}
            />
            {errors.Username && <Text style={styles.errorText}>{errors.Username}</Text>}

            <PaperInput
                mode="outlined"
                label="Email"
                left={<PaperInput.Icon icon="email-outline" />}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errors.Email}
                value={form.Email}
                onChangeText={text => handleChange('Email', text)}
                style={[styles.input, theme.styles.card]}
                activeUnderlineColor='#1c6d79'
                activeOutlineColor='#1c6d79'
                placeholderTextColor={isDark ? '#888' : '#666'}
                textColor={isDark ? '#FFF' : '#000'}
            />
            {errors.Email && <Text style={styles.errorText}>{errors.Email}</Text>}

            <PaperInput
                mode="outlined"
                label="Password"
                left={<PaperInput.Icon icon="lock-outline" />}
                right={
                    <PaperInput.Icon
                        icon={showPassword ? 'eye' : 'eye-off'}
                        onPress={() => setShowPassword(v => !v)}
                    />
                }
                secureTextEntry={!showPassword}
                error={!!errors.Password}
                value={form.Password}
                onChangeText={text => handleChange('Password', text)}
                style={[styles.input, theme.styles.card]}
                activeUnderlineColor='#1c6d79'
                activeOutlineColor='#1c6d79'
                placeholderTextColor={isDark ? '#888' : '#666'}
                textColor={isDark ? '#FFF' : '#000'}
            />
            {errors.Password && <Text style={styles.errorText}>{errors.Password}</Text>}

            <PaperInput
                mode="outlined"
                label="Confirm Password"
                left={<PaperInput.Icon icon="lock-outline" />}
                right={
                    <PaperInput.Icon
                        icon={showConfirm ? 'eye' : 'eye-off'}
                        onPress={() => setShowConfirm(v => !v)}
                    />
                }
                secureTextEntry={!showConfirm}
                error={!!errors.ConfirmPassword}
                value={form.ConfirmPassword}
                onChangeText={text => handleChange('ConfirmPassword', text)}
                style={[styles.input, theme.styles.card]}
                activeUnderlineColor='#1c6d79'
                activeOutlineColor='#1c6d79'
                placeholderTextColor={isDark ? '#888' : '#666'}
                textColor={isDark ? '#FFF' : '#000'}
            />
            {errors.ConfirmPassword && <Text style={styles.errorText}>{errors.ConfirmPassword}</Text>}

            {serverError && (
                <Text style={[styles.errorText, { textAlign: 'center' }]}>
                    {serverError}
                </Text>
            )}

            <CustomButton
                onPress={handleRegister}
                loading={loading}
                title="Register"
                style={[styles.submitButton]}
            />

            <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                <Text style={[styles.link, theme.styles.textBlue]}>
                    Already have an account? <Text style={styles.innerLink}>Login here</Text>
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
    logo: {
        alignSelf: 'center',
        marginBottom: height * 0.03,
    },
    title: {
        fontSize: 32,
        marginBottom: 32,
        textAlign: 'center',
        fontFamily: 'Poppins_700Bold',
    },
    input: {
        marginBottom: 12,
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 13,
        marginBottom: 8,
        marginLeft: 4,
        fontFamily: 'Poppins_400Regular',
        fontWeight: '700',
    },
    submitButton: {
    height: height * 0.06,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c6d79',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginTop: height * 0.1,
    },
    link: {
        marginTop: 12,
        fontFamily: 'Poppins_400Regular',
        textAlign: 'center'
    },
    innerLink: {
        fontWeight: '700',
    },
})
