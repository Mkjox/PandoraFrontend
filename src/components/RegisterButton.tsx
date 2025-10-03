import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { darkTheme, lightTheme } from '@assets/colors/theme';
import { useNavigation } from '@react-navigation/native';

export default function RegisterButton({onPress}) {
  const { themeStyles } = useTheme();

  return (
    <TouchableOpacity style={[styles.button, themeStyles.buttonBorder]} onPress={onPress}>
        <Text style={styles.text}>Register</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
    textTransform: 'uppercase'
  },
});
