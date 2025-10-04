import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { darkTheme, lightTheme } from '@assets/colors/theme';
import { useNavigation } from '@react-navigation/native';

interface Props {
  onPress: () => void;
  loading?: boolean;
}

export default function LoginButton({ onPress, loading = false }: Props) {
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  return (
    <TouchableOpacity
      style={[styles.button, themeStyles.buttonBorder]}
      onPress={onPress}
      disabled={loading}>
      {loading ? (
        <ActivityIndicator color={themeStyles.buttonText.color} />
      ) : (
        <Text style={styles.text}>Login</Text>
      )}
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
