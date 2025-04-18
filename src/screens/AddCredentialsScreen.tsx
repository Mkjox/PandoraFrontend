import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { darkTheme, lightTheme } from '../assets/colors/theme';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

import AuthService from '../services/AuthService';
import PasswordService from '../services/PasswordServices';
import CategoryService from '../services/CategoryService';
import PersonalVaultService from '../services/PersonalVaultService';
import { Category } from '../types/category.types';

const AddCredentialsScreen: React.FC = () => {
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;
  const navigation = useNavigation();

  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [selectedTab, setSelectedTab] = useState<'password' | 'vault' | 'category'>('password');
  const [form, setForm] = useState<any>({
    // Password Fields
    SiteName: '',
    UsernameOrEmail: '',
    Password: '',
    PasswordRepeat: '',
    Notes: '',
    PasswordExpirationDate: '',
    CategoryId: '',

    // Vault Fields
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

    // Category Fields
    Name: '',
    Description: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // On mount, decode token to get userId
  useEffect(() => {
    (async () => {
      const decoded = await AuthService.decodeToken();
      if (decoded?.nameid) {
        setUserId(decoded.nameid);
      }
      else {
        Alert.alert('Error', 'Unable to get user ID, please log in again.');
        navigation.goBack();
      }
      setLoadingUser(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoadingCategories(true);
      const res = await CategoryService.getCategoriesByUser();
      if (res.success && res.data) {
        setCategories(res.data);
      }
      else {
        Alert.alert('Error', res.message || 'Could not load categories');
      }
      setLoadingCategories(false);
    })();
  }, []);

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!userId) return;

    setSubmitting(true);

    try {
      if (selectedTab === 'password') {
        const { SiteName, UsernameOrEmail, Password, PasswordRepeat, CategoryId } = form;
        if (!SiteName || !UsernameOrEmail || !Password || Password !== PasswordRepeat || !CategoryId) {
          return Alert.alert('Password Error', 'Fill all fields and match passwords, select a category.');
        }
        const res = await PasswordService.createPassword({
          UserId: userId,
          SiteName,
          UsernameOrEmail,
          Password,
          PasswordRepeat,
          Notes: form.Notes,
          PasswordExpirationDate: form.PasswordExpirationDate,
          CategoryId,
        });
        if (!res.success) return Alert.alert('Password Error', res.message!);
        Alert.alert('Success', 'Password added.');
      }

      else if (selectedTab === 'vault') {
        const { Title, Content, CategoryId } = form;
        if (!Title || !Content || !CategoryId) {
          return Alert.alert('Vault Error', 'Title, Content and category are required.');
        }
        const res = await PersonalVaultService.createVault({
          UserId: userId,
          Title,
          Content,
          Url: form.Url,
          MediaFile: form.MediaFile,
          Summary: form.Summary,
          Tags: form.Tags.split(',').map((t: string) => t.trim()),
          IsLocked: form.IsLocked,
          UnlockDate: form.UnlockDate,
          CategoryId,
          ExpirationDate: form.ExpirationDate,
          IsFavorite: form.IsFavorite,
        });
        if (!res.success) return Alert.alert('Vault Error', res.message!);
        Alert.alert('Success', 'Vault entry added.');
      }

      else {
        const { Name } = form;
        if (!Name) {
          return Alert.alert('Category Error', 'Category name is required.');
        }
        const res = await CategoryService.createCategory({
          UserId: userId,
          name: Name,
          description: form.Description,
        });
        if (!res.success) return Alert.alert('Category Error', res.message!);
        Alert.alert('Success', 'Category created.');
      }

      navigation.goBack();
    }

    catch (err: any) {
      Alert.alert('Error', err.message || 'Submission failed');
    }
    finally {
      setSubmitting(false);
    }
  };

  if (loadingUser || (loadingCategories && selectedTab !== 'category')) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <ScrollView style={[themeStyles.container, styles.container]}>

      <View style={styles.tabContainer}>
        {(['password', 'vault', 'category'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
          >
            <Text style={styles.tabText}>
              {tab === 'password' ? 'Password' : tab === 'vault' ? 'Vault' : 'Category'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.formContainer}>
        {selectedTab === 'password' && (
          <>
            <TextInput
              placeholder="Site Name*"
              style={styles.input}
              value={form.SiteName}
              onChangeText={(v) => handleChange('SiteName', v)}
            />

            <TextInput
              placeholder="Username or Email*"
              style={styles.input}
              value={form.UsernameOrEmail}
              onChangeText={(v) => handleChange('UsernameOrEmail', v)}
            />

            <TextInput
              placeholder="Password*"
              secureTextEntry
              style={styles.input}
              value={form.Password}
              onChangeText={(v) => handleChange('Password', v)}
            />

            <TextInput
              placeholder="Repeat Password*"
              secureTextEntry
              style={styles.input}
              value={form.PasswordRepeat}
              onChangeText={(v) => handleChange('PasswordRepeat', v)}
            />

            <TextInput
              placeholder="Notes"
              style={styles.input}
              value={form.Notes}
              onChangeText={(v) => handleChange('Notes', v)}
            />

            <TextInput
              placeholder="Expiration Date (YYYY-MM-DD)"
              style={styles.input}
              value={form.PasswordExpirationDate}
              onChangeText={(v) => handleChange('PasswordExpirationDate', v)}
            />

            <Text style={styles.label}>Category*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.CategoryId}
                onValueChange={(v) => handleChange('CategoryId', v)}
                mode='dropdown'
                style={styles.picker}
              >
                <Picker.Item label='Select category...' value="" />
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
              placeholder="Title*"
              style={styles.input}
              value={form.Title}
              onChangeText={(v) => handleChange('Title', v)}
            />

            <TextInput
              placeholder="Content*"
              style={styles.input}
              value={form.Content}
              onChangeText={(v) => handleChange('Content', v)}
            />

            <TextInput
              placeholder="URL"
              style={styles.input}
              value={form.Url}
              onChangeText={(v) => handleChange('Url', v)}
            />

            <TextInput
              placeholder="Media File"
              style={styles.input}
              value={form.MediaFile}
              onChangeText={(v) => handleChange('MediaFile', v)}
            />

            <TextInput
              placeholder="Summary"
              style={styles.input}
              value={form.Summary}
              onChangeText={(v) => handleChange('Summary', v)}
            />

            <TextInput
              placeholder="Tags (comma separated)"
              style={styles.input}
              value={form.Tags}
              onChangeText={(v) => handleChange('Tags', v)}
            />

            <TextInput
              placeholder="Unlock Date (YYYY-MM-DD)"
              style={styles.input}
              value={form.UnlockDate}
              onChangeText={(v) => handleChange('UnlockDate', v)}
            />

            <TextInput
              placeholder="Expiration Date (YYYY-MM-DD)"
              style={styles.input}
              value={form.ExpirationDate}
              onChangeText={(v) => handleChange('ExpirationDate', v)}
            />

            <Text style={styles.label}>Category*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.CategoryId}
                onValueChange={(v) => handleChange('CategoryId', v)}
                mode='dropdown'
                style={styles.picker}>
                <Picker.Item label='Select category...' value="" />
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
              placeholder="Name*"
              style={styles.input}
              value={form.Name}
              onChangeText={(v) => handleChange('Name', v)}
            />

            <TextInput
              placeholder="Description"
              style={styles.input}
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
          <ActivityIndicator />
        ) : (
          <Text style={[themeStyles.buttonText, styles.buttonText]}>Submit</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-around',
    marginTop: StatusBar.currentHeight,
  },
  tab: {
    // padding: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6E7FEC',
  },
  tabText: {
    fontSize: 16
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    marginBottom: 4,
    fontWeight: '600',
  },
  pickerContainer: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden'
  },
  picker: {

  },
  input: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  submitButton: {
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  }
});

export default AddCredentialsScreen;
