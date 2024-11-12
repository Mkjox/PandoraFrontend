import { View, Text, Dimensions, StyleSheet, StatusBar } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { darkTheme, lightTheme } from '../assets/colors/theme'

const { width, height } = Dimensions.get('window')

const PersonalScreen = () => {
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <View style={styles.topSection}>
        <Text>Personal</Text>
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

export default PersonalScreen