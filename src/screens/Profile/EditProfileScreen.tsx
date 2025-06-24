import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../assets/colors/theme';
import AuthService from '../../services/AuthService';
import ImagePickerButton from '../../components/ImagePickerButton';
import { ServiceResult } from '../../types/service.types';
import CustomButton from '../../components/CustomButton';

const { width } = Dimensions.get('window');

export default function EditProfileScreen() {
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  // serverMessage used for both success and error; we differentiate via prefix or usage

  useEffect(() => {
    (async () => {
      setLoadingProfile(true);
      try {
        const res = await AuthService.fetchUserProfile();
        if (res.success && res.userData) {
          setUsername(res.userData.username || '');
          setEmail(res.userData.email || '');
          if (res.userData.photoUrl) {
            setImageUri(res.userData.photoUrl);
          }
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

  const handleImagePicked = (base64: string) => {
    setImageBase64(base64);
    // preview: data URI
    setImageUri(`data:image/jpeg;base64,${base64}`);
    setServerMessage(null);
  };

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
    if (!validateFields()) {
      return;
    }
    setSaving(true);
    setServerMessage(null);
    try {
      const payload: any = {
        username: username.trim(),
        email: email.trim(),
      };
      if (imageBase64) {
        payload.photoBase64 = imageBase64;
      }
      const res: ServiceResult<{ username: string; email: string; photoUrl?: string }> =
        await AuthService.updateProfile(payload);
      if (res.success && res.data) {
        setUsername(res.data.username);
        setEmail(res.data.email);
        if (res.data.photoUrl) {
          setImageUri(res.data.photoUrl);
          setImageBase64(null);
        }
        setServerMessage('Profile updated successfully.');
      } else {
        setServerMessage(res.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      setServerMessage(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingProfile) {
    return (
      <View style={[styles.loaderContainer, themeStyles.container]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, themeStyles.container]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.spacer} />

      <Text style={[styles.title, themeStyles.text]}>Edit Profile</Text>

      <View style={[styles.avatarCard, themeStyles.card]}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, themeStyles.card]}>
            <Text style={[styles.avatarPlaceholderText, themeStyles.textGray]}>No Photo</Text>
          </View>
        )}
        <ImagePickerButton
          title="Change Photo"
          onImagePicked={handleImagePicked}
          style={styles.changePhotoButton}
          textStyle={styles.changePhotoText}
        />
      </View>

      {/* Show serverMessage if success */}
      {serverMessage && serverMessage.startsWith('Profile updated') ? (
        <Text style={styles.successText}>{serverMessage}</Text>
      ) : null}

      <View style={[styles.fieldCard, themeStyles.card]}>
        <Text style={[styles.label, themeStyles.text]}>Username</Text>
        <TextInput
          style={[
            styles.input,
            themeStyles.text,
            usernameError ? styles.inputError : null,
          ]}
          value={username}
          onChangeText={text => {
            setUsername(text);
            if (usernameError) setUsernameError(null);
            if (serverMessage) setServerMessage(null);
          }}
          placeholder="Username"
          placeholderTextColor={isDark ? '#888' : '#666'}
        />
        {usernameError ? (
          <Text style={styles.errorText}>{usernameError}</Text>
        ) : null}
      </View>

      <View style={[styles.fieldCard, themeStyles.card]}>
        <Text style={[styles.label, themeStyles.text]}>Email</Text>
        <TextInput
          style={[
            styles.input,
            themeStyles.text,
            emailError ? styles.inputError : null,
          ]}
          value={email}
          onChangeText={text => {
            setEmail(text);
            if (emailError) setEmailError(null);
            if (serverMessage) setServerMessage(null);
          }}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor={isDark ? '#888' : '#666'}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      {/* Show serverMessage if error */}
      {serverMessage && !serverMessage.startsWith('Profile updated') ? (
        <Text style={[styles.errorText, { textAlign: 'center' }]}>{serverMessage}</Text>
      ) : null}

      <CustomButton
        title='Save Changes'
        onPress={handleSave}
        loading={saving}
        style={[styles.saveButton, themeStyles.buttonBorder]}
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
    textAlign: 'center',
  },
  avatarCard: {
    alignSelf: 'center',
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholderText: {
    fontSize: 14,
  },
  changePhotoButton: {
    borderRadius: 6,
    paddingVertical: 6,
    marginTop: 8,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  changePhotoText: {
    fontSize: 14,
  },
  fieldCard: {
    marginBottom: 16,
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
    borderWidth: 1,
    borderColor: '#ccc',
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
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal: width * 0.03
  },
});