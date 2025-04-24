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
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../assets/colors/theme';
import AuthService from '../services/AuthService';

const { width } = Dimensions.get('window');

const EditProfileScreen: React.FC = () => {
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    (async () => {
      const res = await AuthService.fetchUserProfile();
      if (res.success && res.userData) {
        setUsername(res.userData.username || '');
        setEmail(res.userData.email || '');
      }
    })();
  }, []);

  const handleSave = () => {
    Alert.alert('Saved', 'Your profile changes have been saved.');
  };

  return (
    <ScrollView style={[styles.container, themeStyles.container]}>
      <View style={styles.spacer} />

      <Text style={[styles.title, themeStyles.text]}>Edit Profile</Text>

      <View style={[styles.avatarCard, themeStyles.card]}>
        <Image
          // source={require('../../assets/images/avatar-placeholder.png')}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.changePhotoButton}>
          <Text style={[styles.changePhotoText, themeStyles.text]}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.fieldCard, themeStyles.card]}>
        <Text style={[styles.label, themeStyles.text]}>Username</Text>
        <TextInput
          style={[styles.input, themeStyles.text]}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor={isDark ? '#888' : '#666'}
        />
      </View>

      <View style={[styles.fieldCard, themeStyles.card]}>
        <Text style={[styles.label, themeStyles.text]}>Email</Text>
        <TextInput
          style={[styles.input, themeStyles.text]}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor={isDark ? '#888' : '#666'}
        />
      </View>

      <TouchableOpacity style={[styles.saveButton, themeStyles.button]} onPress={handleSave}>
        <Text style={[styles.saveButtonText, themeStyles.buttonText]}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  spacer: {
    height: StatusBar.currentHeight || 20
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginHorizontal: width * 0.05,
    marginBottom: 16,
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
  changePhotoButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#888',
  },
  changePhotoText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  fieldCard: {
    marginHorizontal: width * 0.05,
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
    padding: 10
  },
  saveButton: {
    marginHorizontal: width * 0.05,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default EditProfileScreen;