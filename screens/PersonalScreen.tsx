import { View, Text, Dimensions, StyleSheet, StatusBar, FlatList } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { darkTheme, lightTheme } from '../assets/colors/theme'

const { width, height } = Dimensions.get('window')

const data = [
  {
    "title": "Sharing center",
    "content": "Manage your shared folders"
  },
  {
    "title": "Password generator",
    "content": "Create strong, unique passwords"
  },
  {
    "title": "Emergency access",
    "content": "Peace of mind in an emergency"
  }
]

const PersonalScreen = () => {
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Personal</Text>
      </View>

      {data.map((datas) => {
        return (
          <View style={[styles.cardInnerWrapper, themeStyles.card]}>
            <View style={styles.cardIcon}>
              <Text>Big Icon</Text>
            </View>
            <View style={styles.cardInnerAlignment}>
              <Text style={styles.cardTitle}>{datas.title}</Text>
              <Text style={[themeStyles.textGray, styles.cardContent]}>{datas.content}</Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    marginTop: StatusBar.currentHeight,
    marginHorizontal: width * 0.05
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
  },
  cardInnerWrapper: {
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.01,
    backgroundColor: 'red',
    borderRadius: 10,
    height: height * 0.1,
    flexDirection: 'row',
    elevation: 5
  },
  cardInnerAlignment: {
    flexDirection: 'column'
  },
  cardIcon: {
    alignSelf: 'center',
    marginHorizontal: 15,
    backgroundColor: 'white',
    height: height * 0.08,
    width: width * 0.2,
    justifyContent: 'center'
  },
  cardTitle: {
    alignSelf: 'center',
    marginTop: height * 0.02,
    fontFamily: 'Poppins_500Medium'
  },
  cardContent: {
    alignSelf: 'center',
    fontFamily: 'Poppins_400Regular',
  },
})

export default PersonalScreen