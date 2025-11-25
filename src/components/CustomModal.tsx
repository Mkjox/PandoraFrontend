import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { darkTheme, lightTheme } from "@assets/colors/theme";

const { width } = Dimensions.get("window");

interface CustomModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}) => {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, theme.styles.card, theme.styles.border]}>
          <Text style={[styles.title, theme.styles.text]}>{title}</Text>

          <Text style={[styles.message, theme.styles.textGray]}>
            {message}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn, theme.styles.border]}
              onPress={onCancel}
            >
              <Text style={[styles.btnText, theme.styles.text]}>
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                destructive ? styles.destructiveBtn : styles.confirmBtn,
              ]}
              onPress={onConfirm}
            >
              <Text
                style={[
                  styles.btnText,
                  destructive ? styles.destructiveText : styles.confirmText,
                ]}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  container: {
    width: width * 0.85,
    borderRadius: 14,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    marginBottom: 20,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelBtn: {
    backgroundColor: "transparent",
  },
  confirmBtn: {
    backgroundColor: "#1976d2",
  },
  destructiveBtn: {
    backgroundColor: "#e53935",
  },
  btnText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  confirmText: {
    color: "#fff",
  },
  destructiveText: {
    color: "#fff",
  },
});

export default CustomModal;
