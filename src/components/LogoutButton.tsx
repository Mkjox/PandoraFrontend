import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AuthService from '../services/AuthService';
import { useAppDispatch } from '../redux/hooks';
import { logout as logoutAction } from '../redux/store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const LogoutButton: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { themeStyles } = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const confirmLogout = async () => {
    setVisible(false);
    await AuthService.logout();           // clear stored token
    dispatch(logoutAction());             // update Redux
    navigation.reset({                   // back to Login
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <>
      {/* Trigger Row */}
      <Pressable onPress={() => setVisible(true)} style={[styles.linkRow, themeStyles.card]}>
        <Entypo name="log-out" size={20} style={themeStyles.iconColor} />
        <Text style={[styles.linkText, themeStyles.text]}>Logout</Text>
      </Pressable>

      {/* Confirmation Modal */}
      <Modal
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={[styles.modal, themeStyles.card, themeStyles.border]}>
          <Text style={[styles.title, themeStyles.text]}>Logout</Text>
          <Text style={[styles.message, themeStyles.text]}>
            Are you sure you want to logout?
          </Text>
          <View style={styles.actions}>
            <Pressable
              onPress={() => setVisible(false)}
              style={[styles.btn, styles.cancel]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={confirmLogout}
              style={[styles.btn, styles.destructive]}
            >
              <Text style={styles.destructiveText}>Logout</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};


const styles = StyleSheet.create({
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginVertical: 2,
    paddingHorizontal: 10,
  },
  linkText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    marginLeft: 12,
  },
  modal: {
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancel: {
    marginRight: 8,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#555',
  },
  destructive: {},
  destructiveText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#D32F2F',
  },
});

export default LogoutButton;
