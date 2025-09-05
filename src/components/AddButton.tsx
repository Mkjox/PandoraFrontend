import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { darkTheme, lightTheme } from '../assets/colors/theme';
import { useNavigation } from '@react-navigation/native';

export default function AddButton() {
  const navigation = useNavigation<any>();
  const { themeStyles } = useTheme();


  return (
    <TouchableOpacity style={[styles.button, themeStyles.button]} onPress={() => navigation.navigate("AddCredentials")}>
      <Text style={[styles.text, themeStyles.buttonText]}>+ New</Text>
    </TouchableOpacity>
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
