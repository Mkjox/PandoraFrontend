import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { darkTheme, lightTheme } from '../assets/colors/theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AuthService from '../services/AuthService';

const ProfileScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [UsernameOrEmail, setUsernameOrEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profileData, setProfileData] = useState<any>(null);

  const navigation: any = useNavigation();
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  const handleLogin = async () => {
    const result = await AuthService.login({ UsernameOrEmail, Password });

    if (result.success) {
      setModalVisible(false);
      setErrorMessage('');
      await loadProfile(); // refresh user info after login
    } else {
      setErrorMessage(result.message);
    }
  };

  const loadProfile = async () => {
    try {
      const result = await AuthService.fetchUserProfile();
      if (result?.success) {
        setProfileData(result.userData);
      }
    } catch (error: unknown) {
      console.error("Profile loading failed:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, themeStyles.container]}>
      <View style={styles.header}>
        {profileData ? (
          <View style={styles.userInfoWrapper}>
            <FontAwesome name="user-circle" size={80} color="#6E7FEC" />
            <Text style={styles.name}>{profileData.username}</Text>
            <Text style={styles.email}>{profileData.email}</Text>
          </View>
        ) : (
          <Text>Loading profile...</Text>
        )}
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.option}>
          <MaterialIcons name="edit" size={24} style={themeStyles.iconColor} />
          <Text style={styles.optionText}>Edit Profile</Text>
          <Entypo name="chevron-right" size={24} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <MaterialIcons name="lock" size={24} style={themeStyles.iconColor} />
          <Text style={styles.optionText}>Change Password</Text>
          <Entypo name="chevron-right" size={24} />
        </TouchableOpacity>

        <View style={styles.option}>
          <MaterialIcons name="shield" size={24} style={themeStyles.iconColor} />
          <Text style={styles.optionText}>Two-Factor Authentication</Text>
          <Entypo name="chevron-right" size={24} />
        </View>

        <View style={styles.option}>
          <MaterialIcons name="nightlight-round" size={24} style={themeStyles.iconColor} />
          <Text style={styles.optionText}>Dark Mode</Text>
          <Entypo name="chevron-right" size={24} />
        </View>

        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Settings')}>
          <FontAwesome name="gear" size={24} style={themeStyles.iconColor} />
          <Text style={styles.optionText}>Settings</Text>
          <Entypo name="chevron-right" size={24} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => setModalVisible(true)}>
          <FontAwesome name="sign-in" size={24} style={themeStyles.iconColor} />
          <Text style={styles.optionText}>Login</Text>
          <Entypo name="chevron-right" size={24} />
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Login</Text>

              <TextInput
                style={styles.input}
                placeholder="Username or Email"
                value={UsernameOrEmail}
                onChangeText={setUsernameOrEmail}
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={Password}
                onChangeText={setPassword}
              />

              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

              <Button title="Submit" onPress={handleLogin} />
              <View style={{ marginVertical: 5 }} />
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.option} onPress={AuthService.logout}>
          <FontAwesome name="sign-out" size={24} style={themeStyles.iconColor} />
          <Text style={styles.optionText}>Logout</Text>
          <Entypo name="chevron-right" size={24} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: StatusBar.currentHeight,
  },
  userInfoWrapper: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 10,
    textTransform: 'capitalize',
  },
  email: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: '#4F4F4F',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default ProfileScreen;
