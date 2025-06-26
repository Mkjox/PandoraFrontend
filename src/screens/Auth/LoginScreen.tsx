import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { useDispatch } from 'react-redux'
import { login as loginAction } from '../../redux/store/slices/authSlice'
import { useNavigation } from '@react-navigation/native'
import AuthService from '../../services/AuthService'
import { useTheme } from '../../context/ThemeContext'
import { darkTheme, lightTheme } from '../../assets/colors/theme'
import { MaterialIcons } from '@expo/vector-icons'
import CustomButton from '../../components/CustomButton'

const {height, width} = Dimensions.get("window")

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
  const navigation = useNavigation()
  const { isDark } = useTheme()
  const themeStyles = isDark ? darkTheme : lightTheme

  const handleChange = (key: keyof typeof credentials, value: string) => {
    setCredentials(c => ({ ...c, [key]: value }))
    // clear per‐field error on change
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
      dispatch(loginAction())
    } else {
      setServerError(result.message || 'Login failed, please try again.')
    }
  }

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.title, themeStyles.text]}>Login</Text>

      <TextInput
        style={[
          styles.input,
          themeStyles.card,
          themeStyles.inputText,
          usernameError ? styles.inputError : undefined,
        ]}
        placeholder="Username or Email"
        placeholderTextColor={isDark ? '#888' : '#666'}
        autoCapitalize="none"
        keyboardType="email-address"
        value={credentials.UsernameOrEmail}
        onChangeText={text => handleChange('UsernameOrEmail', text)}
      />
      {usernameError ? (
        <Text style={[styles.errorText]}>{usernameError}</Text>
      ) : null}

      <View style={styles.space} />

      <View style={[
        styles.input,
        themeStyles.card,
        styles.passwordRow,
        passwordError ? styles.inputError : undefined,
      ]}>
        <TextInput
          style={[
            styles.passwordInput,
            themeStyles.card,
            themeStyles.inputText,
          ]}
          placeholder="Password"
          placeholderTextColor={isDark ? '#888' : '#666'}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          value={credentials.Password}
          onChangeText={text => handleChange('Password', text)}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(v => !v)}
          style={styles.eyeIcon}
        >
          <MaterialIcons
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={24}
            color={themeStyles.icon.color}
          />
        </TouchableOpacity>
      </View>
      {passwordError ? (
        <Text style={[styles.errorText]}>{passwordError}</Text>
      ) : null}

      <View style={styles.space} />

      {serverError ? (
        <Text style={[styles.errorText, { textAlign: 'center' }]}>
          {serverError}
        </Text>
      ) : null}

      <CustomButton
        onPress={handleLogin}
        loading={loading}
        title='Login'
        style={[styles.button, themeStyles.buttonBorder]}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
        <Text style={[styles.link, themeStyles.textBlue]}>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  passwordRow: {
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 0,
  },
  eyeIcon: {
    marginLeft: 8,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 4,
    fontFamily: 'Poppins_400Regular',
    fontWeight: '700'
  },
  link: {
    marginTop: 24,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  innerLink: {
    fontWeight: '700'
  },
  space: {
    marginBottom: height * 0.02
  },
  button: {
    height: height * 0.05,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
})
