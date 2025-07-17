import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Switch,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { darkTheme, lightTheme } from '../../assets/colors/theme';
import AuthService from '../../services/AuthService';

const TwoFactorScreen: React.FC = () => {
  const { themeStyles } = useTheme();

  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);

  const [setupData, setSetupData] = useState<{
    secretKey: string;
    qrCodeUri: string;
    manualEntryKey: string;
    backupCodes: string[];
  } | null>(null);

  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  // load current 2FA status
  useEffect(() => {
    (async () => {
      const res = await AuthService.getTwoFactorStatus();
      if (res.success && res.data) {
        setIsEnabled(res.data.isEnabled);
      }
      setLoading(false);
    })();
  }, []);

  const onToggle = async (value: boolean) => {
    if (value) {
      // start setup
      setLoading(true);
      const res = await AuthService.setupTwoFactor();
      setLoading(false);
      if (res.success && res.data) {
        setSetupData(res.data);
      }
    } else {
      // disable
      setLoading(true);
      const res = await AuthService.disableTwoFactor();
      setLoading(false);
      if (res.success) {
        setIsEnabled(false);
        setSetupData(null);
      }
    }
  };

  const onVerify = async () => {
    if (!code.trim()) return;
    setVerifying(true);
    const res = await AuthService.verifyTwoFactor(code.trim());
    setVerifying(false);
    if (res.success) {
      setIsEnabled(true);
      setSetupData(null);
      setCode('');
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, themeStyles.container]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // if we have setupData, show the QR and code entry
  if (setupData) {
    return (
      <ScrollView contentContainerStyle={[styles.container, themeStyles.container]}>
        <Text style={[styles.title, themeStyles.text]}>Enable Two-Factor</Text>
        <Text style={[styles.helpText, themeStyles.text]}>
          Scan the QR code or enter the key manually into your authenticator app.
        </Text>
        <Image
          source={{ uri: setupData.qrCodeUri }}
          style={styles.qrImage}
        />
        <Text selectable style={[styles.manualKey, themeStyles.text]}>
          {setupData.manualEntryKey}
        </Text>
        <TextInput
          style={[styles.input, themeStyles.card]}
          placeholder="Enter code"
          placeholderTextColor={isDark ? '#888' : '#666'}
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />
        <TouchableOpacity
          style={[styles.button, themeStyles.button]}
          onPress={onVerify}
          disabled={verifying}
        >
          {verifying
            ? <ActivityIndicator color={themeStyles.buttonText.color} />
            : <Text style={[styles.buttonText, themeStyles.buttonText]}>Verify & Enable</Text>}
        </TouchableOpacity>
        <Text style={[styles.backupHeader, themeStyles.text]}>
          Backup codes remaining:
        </Text>
        {setupData.backupCodes.map(code => (
          <Text key={code} style={[styles.backupCode, themeStyles.text]}>
            {code}
          </Text>
        ))}
      </ScrollView>
    );
  }

  // normal status + toggle
  return (
    <ScrollView contentContainerStyle={[styles.container, themeStyles.container]}>
      <Text style={[styles.title, themeStyles.text]}>Two-Factor Authentication</Text>
      <View style={[styles.section, themeStyles.card]}>
        <View style={styles.row}>
          <Text style={[styles.label, themeStyles.text]}>Enabled</Text>
          <Switch
            value={isEnabled}
            onValueChange={onToggle}
          />
        </View>
        <Text style={[styles.helpText, themeStyles.text]}>
          Add an extra layer of security by using a time‑based code from your authenticator app.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 16,
  },
  section: {
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  helpText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  qrImage: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginVertical: 16,
  },
  manualKey: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  backupHeader: {
    marginTop: 20,
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  backupCode: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
});

export default TwoFactorScreen;