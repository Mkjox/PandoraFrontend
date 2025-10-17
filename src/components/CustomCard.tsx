import { darkTheme, lightTheme } from "@assets/colors/theme";
import { useTheme } from "@context/ThemeContext";
import React from "react";
import { View, StyleSheet, GestureResponderEvent, TouchableOpacity, Pressable, Platform } from "react-native";

type CardProps = {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  style?: object | object[];
};

const CustomCard: React.FC<CardProps> = ({ children, onPress, style }) => {
  const { isDark } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      android_ripple={isDark ? { color: 'rgba(255, 255, 255, 0.06)' } : { color: 'rgba(0,0,0, 0.06)', borderless: false }}
      style={({ pressed }) => [
        styles.card,
        style,
        pressed && { opacity: Platform.OS === 'ios' ? 0.6 : 1 }
      ]}
    >
      <View>{children}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  }
});

export default CustomCard;