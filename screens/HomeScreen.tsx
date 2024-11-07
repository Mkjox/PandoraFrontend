import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../context/ThemeContext';
import { darkTheme, lightTheme } from '../assets/colors/theme';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { isDark } = useTheme();

  const themeStyles = isDark ? darkTheme : lightTheme;

  return (
    <View style={themeStyles.container}>
      <View style={styles.topSection}>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  topSection: {
    justifyContent: 'space-between'
  }
})

export default HomeScreen