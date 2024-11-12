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
        <Text>CategoryScreen</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    marginTop: StatusBar.currentHeight
  }
})

export default CategoryScreen