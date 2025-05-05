import {useCallback} from 'react'
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  FlatList
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useTheme } from '../context/ThemeContext'
import { darkTheme, lightTheme } from '../assets/colors/theme'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import CategoryService from '../services/CategoryService'
import { AntDesign } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

export default function CategoryScreen() {
  const navigation = useNavigation()
  const { isDark } = useTheme()
  const themeStyles = isDark ? darkTheme : lightTheme

  const dispatch = useAppDispatch()
  const { categories, loading, error } = useAppSelector(s => s.category)

  useFocusEffect(
    useCallback(() => {
      dispatch(CategoryService.getCategoriesByUser())
    }, [dispatch])
  )

  const renderItem = ({ item }: { item: { id: string; name: string; description?: string } }) => (
    <TouchableOpacity
      style={[styles.card, themeStyles.card]}
      onPress={() =>
        navigation.navigate('AddCredentials' as any, {
          tab: 'Category',
          categoryId: item.id
        })
      }
    >
      <Text style={[styles.cardTitle, themeStyles.text]}>{item.name}</Text>
      {item.description ? (
        <Text style={[styles.cardDescription, themeStyles.textGray]}>
          {item.description}
        </Text>
      ) : null}
    </TouchableOpacity>
  )

  return (
    <View style={[themeStyles.container, styles.container]}>
      <View style={styles.topSection}>
        <Text style={[styles.title, themeStyles.text]}>Categories</Text>
        <TouchableOpacity
          style={[styles.newButton, themeStyles.button]}
          onPress={() =>
            navigation.navigate('AddCredentials' as any, { tab: 'category' })
          }
        >
          <AntDesign name="plus" size={16} color="#fff" />
          <Text style={[styles.newButtonText, themeStyles.buttonText]}>New</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05
  },
  topSection: {
    marginTop: StatusBar.currentHeight,
    marginBottom: height * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    elevation: 5
  },
  newButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600'
  },
  loader: {
    marginTop: 40
  },
  error: {
    marginTop: 40,
    color: 'red',
    fontSize: 16,
    textAlign: 'center'
  },
  listContent: {
    paddingBottom: 20
  },
  card: {
    padding: 16,
    marginBottom: height * 0.015,
    borderRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_500Medium'
  },
  cardDescription: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular'
  }
});