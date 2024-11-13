import { View, Text, Dimensions, StyleSheet, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../context/ThemeContext'
import { darkTheme, lightTheme } from '../assets/colors/theme'

const { width, height } = Dimensions.get('window')

const CategoryScreen = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  return (
    <View style={[themeStyles.container, styles.container]}>
      <View style={styles.topSection}>
        <Text style={styles.title}>CategoryScreen</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    marginTop: StatusBar.currentHeight,
    marginVertical: height * 0.1,
    marginHorizontal: width * 0.05
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20
  }
})

export default CategoryScreen