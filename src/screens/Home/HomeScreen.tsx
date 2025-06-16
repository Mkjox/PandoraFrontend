import React, { useState, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import { Searchbar } from 'react-native-paper'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useTheme } from '../../context/ThemeContext'
import { darkTheme, lightTheme } from '../../assets/colors/theme'
import AddButton from '../../components/AddButton'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import ErrorDisplay from '../../components/ErrorDisplay'
import { PasswordItem } from '../../types/password.types'
import { PersonalVaultPayload } from '../../types/personalVault.types'
import CategoryService from '../../services/CategoryService'
import PasswordService from '../../services/PasswordService'
import PersonalVaultService from '../../services/PersonalVaultService'

const { width, height } = Dimensions.get('window')

type FilterType = 'all' | 'password' | 'notes'

export default function HomeScreen() {
  const navigation = useNavigation()
  const { isDark } = useTheme()
  const themeStyles = isDark ? darkTheme : lightTheme
  const dispatch = useAppDispatch()

  const { passwords, loading: pwLoading, error: pwError } = useAppSelector(s => s.passwords)
  const { vaults, loading: vaultLoading, error: vaultError } = useAppSelector(s => s.vault)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')

  useFocusEffect(
    useCallback(() => {
      dispatch(CategoryService.getCategoriesByUser())
      dispatch(PasswordService.getPasswordsByUser())
      dispatch(PersonalVaultService.getPersonalVaults())
    }, [dispatch])
  )

  const filteredPasswords = useMemo(() => {
    return passwords.filter(p => {
      const site = p.SiteName.toLowerCase()
      const user = p.UsernameOrEmail.toLowerCase()
      const q = searchQuery.toLowerCase()
      return (site.includes(q) || user.includes(q))
    })
  }, [passwords, searchQuery])

  const filteredVaults = useMemo(() => {
    return vaults.filter(v => {
      const title = v.Title.toLowerCase()
      const content = v.Content.toLowerCase()
      const q = searchQuery.toLowerCase()
      return (title.includes(q) || content.includes(q))
    })
  }, [vaults, searchQuery])

  const typeOptions: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'password', label: 'Password' },
    { key: 'notes', label: 'Secured Notes' },
  ]

  const renderType = ({ item }: { item: { key: FilterType; label: string } }) => {
    const active = item.key === filterType
    return (
      <TouchableOpacity
        style={[styles.typeButton, active && styles.activeTypeButton]}
        onPress={() => setFilterType(item.key)}
      >
        <Text style={[styles.typeText, active ? themeStyles.text : themeStyles.textGray]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderPassword = ({ item }: { item: PasswordItem }) => (
    <TouchableOpacity
      style={[styles.card, themeStyles.card]}
      onPress={() => navigation.navigate('PassDetails' as any, { id: item.id })}
    >
      <Text style={[styles.cardTitle, themeStyles.text]}>{item.SiteName}</Text>
      <Text style={[styles.cardSubtitle, themeStyles.textGray]}>{item.UsernameOrEmail}</Text>
    </TouchableOpacity>
  )

  const renderVault = ({ item }: { item: PersonalVaultPayload & { id: string } }) => (
    <TouchableOpacity
      style={[styles.card, themeStyles.card]}
      onPress={() => navigation.navigate('PassDetails' as any, { id: item.id })}
    >
      <Text style={[styles.cardTitle, themeStyles.text]}>{item.Title}</Text>
      <Text style={[styles.cardSubtitle, themeStyles.textGray]} numberOfLines={2}>
        {item.Content}
      </Text>
    </TouchableOpacity>
  )

  const loading = (filterType === 'notes' ? vaultLoading : pwLoading)
  const error = filterType === 'notes' ? vaultError : pwError
  const data = filterType === 'notes' ? filteredVaults : filteredPasswords

  if (loading) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <ErrorDisplay message={error} />
      </View>
    )
  }

  return (
    <View style={[themeStyles.container, styles.container]}>
      <View style={styles.inner}>

        <View style={styles.headerRow}>
          <Text style={[styles.title, themeStyles.text]}>Vault</Text>
          <AddButton />
        </View>

        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <FlatList
          data={typeOptions}
          horizontal
          keyExtractor={t => t.key}
          renderItem={renderType}
          showsHorizontalScrollIndicator={false}
          style={styles.typeList}
        />

        {filterType === 'notes' ? (
          <FlatList
            data={filteredVaults}
            keyExtractor={item => item.id}
            renderItem={renderVault}
            contentContainerStyle={styles.passwordList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={filteredPasswords}
            keyExtractor={item => item.id}
            renderItem={renderPassword}
            contentContainerStyle={styles.passwordList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inner: {
    marginHorizontal: width * 0.06,
    marginTop: StatusBar.currentHeight
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold'
  },
  searchBar: {
    marginTop: height * 0.02,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 3
  },
  typeList: {
    marginTop: height * 0.02
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10
  },
  activeTypeButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#6E7FEC'
  },
  typeText: {
    fontSize: 14
  },
  passwordList: {
    paddingBottom: 40,
    marginTop: height * 0.02
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    borderColor: '#ccc',
    borderWidth: 0.7
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_500Medium'
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular'
  }
})