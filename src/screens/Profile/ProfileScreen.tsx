import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { lightTheme, darkTheme } from '@assets/colors/theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AuthService from '@services/AuthService';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import LogoutButton from '@components/LogoutButton';

const { width } = Dimensions.get('window');

const ProfileScreen: React.FC = () => {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const navigation = useNavigation<any>();

  const [profile, setProfile] = useState<any>(null);

  const avatarSize = 96;

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
          <Image source={{ uri: profile.photoUrl }} style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]} />
        ) : (
          (() => {
            const iconColor = (theme.styles.iconColor && (theme.styles.iconColor as any).color) || '#777';
            const bg = (theme.styles.card && (theme.styles.card as any).backgroundColor) || (isDark ? '#111' : '#f3f4f6');
            const initials = `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase();
            return (
              <View style={[styles.placeholder, { backgroundColor: bg, width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}> 
                {initials.trim().length > 0 ? (
                  <Text style={[styles.initials, { color: theme.styles.text?.color || '#222' }]}>{initials}</Text>
                ) : (
                  <FontAwesome name="user" size={48} color={iconColor} />
                )}
              </View>
            );
          })()
        )}
      </View>

      <View style={[styles.infoGroup, theme.styles.card, theme.styles.border]}>
        <Text style={[styles.infoName, theme.styles.text]}>{profile.firstName} {profile.lastName}</Text>
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

      <Text style={[styles.versionText, theme.styles.text]}>Version 1.0.2</Text>
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
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 28,
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default ProfileScreen;