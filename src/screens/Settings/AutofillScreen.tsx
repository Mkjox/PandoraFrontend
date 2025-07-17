import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  Switch,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../assets/colors/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height, width } = Dimensions.get('window');

const AUTO_FILL_KEY = 'autofillEnabled';

const AutofillScreen: React.FC = () => {
  const { themeStyles } = useTheme();

  const [autofillEnabled, setAutofillEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Load persisted setting on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTO_FILL_KEY);
        if (stored !== null) {
          setAutofillEnabled(stored === 'true');
        }
      } catch (e) {
        console.warn('Failed to load autofill setting', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleAutofill = async () => {
    const newVal = !autofillEnabled;
    setAutofillEnabled(newVal);
    try {
      await AsyncStorage.setItem(AUTO_FILL_KEY, newVal ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed to persist autofill setting', e);
    }
    if (newVal) {
      // Prompt user to enable the service in system settings
      if (Platform.OS === 'android') {
        // On Android, open Autofill settings
        try {
          // use Intent to open settings; may require a native module or Linking
          // Try opening general settings first:
          Linking.openSettings(); // opens app settings; to open autofill specifically may need a native Intent
          // Or if you have a native module to launch Settings.ACTION_AUTOFILL_SETTINGS:
          // NativeModules.YourModule.openAutofillSettings();
        } catch (err) {
          console.warn('Unable to open settings:', err);
        }
        Alert.alert(
          'Enable Autofill Service',
          'To complete setup, please enable Autofill Service for this app in Android Settings → Autofill Service.'
        );
      } else if (Platform.OS === 'ios') {
        Alert.alert(
          'Enable Autofill Extension',
          'To complete setup, ensure the Password Autofill extension is enabled in iOS Settings → Passwords → AutoFill Passwords.'
        );
        // You might open general settings:
        Linking.openURL('App-Prefs:Passwords&AutoFill'); // may not work on all iOS versions
      }
    } else {
      // If disabling: optionally show info
      Alert.alert('Autofill Disabled', 'Autofill service/extension remains installed but disabled in-app.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, themeStyles.container, styles.center]}>
        <Text style={themeStyles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, themeStyles.container]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.spacer} />

      <Text style={[styles.title, themeStyles.text]}>Autofill Settings</Text>

      <View style={[styles.section, themeStyles.card]}>
        <Text style={[styles.sectionHeader, themeStyles.text]}>
          Enable Autofill Service
        </Text>
        <View style={styles.optionRow}>
          <Text style={[styles.optionText, themeStyles.text]}>
            {autofillEnabled ? 'On' : 'Off'}
          </Text>
          <Switch
            value={autofillEnabled}
            onValueChange={toggleAutofill}
          />
        </View>
        <Text style={[styles.helperText, themeStyles.text]}>
          When enabled, Pandora can offer autofill suggestions in compatible apps (Android) or via Password AutoFill extension (iOS). You will need to enable the service/extension in system settings after toggling on.
        </Text>
      </View>

      {/* Optionally, a button to open system settings directly */}
      <TouchableOpacity
        style={[styles.openSettingsButton, themeStyles.buttonBorder]}
        disabled
        onPress={() => {
          if (Platform.OS === 'android') {
            Linking.openSettings();
            // or use native module to open ACTION_AUTOFILL_SETTINGS
          } else {
            Linking.openURL('App-Prefs:Passwords&AutoFill');
          }
        }}
      >
        <Text style={[styles.openSettingsText, themeStyles.buttonText]}>
          Open System Autofill Settings
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spacer: {
    height: StatusBar.currentHeight || 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginHorizontal: width * 0.05,
    marginBottom: 16,
  },
  section: {
    marginHorizontal: width * 0.05,
    marginBottom: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#888',
    paddingBottom: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  helperText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#888',
  },
  openSettingsButton: {
    marginHorizontal: width * 0.05,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
    height: height * 0.055,
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  openSettingsText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AutofillScreen;