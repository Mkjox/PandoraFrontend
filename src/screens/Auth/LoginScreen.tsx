import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native'
import { useDispatch } from 'react-redux'
import { login as loginAction } from '@redux/store/slices/authSlice'
import { useNavigation } from '@react-navigation/native'
import AuthService from '@services/AuthService'
import { useTheme } from '@context/ThemeContext'
import { darkTheme, lightTheme } from '@assets/colors/theme'
import { TextInput as PaperInput } from 'react-native-paper'
import CustomButton from '@components/CustomButton'
import { isBiometricAvailable, promptBiometric } from '@services/biometric'
import { tokenStorage } from '@services/tokenStorage'

const { height } = Dimensions.get("window")

export default function LoginScreen() {
  const [credentials, setCredentials] = useState({
    UsernameOrEmail: '',
    Password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const dispatch = useDispatch()
  const navigation = useNavigation<any>()
  const { isDark } = useTheme()
  const theme = isDark ? darkTheme : lightTheme

  const handleChange = (key: keyof typeof credentials, value: string) => {
    setCredentials(c => ({ ...c, [key]: value }))
    if (key === 'UsernameOrEmail') setUsernameError(null)
    if (key === 'Password') setPasswordError(null)
    setServerError(null)
  }

  const handleLogin = async () => {
    let hasError = false
    if (!credentials.UsernameOrEmail.trim()) {
      setUsernameError('Username or email is required.')
      hasError = true
    }
    if (!credentials.Password) {
      setPasswordError('Password is required.')
      hasError = true
    }
    if (hasError) return

    setLoading(true)
    const result = await AuthService.login(credentials)
    setLoading(false)

    if (result.success) {
      // Normal flow
      dispatch(loginAction())

      // Offer biometric enable — best-effort
      try {
        const available = await isBiometricAvailable()
        if (available) {
          Alert.alert(
            'Enable biometric login?',
            'Use fingerprint / Face ID to unlock Pandora on this device.',
            [
              { text: 'No', style: 'cancel' },
              {
                text: 'Yes',
                onPress: async () => {
                  // Confirm biometric now
                  const ok = await promptBiometric('Confirm to enable biometric login')
                  if (!ok) return
                  // Move tokens to secure storage
                  const access = await tokenStorage.getAccessToken()
                  const refresh = await tokenStorage.getRefreshToken()
                  if (access || refresh) {
                    await tokenStorage.setTokens(access ?? '', refresh ?? '', { secure: true })
                    await tokenStorage.setBiometricEnabled(true)
                  }
                },
              },
            ]
          )
        }
      } catch (e) {
        // ignore non-critical errors
      }
    }
  }

  return (
    <View style={[styles.container, theme.styles.container]}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />


      <PaperInput
        mode="outlined"
        label="Username or Email"
        left={<PaperInput.Icon icon="account-outline" />}
        error={!!usernameError}
        value={credentials.UsernameOrEmail}
        onChangeText={text => handleChange('UsernameOrEmail', text)}
        style={[styles.input, theme.styles.card]}
        placeholderTextColor={isDark ? '#888' : '#666'}
        autoCapitalize="none"
        keyboardType="email-address"
        activeUnderlineColor='#1c6d79'
        activeOutlineColor='#1c6d79'
        textColor={isDark ? '#FFF' : '#000'}
      />
      {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}

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
        error={!!passwordError}
        value={credentials.Password}
        onChangeText={text => handleChange('Password', text)}
        style={[styles.input, theme.styles.card]}
        placeholderTextColor={isDark ? '#888' : '#666'}
        autoCapitalize="none"
        activeUnderlineColor='#1c6d79'
        activeOutlineColor='#1c6d79'
        textColor={isDark ? '#FFF' : '#000'}
      />
      {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

      {serverError && (
        <Text style={[styles.errorText, { textAlign: 'center' }]}>
          {serverError}
        </Text>
      )}

      <CustomButton
        onPress={handleLogin}
        loading={loading}
        title="Login"
        style={[styles.button]}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
        <Text style={[styles.link, theme.styles.textBlue]}>
          Don't have an account? <Text style={styles.innerLink}>Register here</Text>
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
  logo: {
    // width: 250,
    // height: 250,
    alignSelf: 'center',
    marginBottom: height * 0.07,
  },
  title: {
    fontSize: 56,
    textAlign: 'center',
    fontFamily: 'YesevaOne_400Regular',
    color: '#1c6d79',
    marginBottom: height * 0.1,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    marginBottom: 12,
    marginLeft: 4,
    fontFamily: 'Poppins_400Regular',
    fontWeight: '700',
  },
  button: {
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
    marginTop: height * 0.15,
  },
  link: {
    marginTop: 24,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center'
  },
  innerLink: {
    fontWeight: '700',
  },
})
