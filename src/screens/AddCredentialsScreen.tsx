import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { darkTheme, lightTheme } from '../assets/colors/theme';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import AuthService from '../services/AuthService';
import PasswordService from '../services/PasswordService';
import CategoryService from '../services/CategoryService';
import PersonalVaultService from '../services/PersonalVaultService';
import { Category } from '../types/category.types';
import { ServiceResult } from '../types/service.types';
import { PasswordPayload } from '../types/password.types';
import { PersonalVaultPayload } from '../types/personalVault.types';
import { CategoryPayload } from '../types/category.types';

const AddCredentialsScreen: React.FC = () => {
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const { categories, loading: loadingCategories, error: categoriesError } =
    useAppSelector((s) => s.category);

  const [selectedTab, setSelectedTab] = useState<'password' | 'vault' | 'category'>('password');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    SiteName: '',
    UsernameOrEmail: '',
    Password: '',
    PasswordRepeat: '',
    Notes: '',
    PasswordExpirationDate: '',
    CategoryId: '',
    Title: '',
    Content: '',
    Url: '',
    MediaFile: '',
    Summary: '',
    Tags: '',
    IsLocked: false,
    UnlockDate: '',
    ExpirationDate: '',
    IsFavorite: false,
    Name: '',
    Description: '',
  });

  // decode token → userId
  useEffect(() => {
    (async () => {
      const decoded = await AuthService.decodeToken();
      if (decoded?.nameid) {
        setUserId(decoded.nameid);
      } else {
        Alert.alert('Error', 'Please log in again.');
        navigation.goBack();
      }
      setLoadingUser(false);
    })();
  }, [navigation]);

  // fetch categories when userId known
  useEffect(() => {
    if (!loadingUser && userId) {
      dispatch(CategoryService.getCategoriesByUser());
    }
  }, [dispatch, loadingUser, userId]);

  const handleChange = (key: string, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = useCallback(async () => {
    if (!userId) return;
    setSubmitting(true);

    try {
      if (selectedTab === 'password') {
        const payload: PasswordPayload = {
          UserId: userId,
          SiteName: form.SiteName,
          UsernameOrEmail: form.UsernameOrEmail,
          Password: form.Password,
          PasswordRepeat: form.PasswordRepeat,
          Notes: form.Notes,
          PasswordExpirationDate: form.PasswordExpirationDate
            ? new Date(form.PasswordExpirationDate).toISOString()
            : undefined,
          CategoryId: form.CategoryId,
        };
        const res = (await dispatch(
          PasswordService.createPassword(payload)
        )) as ServiceResult<any>;
        if (!res.success) throw new Error(res.message);
        Alert.alert('Success', 'Password added.');
      }

      if (selectedTab === 'vault') {
        const payload: PersonalVaultPayload = {
          UserId: userId,
          Title: form.Title,
          Content: form.Content,
          Url: form.Url,
          MediaFile: form.MediaFile,
          Summary: form.Summary,
          Tags: form.Tags.split(',').map((t) => t.trim()),
          IsLocked: form.IsLocked,
          UnlockDate: form.UnlockDate
            ? new Date(form.UnlockDate).toISOString()
            : undefined,
          CategoryId: form.CategoryId,
          ExpirationDate: form.ExpirationDate
            ? new Date(form.ExpirationDate).toISOString()
            : undefined,
          IsFavorite: form.IsFavorite,
        };
        const res = (await dispatch(
          PersonalVaultService.createVault(payload)
        )) as ServiceResult<any>;
        if (!res.success) throw new Error(res.message);
        Alert.alert('Success', 'Vault entry added.');
      }

      if (selectedTab === 'category') {
        const payload: CategoryPayload = {
          UserId: userId,
          name: form.Name,
          description: form.Description,
        };
        const res = (await dispatch(
          CategoryService.createCategory(payload)
        )) as ServiceResult<any>;
        if (!res.success) throw new Error(res.message);
        Alert.alert('Success', 'Category created.');
      }

      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }, [dispatch, form, navigation, selectedTab, userId]);

  if (loadingUser || (loadingCategories && selectedTab !== 'category')) {
    return (
      <View style={[styles.loader, themeStyles.container]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (categoriesError) {
    return (
      <View style={[styles.loader, themeStyles.container]}>
        <Text style={themeStyles.text}>{categoriesError}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[themeStyles.container, styles.container]}>
      <View style={styles.tabContainer}>
        {(['password', 'vault', 'category'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}>
            <Text style={styles.tabText}>
              {tab === 'password'
                ? 'Password'
                : tab === 'vault'
                ? 'Vault'
                : 'Category'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.formContainer}>
        {selectedTab === 'password' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Site Name*"
              value={form.SiteName}
              onChangeText={(v) => handleChange('SiteName', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Username or Email*"
              value={form.UsernameOrEmail}
              onChangeText={(v) => handleChange('UsernameOrEmail', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password*"
              secureTextEntry
              value={form.Password}
              onChangeText={(v) => handleChange('Password', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Repeat Password*"
              secureTextEntry
              value={form.PasswordRepeat}
              onChangeText={(v) => handleChange('PasswordRepeat', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Notes"
              value={form.Notes}
              onChangeText={(v) => handleChange('Notes', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Expiration Date (YYYY-MM-DD)"
              value={form.PasswordExpirationDate}
              onChangeText={(v) => handleChange('PasswordExpirationDate', v)}
            />

            <Text style={styles.label}>Category*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.CategoryId}
                onValueChange={(v) => handleChange('CategoryId', v)}>
                <Picker.Item label="Select category..." value="" />
                {categories.map((c) => (
                  <Picker.Item key={c.id} label={c.name} value={c.id} />
                ))}
              </Picker>
            </View>
          </>
        )}

        {selectedTab === 'vault' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Title*"
              value={form.Title}
              onChangeText={(v) => handleChange('Title', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Content*"
              value={form.Content}
              onChangeText={(v) => handleChange('Content', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="URL"
              value={form.Url}
              onChangeText={(v) => handleChange('Url', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Media File"
              value={form.MediaFile}
              onChangeText={(v) => handleChange('MediaFile', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Summary"
              value={form.Summary}
              onChangeText={(v) => handleChange('Summary', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Tags (comma separated)"
              value={form.Tags}
              onChangeText={(v) => handleChange('Tags', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Unlock Date (YYYY-MM-DD)"
              value={form.UnlockDate}
              onChangeText={(v) => handleChange('UnlockDate', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Expiration Date (YYYY-MM-DD)"
              value={form.ExpirationDate}
              onChangeText={(v) => handleChange('ExpirationDate', v)}
            />

            <Text style={styles.label}>Category*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.CategoryId}
                onValueChange={(v) => handleChange('CategoryId', v)}>
                <Picker.Item label="Select category..." value="" />
                {categories.map((c) => (
                  <Picker.Item key={c.id} label={c.name} value={c.id} />
                ))}
              </Picker>
            </View>
          </>
        )}

        {selectedTab === 'category' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name*"
              value={form.Name}
              onChangeText={(v) => handleChange('Name', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={form.Description}
              onChangeText={(v) => handleChange('Description', v)}
            />
          </>
        )}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, themeStyles.button]}
        onPress={handleSubmit}
        disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color={isDark ? '#fff' : '#000'} />
        ) : (
          <Text style={[themeStyles.buttonText, styles.buttonText]}>Submit</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: StatusBar.currentHeight,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: '#6E7FEC' },
  tabText: { fontSize: 16, fontWeight: '600' },
  formContainer: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  label: { fontWeight: '600', marginBottom: 6 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  submitButton: { padding: 15, borderRadius: 8 },
  buttonText: { textAlign: 'center', fontSize: 16, fontWeight: '500' },
});

export default AddCredentialsScreen;