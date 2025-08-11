import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Vibration,
} from 'react-native';
import Modal from 'react-native-modal';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import AuthService from '../services/AuthService';
import { useAppDispatch } from '../redux/hooks';
import { logout as logoutAction } from '../redux/store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const MODAL_WIDTH = Math.min(360, width - 48);

const LogoutButton: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { themeStyles } = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const [userLabel, setUserLabel] = useState<string | null>(null);

  useEffect(() => {
    // try to show a friendly identifier if available (non-blocking)
    let mounted = true;
    (async () => {
      try {
        const decoded = await AuthService.decodeToken();
        if (!mounted) return;
        if (decoded?.unique_name) setUserLabel(decoded.unique_name);
        else if (decoded?.nameid) setUserLabel(`id:${decoded.nameid}`);
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const close = () => {
    Vibration.vibrate(10);
    setVisible(false);
  };

  const confirmLogout = async () => {
    setLoading(true);
    Vibration.vibrate(20);
    try {
      await AuthService.logout();           // clear stored token
      dispatch(logoutAction());             // update Redux
      // Reset navigation stack to Login (defensive)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (err) {
      // if something goes wrong, still clear local state and show modal close
      console.warn('Logout error', err);
    } finally {
      setLoading(false);
      setVisible(false);
    }
  };

  return (
    <>
      {/* Trigger Row */}
      <Pressable
        onPress={() => setVisible(true)}
        style={({ pressed }) => [
          styles.linkRow,
          themeStyles.card,
          pressed && styles.pressed,
        ]}
        android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
        accessibilityRole="button"
        accessibilityLabel="Logout"
        hitSlop={8}
      >
          <Entypo name="log-out" size={20} style={[themeStyles.iconColor]} />
        <Text style={[styles.linkText, themeStyles.text]}>Logout</Text>
      </Pressable>

      {/* Confirmation Modal */}
      <Modal
        isVisible={visible}
        onBackdropPress={close}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.45}
        useNativeDriver
        hideModalContentWhileAnimating
      >
        <View style={[styles.modal, themeStyles.card, themeStyles.border, { width: MODAL_WIDTH }]}>
          <View style={styles.header}>
            <View style={[styles.badge, { backgroundColor: themeStyles.iconBg?.backgroundColor || '#eef6f8' }]}>
              <Entypo name="warning" size={20} color={themeStyles.iconColor?.color || '#1c6d79'} />
            </View>
            <View style={styles.titleWrap}>
              <Text style={[styles.title, themeStyles.text]}>Confirm logout</Text>
              {userLabel ? (
                <Text style={[styles.subtitle, themeStyles.text, { opacity: 0.7 }]}>
                  Signing out {userLabel}
                </Text>
              ) : (
                <Text style={[styles.subtitle, themeStyles.text, { opacity: 0.7 }]}>
                  You will be signed out from this device.
                </Text>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.messageWrap}>
            <Text style={[styles.message, themeStyles.text]}>
              Are you sure you want to logout? You will need to authenticate again to access Pandora.
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={close}
              style={({ pressed }) => [
                styles.btn,
                styles.cancel,
                { borderColor: themeStyles.border?.borderColor || '#ccc' },
                pressed && styles.btnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Cancel logout"
            >
              <Text style={[styles.cancelText, themeStyles.text]}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={confirmLogout}
              disabled={loading}
              style={({ pressed }) => [
                styles.btn,
                styles.destructive,
                { backgroundColor: themeStyles.dangerColor || '#D32F2F' },
                pressed && styles.btnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Confirm logout"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.destructiveText}>Logout</Text>
              )}
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
  pressed: {
    opacity: 0.95,
  },

  linkText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    marginLeft: 12,
  },

  modal: {
    padding: 18,
    borderRadius: 14,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
  },

  divider: {
    height: 1,
    marginVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },

  messageWrap: {
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: 'Poppins_500Medium',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    minWidth: 92,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  btnPressed: {
    opacity: 0.86,
  },
  cancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#555',
  },
  destructive: {
    // backgroundColor assigned inline from themeStyles.dangerColor or fallback
  },
  destructiveText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
  },
});

export default LogoutButton;
