import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { darkTheme, lightTheme } from '../../assets/colors/theme';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PasswordService from '../../services/PasswordService';
import { isStrongPassword } from '../../utils/password';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SecurityChallengeScreen: React.FC = () => {
  const { themeStyles } = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const { passwords, loading: passwordsLoading, error: passwordsError } = useAppSelector(s => s.passwords);

  const [percentage, setPercentage] = useState<string>('0.00');

  // Fetch passwords when screen focuses
  useFocusEffect(
    useCallback(() => {
      dispatch(PasswordService.getPasswordsByUser());
    }, [dispatch])
  );

  // Whenever passwords list changes, compute the percentage
  useEffect(() => {
    if (!passwords) {
      setPercentage('0.00');
      return;
    }
    const total = passwords.length;
    if (total === 0) {
      setPercentage('0.00');
      return;
    }
    const strongCount = passwords.reduce((cnt, p) => {
      // Assuming PasswordItem.Password holds the plaintext or decrypted password
      // If it's encrypted on client or not directly accessible, adjust accordingly.
      return cnt + (isStrongPassword(p.Password) ? 1 : 0);
    }, 0);
    const pct = (strongCount / total) * 100;
    // Format to two decimals
    const formatted = pct.toFixed(2);
    setPercentage(formatted);
  }, [passwords]);

  // Update header title (if using React Navigation header) to include percentage
  useLayoutEffect(() => {
    // Ensure navigation.setOptions is available
    navigation.setOptions({
      title: `Security Challenge (${percentage}%)`,
    });
  }, [navigation, percentage]);

  // Optionally, also render percentage inside the screen body:
  // <Text style={styles.headerText}>Security Challenge ({percentage}%)</Text>

  if (passwordsLoading) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (passwordsError) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <Text style={themeStyles.text}>Error: {passwordsError}</Text>
      </View>
    );
  }

  // Now it can list weak passwords, strong passwords, or summary
  // Example: list all weak passwords:
  const weakPasswords = passwords.filter(pw => !isStrongPassword(pw.Password));

  const renderItem = ({ item }: { item: typeof passwords[0] }) => (
    <View style={[styles.itemCard, themeStyles.card]}>
      <Text style={[styles.itemTitle, themeStyles.text]}>
        {item.SiteName}
      </Text>
      <Text style={[styles.itemSubtitle, themeStyles.textGray]}>
        {item.UsernameOrEmail}
      </Text>
      <Text style={[styles.itemNote, themeStyles.text]}>
        {isStrongPassword(item.Password) ? 'Strong' : 'Weak'}
      </Text>
    </View>
  );

  return (
    <View style={[themeStyles.container, styles.container]}>
      <View style={styles.headerSection}>
        <Text style={[styles.headerText, themeStyles.text]}>
          Security Challenge ({percentage}%)
        </Text>
        <Text style={[styles.subHeaderText, themeStyles.textGray]}>
          {weakPasswords.length} weak / {passwords.length} total
        </Text>
      </View>

      {passwords.length === 0 ? (
        <View style={styles.center}>
          <Text style={themeStyles.text}>No passwords to evaluate.</Text>
        </View>
      ) : (
        <FlatList
          data={passwords}
          keyExtractor={p => p.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: StatusBar.currentHeight,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    marginBottom: height * 0.02,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
  },
  subHeaderText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 40,
  },
  itemCard: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 3,
    marginHorizontal: 5,
    marginVertical: 5
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  itemSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 2,
  },
  itemNote: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 6,
  },
});

export default SecurityChallengeScreen;