import React, { useCallback } from 'react'
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  StatusBar,
  FlatList,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useTheme } from '../../context/ThemeContext'
import { darkTheme, lightTheme } from '../../assets/colors/theme'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import CategoryService from '../../services/CategoryService'
import CustomSpinner from '@components/CustomSpinner'
import CustomCard from '@components/CustomCard'

const { width, height } = Dimensions.get('window')

export default function CategoryScreen() {
  const navigation = useNavigation<any>()
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const dispatch = useAppDispatch()

  const { categories, loading, error } = useAppSelector(s => s.category)

  // re-fetch whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      dispatch(CategoryService.getCategoriesByUser())
    }, [dispatch])
  )

  const renderItem = ({ item }: { item: { id: string; name: string; description?: string } }) => (
    <CustomCard
      style={[theme.styles.card, theme.styles.border]}
      onPress={() => navigation.navigate('CategoryDetails' as any, { id: item.id })}
    >

      <Text style={[styles.cardTitle, theme.styles.text]}>{item.name}</Text>
      {item.description ? (
        <Text style={[styles.cardDescription, theme.styles.textGray]}>
          {item.description}
        </Text>
      ) : null}
    </CustomCard>
  )

  return (
    <View style={[theme.styles.container, styles.container]}>
      <View style={styles.topSection}>
        <Text style={[styles.title, theme.styles.text]}>Categories</Text>
      </View>

      {loading ? (
        <CustomSpinner />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  topSection: {
    marginTop: StatusBar.currentHeight,
    marginBottom: height * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    elevation: 3,
  },
  newButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  loader: {
    marginTop: 40,
  },
  error: {
    marginTop: 40,
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: width * 0.01,
    marginTop: height * 0.002,
    marginBottom: height * 0.015,
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_500Medium',
  },
  cardDescription: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  cardActions: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  actionButton: {
    paddingHorizontal: 8,
  },
})