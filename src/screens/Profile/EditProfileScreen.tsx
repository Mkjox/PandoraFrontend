import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { lightTheme, darkTheme } from '@assets/colors/theme';
import AuthService from '@services/AuthService';
import CustomButton from '@components/CustomButton';
import Toast from 'react-native-toast-message';

const { height, width } = Dimensions.get('window');

export default function EditProfileScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastLoginDate, setLastLoginDate] = useState('');

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoadingProfile(true);
      try {
        const res = await AuthService.fetchUserProfile();
        if (res.success && res.userData) {
          const u = res.userData;
          setUsername(u.username || '');
          setEmail(u.email || '');
          setPhoneNumber(u.phoneNumber || '');
          setFirstName(u.firstName || '');
          setLastName(u.lastName || '');
          setLastLoginDate(u.lastLoginDate || new Date().toISOString());
        } else {
          setServerMessage(res.message || 'Failed to load profile');
        }
      } catch {
        setServerMessage('Failed to load profile');
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, []);

  const validateFields = (): boolean => {
    let valid = true;

    if (!username.trim()) {
      setUsernameError('Username is required.');
      valid = false;
    } else {
      setUsernameError(null);
    }

    if (!email.trim()) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Email format is invalid.');
      valid = false;
    } else {
      setEmailError(null);
    }

    return valid;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    setSaving(true);
    setServerMessage(null);

    try {
      const payload = {
        username: username.trim(),
        email: email.trim(),

        phoneNumber: phoneNumber,
        firstName: firstName,
        lastName: lastName,
        lastLoginDate: lastLoginDate
      };

      const res = await AuthService.updateProfile(payload);

      if (res.success) {
        Toast.show({
          type: 'success',
          text1: 'Profile updated successfully',
        })
      } else {
        Toast.show({
          type: 'error',
          text1: 'Update failed',
          text2: res.message || 'Failed to update profile.'
        })
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: err.message || 'Failed to update profile.'
      })
    } finally {
      setSaving(false);
    }
  };

  if (loadingProfile) {
    return (
      <View style={[styles.loaderContainer, theme.styles.container]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, theme.styles.container]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.spacer} />
      <Text style={[styles.title, theme.styles.text]}>Edit Profile</Text>

      <View style={[styles.fieldCard]}>
        <Text style={[styles.label, theme.styles.text]}>Username</Text>
        <TextInput
          style={[
            styles.input,
            theme.styles.text,
            theme.styles.border,
            usernameError ? styles.inputError : null,
          ]}
          value={username}
          onChangeText={text => {
            setUsername(text);
            setUsernameError(null);
            setServerMessage(null);
          }}
        />
        {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
      </View>

      <View style={[styles.fieldCard]}>
        <Text style={[styles.label, theme.styles.text]}>Email</Text>
        <TextInput
          style={[
            styles.input,
            theme.styles.text,
            theme.styles.border,
            emailError ? styles.inputError : null,
          ]}
          value={email}
          onChangeText={text => {
            setEmail(text);
            setEmailError(null);
            setServerMessage(null);
          }}
          keyboardType="email-address"
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}
      </View>

      <View style={[styles.fieldCard]}>
        <Text style={[styles.label, theme.styles.text]}>First Name</Text>
        <TextInput
          style={[
            styles.input,
            theme.styles.text,
            theme.styles.border,
          ]}
          value={firstName}
          onChangeText={text => {
            setFirstName(text);
            setServerMessage(null);
          }}
          placeholder="First Name"
          placeholderTextColor={isDark ? '#888' : '#666'}
        />
      </View>

      <View style={[styles.fieldCard]}>
        <Text style={[styles.label, theme.styles.text]}>Last Name</Text>
        <TextInput
          style={[
            styles.input,
            theme.styles.text,
            theme.styles.border,
          ]}
          value={lastName}
          onChangeText={text => {
            setLastName(text);
            setServerMessage(null);
          }}
          placeholder="Last Name"
          placeholderTextColor={isDark ? '#888' : '#666'}
        />
      </View>

      <View style={[styles.fieldCard]}>
        <Text style={[styles.label, theme.styles.text]}>Phone Number</Text>
        <TextInput
          style={[
            styles.input,
            theme.styles.text,
            theme.styles.border,
          ]}
          value={phoneNumber}
          onChangeText={text => {
            setPhoneNumber(text);
            setServerMessage(null);
          }}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          placeholderTextColor={isDark ? '#888' : '#666'}
        />
      </View>

      {serverMessage && !serverMessage.startsWith('Profile updated') ? (
        <Text style={[styles.errorText, { textAlign: 'center' }]}>{serverMessage}</Text>
      ) : null}

      <View style={styles.fieldCard}>
        <Text style={[theme.styles.textGray, { marginBottom: 12 }]}>
          Note: These informations are only visible to you
        </Text>
      </View>

      <CustomButton
        title="Save Changes"
        onPress={handleSave}
        loading={saving}
        style={[styles.saveButton, theme.styles.button]}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: 0,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    height: StatusBar.currentHeight || 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginVertical: 16,
  },
  fieldCard: {
    padding: 12,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 6,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    borderRadius: 10,
    padding: 10,
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
    fontFamily: 'Poppins_400Regular',
  },
  successText: {
    color: '#388E3C',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
  },
  saveButton: {
    height: height * 0.06,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
