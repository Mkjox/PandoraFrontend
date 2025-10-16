import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
  Platform,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { lightTheme, darkTheme } from '@assets/colors/theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AuthService from '@services/AuthService';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch } from '@redux/hooks';
import { logout as logoutAction } from '@redux/store/slices/authSlice';
import LogoutButton from '@components/LogoutButton';

const { width } = Dimensions.get('window');

const ProfileScreen: React.FC = () => {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  const [profile, setProfile] = useState<any>(null);

  const loadProfile = useCallback(async () => {
    const res = await AuthService.fetchUserProfile();
    if (res.success) {
      setProfile(res.userData);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadProfile(); }, [loadProfile]));

  if (!profile) {
    return (
      <View style={[theme.styles.container, styles.center]}>
        <Text style={theme.styles.text}>Loading profile…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, theme.styles.container]}>
      <View style={styles.spacer} />

      <Text style={[styles.title, theme.styles.text]}>My Profile</Text>

      <View style={[styles.avatarGroup, theme.styles.card]}>
        {profile.photoUrl ? (
          <Image source={{ uri: profile.photoUrl }} style={styles.avatar} />
        ) : (
          <FontAwesome name="user-circle" size={96} color={theme.styles.iconColor.color} />
        )}
      </View>

      <View style={[styles.infoGroup, theme.styles.card, theme.styles.border]}>
        <Text style={[styles.infoName, theme.styles.text]}>{profile.username}</Text>
        <Text style={[styles.infoEmail, theme.styles.text]}>{profile.email}</Text>
        {profile.lastLogin && (
          <Text style={[styles.infoSub, theme.styles.text]}>
            Last login: {new Date(profile.lastLogin).toLocaleString()}
          </Text>
        )}
      </View>

      <View style={[styles.statsGroup, theme.styles.card, theme.styles.border]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, theme.styles.text]}>{profile.passwordCount ?? 0}</Text>
          <Text style={[styles.statLabel, theme.styles.text]}>Passwords</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, theme.styles.text]}>{profile.vaultCount ?? 0}</Text>
          <Text style={[styles.statLabel, theme.styles.text]}>Vaults</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, theme.styles.text]}>{profile.categoryCount ?? 0}</Text>
          <Text style={[styles.statLabel, theme.styles.text]}>Categories</Text>
        </View>
      </View>

      <View style={[styles.linksGroup, theme.styles.card, theme.styles.border]}>

        <Pressable
          onPress={() => navigation.navigate('EditProfile' as never)}
          style={({ pressed }) => [
            styles.linkRow,
            pressed && { opacity: Platform.OS === 'ios' ? 0.6 : 1 }
          ]}
          android_ripple={isDark ? { color: 'rgba(255, 255, 255, 0.06)' } : { color: 'rgba(0,0,0, 0.06)', borderless: false }}
        >
          <MaterialIcons name="edit" size={20} style={theme.styles.iconColor} />
          <Text style={[styles.linkText, theme.styles.text]}>Edit Profile</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('ThemeScreen' as never)}
          style={({ pressed }) => [
            styles.linkRow,
            pressed && { opacity: Platform.OS === 'ios' ? 0.6 : 1 }
          ]}
          android_ripple={isDark ? { color: 'rgba(255, 255, 255, 0.06)' } : { color: 'rgba(0,0,0, 0.06)', borderless: false }}
        >
          <MaterialIcons name="dark-mode" size={20} style={theme.styles.iconColor} />
          <Text style={[styles.linkText, theme.styles.text]}>Theme</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Settings' as never)}
          style={({ pressed }) => [
            styles.linkRow,
            pressed && { opacity: Platform.OS === 'ios' ? 0.6 : 1 }
          ]}
          android_ripple={isDark ? { color: 'rgba(255, 255, 255, 0.06)' } : { color: 'rgba(0,0,0, 0.06)', borderless: false }}
        >
          <MaterialIcons name="settings" size={20} style={theme.styles.iconColor} />
          <Text style={[styles.linkText, theme.styles.text]}>Settings</Text>
        </Pressable>

        <LogoutButton />

      </View>

      <Text style={[styles.versionText, theme.styles.text]}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
  avatarGroup: {
    alignSelf: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  infoGroup: {
    marginHorizontal: width * 0.05,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2
  },
  infoName: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  infoEmail: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 4,
  },
  infoSub: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#888',
  },
  statsGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#888',
  },
  linksGroup: {
    marginHorizontal: width * 0.05,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginVertical: 2,
    paddingHorizontal: 10
  },
  linkText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    marginLeft: 12,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#888',
    marginBottom: 20,
  },
});

export default ProfileScreen;