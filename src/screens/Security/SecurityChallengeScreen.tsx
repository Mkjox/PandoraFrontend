import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  FlatList,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { darkTheme, lightTheme } from '@assets/colors/theme';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import PasswordService from '@services/PasswordService';
import { isStrongPassword } from '@utils/password';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CustomSpinner from '@components/CustomSpinner';

const { width, height } = Dimensions.get('window');

const SecurityChallengeScreen: React.FC = () => {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

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
      return cnt + (isStrongPassword(p.password) ? 1 : 0);
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
      <CustomSpinner />
    );
  }

  if (passwordsError) {
    return (
      <View style={[theme.styles.container, styles.center]}>
        <Text style={theme.styles.text}>Error: {passwordsError}</Text>
      </View>
    );
  }

  // Now it can list weak passwords, strong passwords, or summary
  // Example: list all weak passwords:
  const weakPasswords = passwords.filter(pw => !isStrongPassword(pw.password));

  const renderItem = ({ item }: { item: typeof passwords[0] }) => (
    <View style={[styles.itemCard, theme.styles.card]}>
      <Text style={[styles.itemTitle, theme.styles.text]}>
        {item.siteName}
      </Text>
      <Text style={[styles.itemSubtitle, theme.styles.textGray]}>
        {item.usernameOrEmail}
      </Text>
      <Text style={[styles.itemNote, theme.styles.text]}>
        {isStrongPassword(item.password) ? 'Strong' : 'Weak'}
      </Text>
    </View>
  );

  return (
    <View style={[theme.styles.container, styles.container]}>
      <View style={styles.headerSection}>
        <Text style={[styles.headerText, theme.styles.text]}>
          Security Challenge ({percentage}%)
        </Text>
        <Text style={[styles.subHeaderText, theme.styles.textGray]}>
          {weakPasswords.length} weak / {passwords.length} total
        </Text>
      </View>

      {passwords.length === 0 ? (
        <View style={styles.center}>
          <Text style={theme.styles.text}>No passwords to evaluate.</Text>
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