import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { darkTheme, lightTheme } from '../assets/colors/theme';
import AddButton from '../components/AddButton';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import ErrorDisplay from '../components/ErrorDisplay';
import { PasswordItem } from '../types/password.types';
import CategoryService from '../services/CategoryService';
import PasswordService from '../services/PasswordService';

const { width, height } = Dimensions.get('window');

type FilterType = 'all' | 'password' | 'notes';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;
  const dispatch = useAppDispatch();
  const { passwords, loading: passwordsLoading, error: passwordsError } = useAppSelector(s => s.passwords);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  useFocusEffect(
    useCallback(() => {
      dispatch(CategoryService.getCategoriesByUser());
      dispatch(PasswordService.getPasswordsByUser());
    }, [dispatch])
  );

  const filtered = useMemo(() => {
    return passwords.filter(p => {
      const site = p.SiteName.toLowerCase();
      const user = p.UsernameOrEmail.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchSearch = site.includes(q) || user.includes(q);
      let matchType = true;
      if (filterType === 'password') matchType = !p.Notes;
      if (filterType === 'notes') matchType = !!p.Notes;
      return matchSearch && matchType;
    });
  }, [passwords, searchQuery, filterType]);

  const typeOptions: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'password', label: 'Password' },
    { key: 'notes', label: 'Secured Notes' },
  ];

  const renderType = ({ item }: { item: { key: FilterType; label: string } }) => {
    const active = item.key === filterType;
    return (
      <TouchableOpacity
        style={[styles.typeButton, active && styles.activeTypeButton]}
        onPress={() => setFilterType(item.key)}
      >
        <Text style={[styles.typeText, active ? themeStyles.customButtonText : themeStyles.text]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPassword = ({ item }: { item: PasswordItem }) => (
    <TouchableOpacity
      style={[styles.card, themeStyles.card]}
      onPress={() => navigation.navigate('PassDetails' as any, { id: item.id })}
    >
      <Text style={[styles.cardTitle, themeStyles.text]}>{item.SiteName}</Text>
      <Text style={[styles.cardSubtitle, themeStyles.textGray]}>{item.UsernameOrEmail}</Text>
    </TouchableOpacity>
  );

  if (passwordsLoading) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (passwordsError) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <ErrorDisplay message={passwordsError} />
      </View>
    );
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
        <FlatList
          data={filtered}
          keyExtractor={p => p.id}
          renderItem={renderPassword}
          contentContainerStyle={styles.passwordList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
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
    borderRadius: 8
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
});