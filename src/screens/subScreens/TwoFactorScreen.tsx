import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Switch,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { darkTheme, lightTheme } from '../../assets/colors/theme'
import AuthService from '../../services/AuthService'

const TwoFactorScreen: React.FC = () => {
  const { isDark } = useTheme()
  const themeStyles = isDark ? darkTheme : lightTheme

  const [loading, setLoading] = useState(true)
  const [isEnabled, setIsEnabled] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [secret, setSecret] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)

  // On mount, fetch current 2FA status
  useEffect(() => {
    (async () => {
      try {
        const res = await AuthService.getTwoFactorStatus()
        setIsEnabled(res.enabled)
      } catch (err) {
        Alert.alert('Error', 'Could not load 2FA status.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleToggle = async (value: boolean) => {
    if (value) {
      // enabling: fetch secret & show setup
      setLoading(true)
      try {
        const res = await AuthService.setupTwoFactor()  // returns { secret, qrCodeUrl? }
        setSecret(res.secret)
        setShowSetup(true)
      } catch {
        Alert.alert('Error', 'Failed to start 2FA setup.')
      } finally {
        setLoading(false)
      }
    } else {
      // disabling
      Alert.alert(
        'Disable 2FA',
        'Are you sure you want to turn off two-factor authentication?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              setLoading(true)
              try {
                await AuthService.disableTwoFactor()
                setIsEnabled(false)
              } catch {
                Alert.alert('Error', 'Could not disable 2FA.')
              } finally {
                setLoading(false)
              }
            },
          },
        ]
      )
    }
  }

  const handleVerify = async () => {
    if (!code.trim()) {
      return Alert.alert('Validation', 'Please enter the code from your authenticator app.')
    }
    setVerifying(true)
    try {
      await AuthService.verifyTwoFactor(code.trim())
      setIsEnabled(true)
      setShowSetup(false)
      setCode('')
      Alert.alert('Success', 'Two-factor authentication enabled.')
    } catch {
      Alert.alert('Error', 'Verification failed. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  if (loading) {
    return (
      <View style={[styles.center, themeStyles.container]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, themeStyles.container]}>
      <View style={styles.header}>
        <Text style={[styles.title, themeStyles.text]}>Two-Factor Authentication</Text>
      </View>

      {!showSetup ? (
        <View style={[styles.section, themeStyles.card]}>
          <View style={styles.row}>
            <Text style={[styles.label, themeStyles.text]}>Enabled</Text>
            <Switch
              value={isEnabled}
              onValueChange={handleToggle}
            />
          </View>
          <Text style={[styles.helpText, themeStyles.text]}>
            Two-factor authentication adds an extra layer of security by requiring a code from your authenticator app.
          </Text>
        </View>
      ) : (
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.label, themeStyles.text]}>Setup</Text>
          <Text style={[styles.helpText, themeStyles.text]}>
            Scan this secret into your authenticator and enter the generated code below.
          </Text>
          <Text selectable style={[styles.secretText, themeStyles.text]}>
            {secret}
          </Text>
          <TextInput
            style={[styles.input, themeStyles.card]}
            placeholder="123 456"
            keyboardType="numeric"
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity
            style={[styles.button, themeStyles.button]}
            onPress={handleVerify}
            disabled={verifying}
          >
            {verifying
              ? <ActivityIndicator color={themeStyles.buttonText.color} />
              : <Text style={[styles.buttonText, themeStyles.buttonText]}>Verify & Enable</Text>}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: StatusBar.currentHeight,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
  },
  section: {
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  helpText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  secretText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
  },
  input: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
  button: {
    marginTop: 16,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
})

export default TwoFactorScreen
