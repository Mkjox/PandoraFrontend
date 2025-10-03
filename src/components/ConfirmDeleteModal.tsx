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

const { width } = Dimensions.get("window");

interface ConfirmDeleteModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  const { themeStyles } = useTheme();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, themeStyles.card, themeStyles.border]}>
          <Text style={[styles.title, themeStyles.text]}>Delete Entry</Text>
          <Text style={[styles.message, themeStyles.textGray]}>
            Are you sure you want to delete this entry?{"\n"}
            This action cannot be undone.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn, themeStyles.border]}
              onPress={onCancel}
            >
              <Text style={[styles.btnText, themeStyles.text]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.deleteBtn]}
              onPress={onConfirm}
            >
              <Text style={[styles.btnText, styles.deleteText]}>Delete</Text>
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
  deleteBtn: {
    backgroundColor: "#e53935",
  },
  btnText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  deleteText: {
    color: "#fff",
  },
});

export default ConfirmDeleteModal;
