import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { darkTheme, lightTheme } from '../assets/colors/theme';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen: React.FC = () => {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const navigation: any = useNavigation();
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  // const handleEditProfile = () => {
  //   Alert.alert('Edit Profile', 'This will redirect to the edit profile screen.');
  // };

  // const handleChangePassword = () => {
  //   Alert.alert('Change Password', 'This will redirect to the change password screen.');
  // };

  // const handleLogout = () => {
  //   Alert.alert('Logout', 'Are you sure you want to log out?', [
  //     { text: 'Cancel', style: 'cancel' },
  //     { text: 'Logout', style: 'destructive' },
  //   ]);
  // };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* User Information Section */}
      <View style={styles.header}>
        <FontAwesome name="user-circle" size={80} color="#6E7FEC" />
        <Text style={styles.name}>Username</Text>
        <Text style={styles.email}>Email</Text>
      </View>

      {/* Profile Actions */}
      <View style={styles.section}>
        {/* <TouchableOpacity style={styles.option} onPress={handleEditProfile}> */}
        <TouchableOpacity style={styles.option}>
          <MaterialIcons name="edit" size={24} style={themeStyles.iconColor} />
          <Text style={styles.optionText}>Edit Profile</Text>
          <Entypo name='chevron-right' size={24} />
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.option} onPress={handleChangePassword} >  */}
        <TouchableOpacity style={styles.option}>
          <MaterialIcons name="lock" size={24} style={themeStyles.iconColor} />
          <Text style={styles.optionText}>Change Password</Text>
          <Entypo name='chevron-right' size={24} />
        </TouchableOpacity>

        {/* Security Settings */}
        <View style={styles.option}>
          <MaterialIcons name="shield" size={24} style={themeStyles.iconColor} />
          <Text style={styles.optionText}>Two-Factor Authentication</Text>
          <Entypo name='chevron-right' size={24} />
        </View>

        <View style={styles.option}>
          <MaterialIcons name="nightlight-round" size={24} style={themeStyles.iconColor} />
          <Text style={styles.optionText}>Dark Mode</Text>
          <Entypo name='chevron-right' size={24} />
        </View>

        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Settings')}>
          <FontAwesome name='gear' size={24} style={themeStyles.iconColor} />
          <Text style={styles.optionText}>Settings</Text>
          <Entypo name='chevron-right' size={24} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      {/* <TouchableOpacity style={[themeStyles.button, styles.logoutButton]}>
        <Text style={[themeStyles.buttonText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity> */}
    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: StatusBar.currentHeight
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 10,
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
});

export default ProfileScreen;
