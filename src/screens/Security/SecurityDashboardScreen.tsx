import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  FlatList,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { darkTheme, lightTheme } from '../../assets/colors/theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PasswordService from '../../services/PasswordService';
import PersonalVaultService from '../../services/PersonalVaultService';
import CategoryService from '../../services/CategoryService';
import ErrorDisplay from '../../components/ErrorDisplay';
import { PasswordItem } from '../../types/password.types';
import { MaterialIcons, Entypo } from '@expo/vector-icons';

// // Replace or import your actual password-strength check function
// function isStrongPassword(pw: string): boolean {
//   // Example: length>=12, has upper, lower, number, special
//   let score = 0;
//   if (pw.length >= 12) score++;
//   if (/[A-Z]/.test(pw)) score++;
//   if (/[a-z]/.test(pw)) score++;
//   if (/[0-9]/.test(pw)) score++;
//   if (/[^A-Za-z0-9]/.test(pw)) score++;
//   return score >= 4;
// }

// Classify strength
function getStrengthLabel(pw: string): 'Weak' | 'Medium' | 'Strong' {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return 'Weak';
  if (score <= 3) return 'Medium';
  return 'Strong';
}

const { width, height } = Dimensions.get('window');

const SecurityDashboardScreen: React.FC = () => {
  const { themeStyles, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const {
    passwords,
    loading: pwdLoading,
    error: pwdError,
  } = useAppSelector(s => s.passwords);
  const {
    vaults,
    loading: vaultLoading,
    error: vaultError,
  } = useAppSelector(s => s.vault);
  const {
    categories,
    loading: catLoading,
    error: catError,
  } = useAppSelector(s => s.category);

  // const [twoFAEnabled, setTwoFAEnabled] = useState<boolean>(false);
  // const [toggling2FA, setToggling2FA] = useState<boolean>(false);

  // Refresh data when screen focuses
  useFocusEffect(
    useCallback(() => {
      dispatch(PasswordService.getPasswordsByUser());
      dispatch(PersonalVaultService.getPersonalVaults());
      dispatch(CategoryService.getCategoriesByUser());
    }, [dispatch])
  );

  // Compute strength counts
  const strengthCounts = useMemo(() => {
    const weakList: PasswordItem[] = [];
    const mediumList: PasswordItem[] = [];
    const strongList: PasswordItem[] = [];
    passwords.forEach(p => {
      const label = getStrengthLabel(p.password);
      if (label === 'Weak') weakList.push(p);
      else if (label === 'Medium') mediumList.push(p);
      else strongList.push(p);
    });
    return {
      Weak: weakList,
      Medium: mediumList,
      Strong: strongList,
    };
  }, [passwords]);

  // Compute upcoming expirations: within next 7 days
  const upcomingExpirations = useMemo(() => {
    const now = new Date();
    const in7 = new Date();
    in7.setDate(now.getDate() + 7);
    return passwords.filter(p => {
      if (!p.passwordExpirationDate) return false;
      const exp = new Date(p.passwordExpirationDate);
      return exp >= now && exp <= in7;
    });
  }, [passwords]);

  // Compute security score: percentage of strong passwords
  const securityScore = useMemo(() => {
    if (passwords.length === 0) return '0.00';
    const strongCount = strengthCounts.Strong.length;
    return ((strongCount / passwords.length) * 100).toFixed(2);
  }, [passwords, strengthCounts]);

  // const handleToggle2FA = async (val: boolean) => {
  //   setToggling2FA(true);
  //   try {
  //     // TODO: call API to enable/disable 2FA
  //     // e.g. await AuthService.setTwoFactor(val);
  //     setTwoFAEnabled(val);
  //   } catch (err) {
  //     Alert.alert('Error', 'Could not update Two-Factor setting.');
  //   } finally {
  //     setToggling2FA(false);
  //   }
  // };

  if (pwdLoading || vaultLoading || catLoading) {
    return (
      <View style={[styles.center, themeStyles.container]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (pwdError || vaultError || catError) {
    return (
      <View style={[styles.center, themeStyles.container]}>
        <ErrorDisplay message={pwdError || vaultError || catError!} />
      </View>
    );
  }

  // Render a single weak password item
  const renderWeakItem = ({ item }: { item: PasswordItem }) => (
    <TouchableOpacity
      style={[styles.listItem, themeStyles.card, themeStyles.border, themeStyles.card, themeStyles.border]}
      onPress={() =>
        navigation.navigate('PassDetails' as never, { id: item.id } as any)
      }
    >
      <View style={styles.listIcon}>
        <Entypo name="warning" size={20} color={isDark ? '#FFC107' : '#D32F2F'} />
      </View>
      <View style={styles.listTextContainer}>
        <Text style={[styles.listTitle, themeStyles.text]} numberOfLines={1}>
          {item.siteName}
        </Text>
        <Text style={[styles.listSubtitle, themeStyles.textGray]} numberOfLines={1}>
          {item.usernameOrEmail}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Render upcoming expiration item
  const renderExpItem = ({ item }: { item: PasswordItem }) => (
    <TouchableOpacity
      style={[styles.listItem, themeStyles.card, themeStyles.border]}
      onPress={() =>
        navigation.navigate('PassDetails' as never, { id: item.id } as any)
      }
    >
      <View style={styles.listIcon}>
        <MaterialIcons name="schedule" size={20} color={themeStyles.icon.color} />
      </View>
      <View style={styles.listTextContainer}>
        <Text style={[styles.listTitle, themeStyles.text]} numberOfLines={1}>
          {item.siteName}
        </Text>
        <Text style={[styles.listSubtitle, themeStyles.textGray]} numberOfLines={1}>
          Expires on {new Date(item.passwordExpirationDate!).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, themeStyles.container]}>
      <Text style={[styles.header, themeStyles.text]}>Security Dashboard</Text>

      {/* Summary Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, themeStyles.card, themeStyles.border]}>
          <Text style={[styles.statLabel, themeStyles.text]}>Total Passwords</Text>
          <Text style={[styles.statValue, themeStyles.text]}>{passwords.length}</Text>
        </View>
        <View style={[styles.statCard, themeStyles.card, themeStyles.border]}>
          <Text style={[styles.statLabel, themeStyles.text]}>Strong</Text>
          <Text style={[styles.statValue, themeStyles.text]}>
            {strengthCounts.Strong.length}
          </Text>
        </View>
        <View style={[styles.statCard, themeStyles.card, themeStyles.border]}>
          <Text style={[styles.statLabel, themeStyles.text]}>Medium</Text>
          <Text style={[styles.statValue, themeStyles.text]}>
            {strengthCounts.Medium.length}
          </Text>
        </View>
        <View style={[styles.statCard, themeStyles.card, themeStyles.border]}>
          <Text style={[styles.statLabel, themeStyles.text]}>Weak</Text>
          <Text style={[styles.statValue, themeStyles.text]}>
            {strengthCounts.Weak.length}
          </Text>
        </View>
        <View style={[styles.statCard, themeStyles.card, themeStyles.border]}>
          <Text style={[styles.statLabel, themeStyles.text]}>Score (%)</Text>
          <Text style={[styles.statValue, themeStyles.text]}>{securityScore}</Text>
        </View>
        <View style={[styles.statCard, themeStyles.card, themeStyles.border]}>
          <Text style={[styles.statLabel, themeStyles.text]}>Vaults</Text>
          <Text style={[styles.statValue, themeStyles.text]}>{vaults.length}</Text>
        </View>
        <View style={[styles.statCard, themeStyles.card, themeStyles.border]}>
          <Text style={[styles.statLabel, themeStyles.text]}>Categories</Text>
          <Text style={[styles.statValue, themeStyles.text]}>{categories.length}</Text>
        </View>
      </View>

      {/* Recommendations / Actions */}
      <View style={[styles.section, themeStyles.card, themeStyles.border]}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Recommendations</Text>
        {strengthCounts.Weak.length > 0 ? (
          <Text style={[styles.recommendationText, themeStyles.text]}>
            You have {strengthCounts.Weak.length} weak password
            {strengthCounts.Weak.length > 1 ? 's' : ''}. Consider updating them.
          </Text>
        ) : (
          <Text style={[styles.recommendationText, themeStyles.text]}>
            Great! No weak passwords found.
          </Text>
        )}
        {upcomingExpirations.length > 0 ? (
          <Text style={[styles.recommendationText, themeStyles.text]}>
            {upcomingExpirations.length} password
            {upcomingExpirations.length > 1 ? 's are' : ' is'} expiring soon.
          </Text>
        ) : (
          <Text style={[styles.recommendationText, themeStyles.text]}>
            No passwords expiring within 7 days.
          </Text>
        )}
      </View>

      {/* Two-Factor Toggle */}
      {/* <View style={[styles.section, themeStyles.card, themeStyles.border]}> */}
      {/* <Text style={[styles.sectionTitle, themeStyles.text]}>
          Two-Factor Authentication
        </Text>
        <View style={styles.switchRow}>
          <Switch
            value={twoFAEnabled}
            onValueChange={handleToggle2FA}
            disabled={toggling2FA}
          />
          <Text style={[styles.switchText, themeStyles.text]}>
            {twoFAEnabled ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
      </View> */}

      {/* Weak Passwords List */}
      {strengthCounts.Weak.length > 0 && (
        <View style={styles.listSection}>
          <Text style={[styles.listHeader, themeStyles.text]}>Weak Passwords</Text>
          <FlatList
            data={strengthCounts.Weak}
            keyExtractor={item => item.id}
            renderItem={renderWeakItem}
            horizontal={false}
            scrollEnabled={false}
            contentContainerStyle={[styles.listContainer, themeStyles.card]}
          />
          <TouchableOpacity
            style={[styles.actionButton, themeStyles.button]}
            onPress={() => navigation.navigate('SecurityChallenge' as never)}
          >
            <Text style={[styles.actionText, themeStyles.buttonText]}>
              Review Passwords
            </Text>
            {/* <Text style={[styles.actionText, themeStyles.buttonText]}>
              Review Weak Passwords
            </Text> */}
          </TouchableOpacity>
        </View>
      )}

      {/* Upcoming Expirations List */}
      {upcomingExpirations.length > 0 && (
        <View style={styles.listSection}>
          <Text style={[styles.listHeader, themeStyles.text]}>
            Expiring Soon
          </Text>
          <FlatList
            data={upcomingExpirations}
            keyExtractor={item => item.id}
            renderItem={renderExpItem}
            horizontal={false}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}

      {/* Quick Actions */}
      {/* <View style={[styles.section, themeStyles.card, themeStyles.border]}>
        <Text style={[styles.sectionTitle, themeStyles.text]}>Quick Actions</Text>
        <TouchableOpacity
          style={[styles.actionButton, themeStyles.button]}
          onPress={() => navigation.navigate('Settings' as never)}
        >
          <Text style={[styles.actionText, themeStyles.buttonText]}>
            App Settings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, themeStyles.button]}
          onPress={() => navigation.navigate('TwoFactor' as never)}
        >
          <Text style={[styles.actionText, themeStyles.buttonText]}>
            Two-Factor Settings
          </Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: width * 0.06,
    backgroundColor: 'transparent',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 1,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    marginTop: 4,
  },
  section: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    elevation: 1,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  listSection: {
    marginBottom: 24,
  },
  listHeader: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 8,
  },
  listContainer: {
    // if scrollEnabled false, contentContainerStyle helps layout,
    padding: 5
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    borderWidth: 1,
  },
  listIcon: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  listTextContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  listSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 2,
  },
  actionButton: {
    marginVertical: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  actionText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default SecurityDashboardScreen;
