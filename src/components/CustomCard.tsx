import { darkTheme, lightTheme } from "@assets/colors/theme";
import { useTheme } from "@context/ThemeContext";
import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";

type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: object | object[];
  iconLabel?: string; // optional
};

const CustomCard: React.FC<CardProps> = ({ children, onPress, style, iconLabel }) => {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={
        isDark
          ? { color: "rgba(255, 255, 255, 0.06)" }
          : { color: "rgba(0,0,0, 0.06)", borderless: false }
      }
      style={({ pressed }) => [
        styles.card,
        style,
        pressed && { opacity: Platform.OS === "ios" ? 0.6 : 1 }
      ]}
    >
      <View style={styles.row}>

        {iconLabel && (
          <View style={[styles.iconBox, theme.styles.iconBackground]}>
            <Text style={[theme.styles.icon, styles.iconText]}>{iconLabel.charAt(0).toUpperCase()}</Text>
          </View>
        )}

        <View style={styles.content}>{children}</View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
});

export default CustomCard;
