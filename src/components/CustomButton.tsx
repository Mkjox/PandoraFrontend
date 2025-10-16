import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  Platform,
  Pressable,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { darkTheme, lightTheme } from "@assets/colors/theme";

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const isDisabled = disabled || loading;

  const ButtonContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          color={theme.styles.buttonText.color || "#fff"}
          style={{ marginVertical: 2 }}
        />
      ) : (
        <Text
          style={[
            styles.textBase,
            theme.styles.buttonText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      android_ripple={{
        color: "rgba(255, 255, 255, 0.2)",
        borderless: false,
      }}
      style={({ pressed }) => [
        styles.buttonBase,
        theme.styles.button,
        isDisabled && styles.disabledButton,
        pressed && { opacity: Platform.OS === "ios" ? 0.6 : 1 },
        style,
      ]}
    >
      <ButtonContent />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  textBase: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CustomButton;
