import React, { useMemo, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { darkTheme, lightTheme } from '../../assets/colors/theme'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import PasswordService from '../../services/PasswordService'
import ErrorDisplay from '../../components/ErrorDisplay'
import { PasswordItem } from '../../types/password.types'

const { width } = Dimensions.get('window')

// simple password strength categorization
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

const SecurityChallengeScreen: React.FC = () => {
  const { isDark } = useTheme()
  const themeStyles = isDark ? darkTheme : lightTheme
  const navigation = useNavigation()
  const dispatch = useAppDispatch()

  const { passwords, loading, error } = useAppSelector(s => s.passwords)

  // re-fetch on focus
  useFocusEffect(
    useCallback(() => {
      dispatch(PasswordService.getPasswordsByUser())
    }, [dispatch])
  )

  // summary counts
  const { count, weakOnes } = useMemo(() => {
    const strengths = passwords.map(p => getStrength(p.Password))
    const cnt = {
      Weak: strengths.filter(s => s === 'Weak').length,
      Medium: strengths.filter(s => s === 'Medium').length,
      Strong: strengths.filter(s => s === 'Strong').length,
    }
    const weakList = passwords
      .filter(p => getStrength(p.Password) === 'Weak')
      .slice(0, 5)
    return { count: cnt, weakOnes: weakList }
  }, [passwords])

  if (loading) {
    return (
      <View style={[styles.center, themeStyles.container]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  if (error) {
    return (
      <View style={[styles.center, themeStyles.container]}>
        <ErrorDisplay message={error} />
      </View>
    )
  }

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.title, themeStyles.text]}>
        Password Security Overview
      </Text>

      <View style={styles.summaryRow}>
        {(['Weak','Medium','Strong'] as const).map(level => (
          <View key={level} style={[styles.summaryCard, themeStyles.card]}>
            <Text style={[styles.summaryLabel, themeStyles.text]}>{level}</Text>
            <Text style={[styles.summaryValue, themeStyles.text]}>
              {count[level]}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.subTitle, themeStyles.text]}>
        Top Weak Passwords
      </Text>
      {weakOnes.length === 0 ? (
        <Text style={themeStyles.text}>
          🎉 No weak passwords found!
        </Text>
      ) : (
        <FlatList
          data={weakOnes}
          keyExtractor={p => p.id}
          renderItem={({ item }) => (
            <View style={[styles.itemRow, themeStyles.card]}>
              <View style={styles.itemText}>
                <Text style={[styles.itemSite, themeStyles.text]}>
                  {item.SiteName}
                </Text>
                <Text style={[styles.itemPwd, themeStyles.textGray]}>
                  {item.Password}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('PassDetails' as any, { id: item.id })}
              >
                <Text style={[styles.editLink, themeStyles.text]}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: width * 0.06,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 1,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    marginTop: 4,
  },
  subTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 1,
  },
  itemText: {
    flex: 1,
  },
  itemSite: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  itemPwd: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 2,
  },
  editLink: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    textDecorationLine: 'underline',
  },
})

export default SecurityChallengeScreen