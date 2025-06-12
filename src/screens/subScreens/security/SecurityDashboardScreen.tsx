import React, { useState, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native'
import { useTheme } from '../../../context/ThemeContext'
import { darkTheme, lightTheme } from '../../../assets/colors/theme'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import PasswordService from '../../../services/PasswordService'
import PersonalVaultService from '../../../services/PersonalVaultService'
import CategoryService from '../../../services/CategoryService'
import ErrorDisplay from '../../../components/ErrorDisplay'
import { PasswordItem } from '../../../types/password.types'

const { width, height } = Dimensions.get('window')

// categorize strength
function getStrength(pw: string): 'Weak' | 'Medium' | 'Strong' {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return 'Weak'
  if (score <= 3) return 'Medium'
  return 'Strong'
}

const SecurityDashboardScreen: React.FC = () => {
  const { isDark, toggleTheme } = useTheme()
  const themeStyles = isDark ? darkTheme : lightTheme
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  const {
    passwords,
    loading: pwdLoading,
    error: pwdError,
  } = useAppSelector(s => s.passwords)
  const {
    vaults,
    loading: vaultLoading,
    error: vaultError,
  } = useAppSelector(s => s.vault)
  const {
    categories,
    loading: catLoading,
    error: catError,
  } = useAppSelector(s => s.category)

  // 2FA state (stub)
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [toggling2FA, setToggling2FA] = useState(false)

  useFocusEffect(
    useCallback(() => {
      dispatch(PasswordService.getPasswordsByUser())
      dispatch(PersonalVaultService.getPersonalVaults())
      dispatch(CategoryService.getCategoriesByUser())
    }, [dispatch])
  )

  // compute counts
  const strengthCounts = useMemo(() => {
    const strengths = passwords.map(p => getStrength(p.Password))
    return {
      Weak: strengths.filter(s => s === 'Weak').length,
      Medium: strengths.filter(s => s === 'Medium').length,
      Strong: strengths.filter(s => s === 'Strong').length,
    }
  }, [passwords])

  const handleToggle2FA = async (val: boolean) => {
    setToggling2FA(true)
    try {
      // await AuthService.setTwoFactor(val)
      setTwoFAEnabled(val)
    } catch {
      Alert.alert('Error', 'Could not update Two-Factor setting.')
    } finally {
      setToggling2FA(false)
    }
  }

  if (pwdLoading || vaultLoading || catLoading) {
    return (
      <View style={[styles.center, themeStyles.container]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  if (pwdError || vaultError || catError) {
    return (
      <View style={[styles.center, themeStyles.container]}>
        <ErrorDisplay message={pwdError || vaultError || catError!} />
      </View>
    )
  }

  return (
    <View style={[styles.container, themeStyles.container]}>
      <View style={styles.inner}>
        <Text style={[styles.header, themeStyles.text]}>Security Dashboard</Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, themeStyles.card]}>
            <Text style={[styles.statLabel, themeStyles.text]}>Passwords</Text>
            <Text style={[styles.statValue, themeStyles.text]}>{passwords.length}</Text>
          </View>
          <View style={[styles.statCard, themeStyles.card]}>
            <Text style={[styles.statLabel, themeStyles.text]}>Weak Pwd</Text>
            <Text style={[styles.statValue, themeStyles.text]}>{strengthCounts.Weak}</Text>
          </View>
          <View style={[styles.statCard, themeStyles.card]}>
            <Text style={[styles.statLabel, themeStyles.text]}>Vaults</Text>
            <Text style={[styles.statValue, themeStyles.text]}>{vaults.length}</Text>
          </View>
          <View style={[styles.statCard, themeStyles.card]}>
            <Text style={[styles.statLabel, themeStyles.text]}>Categories</Text>
            <Text style={[styles.statValue, themeStyles.text]}>{categories.length}</Text>
          </View>
        </View>

        {/* Two-Factor Toggle */}
        {/* <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.sectionLabel, themeStyles.text]}>
            Two-Factor Authentication
          </Text>
          <View style={styles.switchRow}>
            <Switch
              value={twoFAEnabled}
              onValueChange={handleToggle2FA}
              disabled={toggling2FA}
            />
            <Text
              style={[styles.switchText, themeStyles.text]}
            >{twoFAEnabled ? 'Enabled' : 'Disabled'}</Text>
          </View>
        </View> */}

        {/* Quick Actions */}
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.sectionLabel, themeStyles.text]}>Quick Actions</Text>
          <TouchableOpacity
            style={[styles.actionButton, themeStyles.button]}
            onPress={() => navigation.navigate('SecurityChallenge' as never)}
          >
            <Text style={[styles.actionText, themeStyles.buttonText]}>
              Review Weak Passwords
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, themeStyles.button]}
            onPress={() => navigation.navigate('Settings' as never)}
          >
            <Text style={[styles.actionText, themeStyles.buttonText]}>
              App Settings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, themeStyles.button]}
            onPress={() => navigation.navigate('TwoFactor' as never)}
          >
            <Text style={[styles.actionText, themeStyles.buttonText]}>
              Two Factor Settings
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: width * 0.06,
    height: height
  },
  inner: {
    marginTop: StatusBar.currentHeight
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    marginTop: 4,
  },
  section: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    elevation: 3,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    marginLeft: 12,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
  },
  actionButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
})

export default SecurityDashboardScreen