import React, { useEffect, useState, useCallback } from 'react'
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
  Platform,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { useTheme } from '../context/ThemeContext'
import { darkTheme, lightTheme } from '../assets/colors/theme'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import AuthService from '../services/AuthService'
import PasswordService from '../services/PasswordService'
import CategoryService from '../services/CategoryService'
import PersonalVaultService from '../services/PersonalVaultService'
import { CategoryPayload } from '../types/category.types'
import { PasswordPayload } from '../types/password.types'
import { PersonalVaultPayload } from '../types/personalVault.types'
import { ServiceResult } from '../types/service.types'
import ImagePickerButton from '../components/ImagePickerButton'

type AddCredParams = {
  AddCredentials: {
    tab: 'password' | 'vault' | 'category'
    // optional for edit
    categoryId?: string
    name?: string
    description?: string
  }
}

type RouteProps = RouteProp<AddCredParams, 'AddCredentials'>

export default function AddCredentialsScreen() {
  const navigation = useNavigation()
  const route = useRoute<RouteProps>()
  const dispatch = useAppDispatch()
  const { isDark } = useTheme()
  const themeStyles = isDark ? darkTheme : lightTheme

  // initial tab from params, default 'password'
  const initialTab = route.params?.tab ?? 'password'
  const [selectedTab, setSelectedTab] = useState(initialTab)

  // form state
  const [form, setForm] = useState<Record<string, any>>({
    // password
    SiteName: '',
    UsernameOrEmail: '',
    Password: '',
    PasswordRepeat: '',
    Notes: '',
    PasswordExpirationDate: '',
    // vault
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
    // category
    Name: '',
    Description: '',
    // common
    CategoryId: '',
  })

  // date picker
  const [datePicker, setDatePicker] = useState<{
    field: 'PasswordExpirationDate' | 'UnlockDate' | 'ExpirationDate' | null
    date: Date
  }>({ field: null, date: new Date() })

  const { categories, loading: loadingCategories, error: categoriesError } =
    useAppSelector(s => s.category)

  const [userId, setUserId] = useState<string | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // decode token → userId
  useEffect(() => {
    ; (async () => {
      const decoded = await AuthService.decodeToken()
      if (decoded?.nameid) {
        setUserId(decoded.nameid)
      } else {
        Alert.alert('Error', 'Please log in again.')
        navigation.goBack()
      }
      setLoadingUser(false)
    })()
  }, [navigation])

  // fetch categories once we know user
  useEffect(() => {
    if (!loadingUser && userId) {
      dispatch(CategoryService.getCategoriesByUser())
    }
  }, [dispatch, loadingUser, userId])

  // prefill when editing a category
  useEffect(() => {
    const catId = route.params?.categoryId
    if (initialTab === 'category' && catId) {
      setSelectedTab('category')
      setForm(f => ({
        ...f,
        CategoryId: catId,
        Name: route.params?.name ?? '',
        Description: route.params?.description ?? '',
      }))
    }
  }, [initialTab, route.params])

  const handleChange = (key: string, val: any) =>
    setForm(prev => ({ ...prev, [key]: val }))

  const showPicker = (field: 'PasswordExpirationDate' | 'UnlockDate' | 'ExpirationDate') => {
    setDatePicker({ field, date: form[field] ? new Date(form[field]) : new Date() })
  }
  const onDateSelected = (_: any, sel?: Date) => {
    const { field, date } = datePicker
    setDatePicker({ field: null, date })
    if (field && sel) {
      const iso = sel.toISOString().split('T')[0]
      handleChange(field, iso)
    }
  }

  const handleSubmit = useCallback(async () => {
    if (!userId) return
    setSubmitting(true)

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
        }
        await dispatch(PasswordService.createPassword(payload))
        Alert.alert('Success', 'Password saved.')
      }

      if (selectedTab === 'vault') {
        const payload: PersonalVaultPayload = {
          UserId: userId,
          Title: form.Title,
          Content: form.Content,
          Url: form.Url,
          MediaFile: form.MediaFile,
          Summary: form.Summary,
          Tags: form.Tags.split(',').map((t: string) => t.trim()),
          IsLocked: form.IsLocked,
          UnlockDate: form.UnlockDate
            ? new Date(form.UnlockDate).toISOString()
            : undefined,
          CategoryId: form.CategoryId,
          ExpirationDate: form.ExpirationDate
            ? new Date(form.ExpirationDate).toISOString()
            : undefined,
          IsFavorite: form.IsFavorite,
        }
        await dispatch(PersonalVaultService.createVault(payload))
        Alert.alert('Success', 'Vault entry saved.')
      }

      if (selectedTab === 'category') {
        const payload: CategoryPayload = {
          UserId: userId,
          name: form.Name,
          description: form.Description,
        }
        const catId = route.params?.categoryId
        if (catId) {
          await dispatch(CategoryService.updateCategory(catId, payload))
          Alert.alert('Success', 'Category updated.')
        } else {
          await dispatch(CategoryService.createCategory(payload))
          Alert.alert('Success', 'Category created.')
        }
      }

      navigation.goBack()
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }, [dispatch, form, navigation, route.params, selectedTab, userId])

  if (loadingUser || (loadingCategories && selectedTab === 'category')) {
    return (
      <View style={[styles.loader, themeStyles.container]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  if (categoriesError) {
    return (
      <View style={[styles.loader, themeStyles.container]}>
        <Text style={themeStyles.text}>{categoriesError}</Text>
      </View>
    )
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

      {/* form */}
      <View style={styles.formContainer}>
        {selectedTab === 'password' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Site Name*"
              value={form.SiteName}
              onChangeText={v => handleChange('SiteName', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Username or Email*"
              value={form.UsernameOrEmail}
              onChangeText={v => handleChange('UsernameOrEmail', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password*"
              secureTextEntry
              value={form.Password}
              onChangeText={v => handleChange('Password', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Repeat Password*"
              secureTextEntry
              value={form.PasswordRepeat}
              onChangeText={v => handleChange('PasswordRepeat', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Notes"
              value={form.Notes}
              onChangeText={v => handleChange('Notes', v)}
            />
            <TouchableOpacity
              style={styles.input}
              onPress={() => showPicker('PasswordExpirationDate')}
            >
              <Text style={{ color: form.PasswordExpirationDate ? '#000' : '#888' }}>
                {form.PasswordExpirationDate || 'Select Expiration Date'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.label}>Category*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.CategoryId}
                onValueChange={v => handleChange('CategoryId', v)}
              >
                <Picker.Item label="Select category..." value="" />
                {categories.map(c => (
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
              onChangeText={v => handleChange('Title', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Content*"
              value={form.Content}
              onChangeText={v => handleChange('Content', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="URL"
              value={form.Url}
              onChangeText={(v) => handleChange('Url', v)}
            />

            {/* <TextInput
              style={styles.input}
              placeholder="Media File"
              value={form.MediaFile}
              onChangeText={(v) => handleChange('MediaFile', v)}
            /> */}

            <ImagePickerButton
              title={form.MediaFile ? 'Change Image' : 'Upload Image'}
              onImagePicked={base64 => handleChange('MediaFile', base64)}
              style={styles.uploadButton}
              textStyle={styles.uploadButtonText}
            />

            {form.MediaFile ? (
              <Text style={[styles.helpText, themeStyles.textGray]}>
                Image selected ({form.MediaFile.length.toLocaleString()} characters)
              </Text>
            ) : null}

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

            <TouchableOpacity
              style={styles.input}
              onPress={() => showPicker('UnlockDate')}
            >
              <Text style={{ color: form.UnlockDate ? '#000' : '#888' }}>
                {form.UnlockDate || 'Select Unlock Date'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.input}
              onPress={() => showPicker('ExpirationDate')}
            >
              <Text style={{ color: form.ExpirationDate ? '#000' : '#888' }}>
                {form.ExpirationDate || 'Select Expiration Date'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Category*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.CategoryId}
                onValueChange={(v) => handleChange('CategoryId', v)}
              >
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
              onChangeText={v => handleChange('Name', v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={form.Description}
              onChangeText={v => handleChange('Description', v)}
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
          : <Text style={[themeStyles.buttonText, styles.buttonText]}>
            {route.params?.categoryId ? 'Update' : 'Submit'}
          </Text>
        }
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
    borderBottomColor: '#6E7FEC'
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600'
  },
  formContainer: {
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    justifyContent: 'center',
  },
  uploadButton: {
    marginBottom: 12,
    backgroundColor: '#6E7FEC',
  },
  uploadButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  helpText: {
    marginBottom: 12,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular'
  },
  label: {
    fontWeight: '600',
    marginBottom: 6
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  submitButton: {
    padding: 15,
    borderRadius: 8
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500'
  },
})