import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '@context/ThemeContext';
import { darkTheme, lightTheme } from '@assets/colors/theme';
import { useAppDispatch, useAppSelector } from '@redux/hooks';
import AuthService from '@services/AuthService';
import PasswordService from '@services/PasswordService';
import CategoryService from '@services/CategoryService';
import PersonalVaultService from '@services/PersonalVaultService';
import ImagePickerButton from '@components/ImagePickerButton';
import { CreateCategoryPayload } from '@appTypes/category.types';
import { PersonalVaultPayload } from '@appTypes/personalVault.types';
import { ServiceResult } from '@appTypes/service.types';
import { Switch, TextInput } from 'react-native-paper';

type AddCredParams = {
  AddCredentials: {
    tab: 'password' | 'vault' | 'category';
    categoryId?: string;
    name?: string;
    description?: string;
  };
};
type RouteProps = RouteProp<AddCredParams, 'AddCredentials'>;

const { width, height } = Dimensions.get('window');

export default function AddCredentialsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProps>();
  const dispatch = useAppDispatch();
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  // initial tab
  const initialTab = route.params?.tab ?? 'password';
  const [selectedTab, setSelectedTab] = useState(initialTab);

  // form state
  const [form, setForm] = useState<Record<string, any>>({
    // password
    siteName: '',
    usernameOrEmail: '',
    notes: '',
    password: '',
    passwordRepeat: '',

    // personal vault
    title: '',
    content: '',
    summary: '',
    tags: '',
    IsLocked: false,
    unlockDate: '',
    expirationDate: '',
    IsShareable: false,
    IsFavorite: false,

    // category
    name: '',
    Description: '',
    CategoryId: '',
  });

  // date picker
  const [datePicker, setDatePicker] = useState<{
    field: 'PasswordExpirationDate' | 'UnlockDate' | 'ExpirationDate' | null;
    date: Date;
  }>({ field: null, date: new Date() });

  // redux categories
  const { categories, loading: loadingCategories, error: categoriesError } =
    useAppSelector(s => s.category);

  // userId
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // decode token
  useEffect(() => {
    (async () => {
      const decoded = await AuthService.decodeToken();
      if (decoded?.nameid) setUserId(decoded.nameid);
      else {
        Alert.alert('Error', 'Please log in again.');
        navigation.goBack();
      }
      setLoadingUser(false);
    })();
  }, [navigation]);

  // load categories once userId known
  useEffect(() => {
    if (!loadingUser && userId) {
      dispatch(CategoryService.getCategoriesByUser());
    }
  }, [dispatch, loadingUser, userId]);

  // prefill category tab on edit
  useEffect(() => {
    if (initialTab === 'category' && route.params?.categoryId) {
      setSelectedTab('category');
      setForm(f => ({
        ...f,
        CategoryId: route.params.categoryId!,
        Name: route.params.name ?? '',
        Description: route.params.description ?? '',
      }));
    }
  }, [initialTab, route.params]);

  const handleChange = (key: string, val: any) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const showPicker = (field: 'PasswordExpirationDate' | 'UnlockDate' | 'ExpirationDate') => {
    setDatePicker({ field, date: form[field] ? new Date(form[field]) : new Date() });
  };
  const onDateSelected = (_: any, sel?: Date) => {
    const { field, date } = datePicker;
    setDatePicker({ field: null, date });
    if (field && sel) {
      const iso = sel.toISOString().split('T')[0];
      handleChange(field, iso);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!userId) return;
    setSubmitting(true);
    try {
      if (selectedTab === 'password') {
        // lowercase keys as API expects
        const payload = {
          siteName: form.SiteName,
          usernameOrEmail: form.UsernameOrEmail,
          password: form.Password,
          passwordRepeat: form.PasswordRepeat,
          notes: form.Notes,
          categoryId: form.CategoryId,
          // ...(form.PasswordExpirationDate
          // ? { expirationDate: new Date(form.PasswordExpirationDate).toISOString() }
          // : {}),
        };
        const res = (await dispatch(
          PasswordService.createPassword(payload)
        )) as ServiceResult<any>;
        if (!res.success) throw new Error(res.message);
        Alert.alert('Success', 'Password saved.');
      }

      else if (selectedTab === 'vault') {
        const payload: PersonalVaultPayload = {
          userId: userId,
          secureTitle: form.Title,
          secureContent: form.Content,
          // Url: form.Url,
          // MediaFile: form.MediaFile,
          secureSummary: form.Summary,
          secureTags: form.Tags.split(',').map((t: string) => t.trim()),
          IsLocked: form.IsLocked,
          IsShareable: form.IsShareable,
          IsFavorite: form.IsFavorite,
          categoryId: form.CategoryId,
        };
        const res = (await dispatch(
          // @ts-ignore
          PersonalVaultService.createVault(payload)
        )) as ServiceResult<any>;
        if (!res.success) throw new Error(res.message);
        Alert.alert('Success', 'Vault entry saved.');
      }

      else {
        const payload: CreateCategoryPayload = {
          userId: userId,
          name: form.Name,
          description: form.Description,
        };
        const catId = route.params?.categoryId;
        if (catId) {
          const res = (await dispatch(
            // @ts-ignore
            CategoryService.updateCategory(catId, payload)
          )) as ServiceResult<any>;
          if (!res.success) throw new Error(res.message);
          Alert.alert('Success', 'Category updated.');
        } else {
          const res = (await dispatch(
            // @ts-ignore
            CategoryService.createCategory(payload)
          )) as ServiceResult<any>;
          if (!res.success) throw new Error(res.message);
          Alert.alert('Success', 'Category created.');
        }
      }

      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  }, [dispatch, form, navigation, route.params, selectedTab, userId]);

  // loading states
  if (loadingUser || (loadingCategories && selectedTab === 'category')) {
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
      {datePicker.field && (
        <DateTimePicker
          value={datePicker.date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateSelected}
        />
      )}

      {/* tabs */}
      <View style={styles.tabContainer}>
        {(['password', 'vault', 'category'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, themeStyles.text]}>
              {tab === 'password'
                ? 'Password'
                : tab === 'vault'
                  ? 'Vault'
                  : 'Category'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* form */}
      <View style={styles.formContainer}>
        {selectedTab === 'password' && (
          <>
            <TextInput
              style={[styles.input, themeStyles.inputText, themeStyles.card]}
              label="Site Name*"
              value={form.SiteName}
              onChangeText={v => handleChange('SiteName', v)}
              mode='outlined'
              textColor={themeStyles.text.color as string}
            />
            <TextInput
              style={[styles.input, themeStyles.inputText, themeStyles.card]}
              label="Username or Email*"
              mode='outlined'
              value={form.UsernameOrEmail}
              onChangeText={v => handleChange('UsernameOrEmail', v)}
              textColor={themeStyles.text.color as string}
            />
            <TextInput
              style={[styles.input, themeStyles.inputText, themeStyles.card]}
              label="Password*"
              mode='outlined'
              secureTextEntry
              value={form.Password}
              onChangeText={v => handleChange('Password', v)}
              textColor={themeStyles.text.color as string}
            />
            <TextInput
              style={[styles.input, themeStyles.inputText, themeStyles.card]}
              label="Repeat Password*"
              mode='outlined'
              secureTextEntry
              value={form.PasswordRepeat}
              onChangeText={v => handleChange('PasswordRepeat', v)}
              textColor={themeStyles.text.color as string}
            />
            <TextInput
              style={[styles.input, themeStyles.inputText, themeStyles.card]}
              label="Notes"
              mode='outlined'
              value={form.Notes}
              onChangeText={v => handleChange('Notes', v)}
              textColor={themeStyles.text.color as string}
            />

            {/* <TouchableOpacity
              style={[styles.input, themeStyles.inputText, themeStyles.card, {
                borderWidth: 2,
                borderColor: '#57555f',
                borderRadius: 5,
                marginBottom: 12,
                overflow: 'hidden',
                height: height * 0.065
              }]}
              onPress={() => showPicker('PasswordExpirationDate')}
            >
              <Text style={{ color: form.PasswordExpirationDate ? '#888' : '#666' }}>
                {form.PasswordExpirationDate || 'Select Expiration Date'}
              </Text>
            </TouchableOpacity> */}

            {/* <Text style={[styles.label, themeStyles.text]}>Category*</Text> */}
            <View style={[styles.pickerContainer, themeStyles.card]}>
              <Picker
                selectedValue={form.CategoryId}
                onValueChange={v => handleChange('CategoryId', v)}
              >
                <Picker.Item label="Select category*" value="" color={isDark ? '#888' : '#666'} />
                {categories.map(c => (
                  <Picker.Item key={c.id} label={c.name} value={c.id} style={themeStyles.inputText} />
                ))}
              </Picker>
            </View>
          </>
        )}

        {selectedTab === 'vault' && (
          <>
            <TextInput
              style={[styles.input, themeStyles.inputText, themeStyles.card]}
              label="Title*"
              mode='outlined'
              value={form.Title}
              onChangeText={v => handleChange('Title', v)}
              textColor={themeStyles.text.color as string}
            />
            <TextInput
              style={[styles.input, themeStyles.inputText, themeStyles.card]}
              label="Content*"
              mode='outlined'
              value={form.Content}
              onChangeText={v => handleChange('Content', v)}
              textColor={themeStyles.text.color as string}
            />
            {/* <TextInput
              style={[styles.input, themeStyles.inputText, themeStyles.card]}
              label="URL"
              mode='outlined'
              value={form.Url}
              onChangeText={v => handleChange('Url', v)}
              textColor={themeStyles.text.color}
            /> */}
            {/* <ImagePickerButton
              title={form.MediaFile ? 'Change Image' : 'Upload Image'}
              onImagePicked={b => handleChange('MediaFile', b)}
              style={styles.uploadButton}
              textStyle={styles.uploadButtonText}
            />
            {form.MediaFile && (
              <Text style={[styles.helpText, themeStyles.textGray]}>
                Image selected ({form.MediaFile.length.toLocaleString()} chars)
              </Text>
            )} */}
            <TextInput
              style={[styles.input, themeStyles.inputText, themeStyles.card]}
              label="Summary"
              mode='outlined'
              value={form.Summary}
              onChangeText={v => handleChange('Summary', v)}
              textColor={themeStyles.text.color as string}
            />
            <TextInput
              style={[styles.input, themeStyles.inputText, themeStyles.card]}
              label="Tags (comma separated)"
              mode='outlined'
              value={form.Tags}
              onChangeText={v => handleChange('Tags', v)}
              textColor={themeStyles.text.color as string}
            />

            <View style={styles.switchRow}>
              <Text style={themeStyles.text}>Lock this item?</Text>
              <Switch
                value={form.IsLocked}
                onValueChange={v => handleChange('IsLocked', v)}
              />
            </View>

            {form.IsLocked && (
              <>
                <TouchableOpacity
                  style={[styles.input, themeStyles.inputText, themeStyles.card]}
                  onPress={() => showPicker('UnlockDate')}
                >
                  <Text style={{ color: form.UnlockDate ? '#888' : '#666' }}>
                    {form.UnlockDate || 'Select Unlock Date'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.input, themeStyles.inputText, themeStyles.card]}
                  onPress={() => showPicker('ExpirationDate')}
                >
                  <Text style={{ color: form.ExpirationDate ? '#888' : '#666' }}>
                    {form.ExpirationDate || 'Select Expiration Date'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.switchRow}>
              <Text style={themeStyles.text}>Allow sharing?</Text>
              <Switch
                value={form.IsShareable}
                onValueChange={v => handleChange('IsShareable', v)}
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={themeStyles.text}>Mark as favorite?</Text>
              <Switch
                value={form.IsFavorite}
                onValueChange={v => handleChange('IsFavorite', v)}
              />
            </View>

            {/* <Text style={[styles.label, themeStyles.text]}>Category*</Text> */}
            <View style={[styles.pickerContainer, themeStyles.card]}>
              <Picker
                selectedValue={form.CategoryId}
                onValueChange={v => handleChange('CategoryId', v)}
              >
                <Picker.Item label="Select category*" value="" color={isDark ? '#888' : '#666'} />
                {categories.map(c => (
                  <Picker.Item key={c.id} label={c.name} value={c.id} color={isDark ? '#888' : '#666'} />
                ))}
              </Picker>
            </View>
          </>
        )}

        {selectedTab === 'category' && (
          <>
            <TextInput
              style={[styles.input, themeStyles.inputText, themeStyles.card]}
              label="Name*"
              mode='outlined'
              value={form.Name}
              onChangeText={v => handleChange('Name', v)}
              textColor={themeStyles.text.color as string}
            />
            <TextInput
              style={[styles.input, themeStyles.inputText, themeStyles.card]}
              label="Description"
              mode='outlined'
              value={form.Description}
              onChangeText={v => handleChange('Description', v)}
              textColor={themeStyles.text.color as string}
            />
          </>
        )}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, themeStyles.button]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting
          ? <ActivityIndicator color={isDark ? '#fff' : '#000'} />
          : <Text style={[styles.buttonText, themeStyles.buttonText]}>
            {route.params?.categoryId ? 'Update' : 'Submit'}
          </Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  activeTab: {
    borderBottomColor: '#6E7FEC',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    justifyContent: 'center',
    height: height * 0.035,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  uploadButton: {
    marginBottom: 12,
  },
  uploadButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  helpText: {
    marginBottom: 12,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#57555f',
    borderRadius: 5,
    marginBottom: 12,
    overflow: 'hidden',
  },
  submitButton: {
    height: height * 0.055,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    // elevation: 5,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
});