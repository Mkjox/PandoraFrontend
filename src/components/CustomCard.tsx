import React from "react";
import { View, StyleSheet, GestureResponderEvent, TouchableOpacity } from "react-native";

type CardProps = {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  style?: object | object[];
};

const CustomCard: React.FC<CardProps> = ({ children, onPress, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, style]}
    >
      <View>{children}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 2,
    }
});

export default CustomCard;