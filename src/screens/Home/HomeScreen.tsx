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
  SectionList,
} from 'react-native'
import { Searchbar } from 'react-native-paper'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useTheme } from '@context/ThemeContext'
import AddButton from '@components/AddButton'
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import ErrorDisplay from '@components/ErrorDisplay'
import { PasswordItem } from '@appTypes/password.types'
import { PersonalVaultPayload } from '@appTypes/personalVault.types'
import CategoryService from '@services/CategoryService'
import PasswordService from '@services/PasswordService'
import PersonalVaultService from '@services/PersonalVaultService'
import { darkTheme, lightTheme } from '@assets/colors/theme'
import CustomCard from '@components/CustomCard'

const { width, height } = Dimensions.get('window')

type FilterType = 'all' | 'password' | 'personal vault'

type SectionDataItem =
  | ({ type: 'password' } & PasswordItem)
  | ({ type: 'vault' } & PersonalVaultPayload)

export default function HomeScreen() {
  const navigation = useNavigation<any>()
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;
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
      const site = (p.siteName || '').toLowerCase()
      const user = (p.usernameOrEmail || '').toLowerCase()
      const q = searchQuery.toLowerCase()
      return (site.includes(q) || user.includes(q))
    })
  }, [passwords, searchQuery])

  const filteredVaults = useMemo(() => {
    return vaults.filter(v => {
      const title = (v.secureTitle || '').toLowerCase()
      const content = (v.secureContent || '').toLowerCase()
      const q = searchQuery.toLowerCase()
      return (title.includes(q) || content.includes(q))
    })
  }, [vaults, searchQuery])

  const sections = useMemo(() => {
    if (filterType !== 'all') return []
    return [
      {
        title: 'Passwords',
        data: filteredPasswords.map(p => ({ type: 'password' as const, ...p }))
      },
      {
        title: 'Personal Vaults',
        data: filteredVaults.map(v => ({ type: 'vault' as const, ...v }))
      }
    ]
  }, [filterType, filteredPasswords, filteredVaults])

  const typeOptions: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'password', label: 'Password' },
    { key: 'personal vault', label: 'Personal Vault' },
  ]

  const renderType = ({ item }: { item: { key: FilterType; label: string } }) => {
    const active = item.key === filterType
    return (
      <TouchableOpacity
        style={[styles.typeButton, active && styles.activeTypeButton]}
        onPress={() => setFilterType(item.key)}
      >
        <Text style={[
          active ? themeStyles.text : themeStyles.textGray,
          active ? styles.activeText : styles.passiveText
        ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderPassword = ({ item }: { item: PasswordItem }) => (
    <CustomCard
      style={[themeStyles.card, themeStyles.border]}
      onPress={() => navigation.navigate('PassDetails', { id: item.id })}
    >
      <Text style={[styles.cardTitle, themeStyles.text]}>{item.siteName}</Text>
      <Text style={[styles.cardSubtitle, themeStyles.textGray]}>{item.usernameOrEmail}</Text>
    </CustomCard>
  )

  const renderVault = ({ item }: { item: PersonalVaultPayload }) => (
    <CustomCard
      style={[themeStyles.card, themeStyles.border]}
      onPress={() => navigation.navigate('VaultDetails', { id: item.id })}
    >
      <Text style={[styles.cardTitle, themeStyles.text]}>{item.secureTitle}</Text>
      <Text style={[styles.cardSubtitle, themeStyles.textGray]} numberOfLines={2}>
        {item.secureContent}
      </Text>
    </CustomCard>

  )

  const renderSectionItem = ({ item }: { item: SectionDataItem }) =>
    item.type === 'password'
      ? renderPassword({ item })
      : renderVault({ item })

  const renderSectionHeader = ({ section }: any) => (
    <Text style={[styles.sectionHeader, themeStyles.text]}>{section.title}</Text>
  )

  const loading = (filterType === 'personal vault' ? vaultLoading : pwLoading)
  const error = filterType === 'personal vault' ? vaultError : pwError

  if (loading) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={[themeStyles.container, styles.container, { padding: 25 }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, themeStyles.text]}>Vault</Text>
        </View>
        <View style={[themeStyles.container, styles.center]}>
          <ErrorDisplay message={error} />
        </View>
      </View>
    )
  }

  const listHeader = (
    <View>
      <View style={styles.headerRow}>
        <Text style={[styles.title, themeStyles.text]}>Vault</Text>
        <AddButton />
      </View>

      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[styles.searchBar, themeStyles.container]}
        placeholderTextColor={isDark ? '#888' : '#666'}
        iconColor={isDark ? '#888' : '#666'}
      />

      <FlatList
        data={typeOptions}
        horizontal
        keyExtractor={t => t.key}
        renderItem={renderType}
        showsHorizontalScrollIndicator={false}
        style={styles.typeList}
      />
    </View>
  )

  return (
    <View style={[themeStyles.container, styles.container]}>
      <View style={styles.inner}>
        {filterType === 'all' ? (
          <SectionList
            sections={sections}
            keyExtractor={(item, idx) => `${item.type}-${item.id}-${idx}`}
            renderItem={renderSectionItem}
            renderSectionHeader={renderSectionHeader}
            ListHeaderComponent={listHeader}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : filterType === 'password' ? (
          <SectionList
            sections={[{ title: '', data: filteredPasswords }]}
            keyExtractor={(item: PasswordItem) => item.id}
            renderItem={renderPassword}
            ListHeaderComponent={listHeader}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <SectionList
            sections={[{ title: '', data: filteredVaults }]}
            keyExtractor={(item: PersonalVaultPayload) => item.id}
            renderItem={renderVault}
            ListHeaderComponent={listHeader}
            contentContainerStyle={styles.listContent}
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
    elevation: 3,
    fontFamily: 'Poppins_500Medium'
  },
  typeList: {
    marginTop: height * 0.02,
    marginBottom: height * 0.02
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
  activeText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold'
  },
  passiveText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular'
  },
  passwordList: {
    paddingBottom: 40,
    marginTop: height * 0.02
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_500Medium'
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular'
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 16,
    marginBottom: 8
  },
  listContent: {
    paddingBottom: 40
  },
})
