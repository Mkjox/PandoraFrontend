import React, { useEffect, useMemo, useCallback, useState } from 'react';
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
import { fetchCategoriesByUser } from '../redux/store/slices/categorySlice';
import { fetchPasswordsByUser } from '../redux/store/slices/passwordSlice';
import ErrorDisplay from '../components/ErrorDisplay';
import { PasswordItem } from '../types/password.types';
import { Category } from '../types/category.types';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  const dispatch = useAppDispatch();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError
  } = useAppSelector(state => state.category);

  const {
    passwords,
    loading: passwordsLoading,
    error: passwordsError
  } = useAppSelector(state => state.passwords);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      dispatch(fetchCategoriesByUser());
      dispatch(fetchPasswordsByUser());
    }
    catch (e) {
      console.error("Error fetching data", e);
    }
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const filteredPasswords = useMemo(() => {
    return passwords.filter((p) => {
      const site = (p.SiteName || '').toLowerCase();
      const user = (p.UsernameOrEmail || '').toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchSearch = site.includes(query) || user.includes(query);
      const matchCategory = selectedCategory ? p.CategoryId === selectedCategory : true;

      return matchSearch && matchCategory;
    });
  }, [passwords, searchQuery, selectedCategory]);

  const renderCategory = ({ item }: { item: Category | { id: null; name: 'All' } }) => {
    const isActive = item.id === selectedCategory;

    return (
      <TouchableOpacity
        style={[styles.categoryPill, isActive ? themeStyles.button : themeStyles.card]}
        onPress={() => setSelectedCategory(item.id)}// null id = All
      >
        <Text style={[styles.categoryText, isActive ? themeStyles.buttonText : themeStyles.text]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPassword = ({ item }: { item: PasswordItem }) => (
    <TouchableOpacity
      style={[styles.card, themeStyles.card]}
      onPress={() => navigation.navigate('PassDetails', { id: item.id })}
    >
      <Text style={[styles.cardTitle, themeStyles.text]}>
        {item.SiteName}
      </Text>
      <Text style={[styles.cardSubtitle, themeStyles.textGray]}>
        {item.UsernameOrEmail}
      </Text>
    </TouchableOpacity>
  );

  if (categoriesLoading || passwordsLoading) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (categoriesError || passwordsError) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <ErrorDisplay message={categoriesError || passwordsError || "An error occured"} />
      </View>
    );
  }

  return (
    <View style={[themeStyles.container, styles.container]}>
      <View style={styles.innerContainer}>
        {/* Header + Add */}
        <View style={styles.topSection}>
          <Text style={[styles.title, themeStyles.text]}>Vault</Text>
          <AddButton />
        </View>

        {/* Search */}
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        {/* Categories */}
        <FlatList
          data={[{ id: null, name: 'All' }, ...categories]}
          horizontal
          keyExtractor={(c) => String(c.id)}
          renderItem={renderCategory}
          showsHorizontalScrollIndicator={false}
          style={styles.categoryList}
        />

        {/* Passwords */}
        <FlatList
          data={filteredPasswords}
          keyExtractor={(p) => p.id}
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
  innerContainer: {
    marginHorizontal: width * 0.06,
    marginTop: StatusBar.currentHeight,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold'
  },
  searchBar: {
    marginTop: height * 0.02,
    borderRadius: 8
  },
  categoryList: {
    marginTop: height * 0.02
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
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
    elevation: 1,
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
});

