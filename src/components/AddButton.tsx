import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Pressable, Platform } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { darkTheme, lightTheme } from '@assets/colors/theme';
import { useNavigation } from '@react-navigation/native';

export default function AddButton() {
  const navigation = useNavigation<any>();
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;


  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        themeStyles.card,
        themeStyles.border,
        pressed && { opacity: Platform.OS === 'ios' ? 0.6 : 1 }
      ]}
      onPress={() => navigation.navigate("AddCredentials")}
      android_ripple={isDark ? { color: 'rgba(255, 255, 255, 0.06)' } : { color: 'rgba(0,0,0, 0.06)',  borderless: false}}
    >
      <Text style={[styles.text, themeStyles.inputText]}>+ New</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: 75,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16
  },
});
