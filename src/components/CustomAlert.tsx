import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { darkTheme, lightTheme } from '../assets/colors/theme';

const { width } = Dimensions.get('window');

interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message?: string;
  onClose?: () => void; // optional callback
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title = "Alert",
  message = "Something happened.",
  onClose,
}) => {
  const navigation = useNavigation();
    const { isDark } = useTheme();
    const themeStyles = isDark ? darkTheme : lightTheme;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigation.goBack(); // default behavior
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, themeStyles.card]}>
          <Text style={[styles.title, themeStyles.text]}>{title}</Text>
          <Text style={[styles.message, themeStyles.textGray]}>{message}</Text>

          <TouchableOpacity style={[styles.button, themeStyles.button]} onPress={handleClose}>
            <Text style={[styles.buttonText, themeStyles.buttonText]}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomAlert;
