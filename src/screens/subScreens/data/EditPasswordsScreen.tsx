import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { useTheme } from '../../../context/ThemeContext'
import { darkTheme, lightTheme } from '../../../assets/colors/theme'
import { Category } from '../../../types/category.types'
import { PasswordItem, PasswordPayload } from '../../../types/password.types'
import { ServiceResult } from '../../../types/service.types'
import api from '../../../services/api'
import AuthService from '../../../services/AuthService'
import PasswordService from '../../../services/PasswordService'
import CategoryService from '../../../services/CategoryService'
import { Picker } from '@react-native-picker/picker'

type EditPassParams = {
  EditPassword: { passwordId: string }
}

type RouteProps = RouteProp<EditPassParams, 'EditPassword'>

export default function EditPasswordsScreen() {
  const navigation = useNavigation()
  const route = useRoute<RouteProps>()
  const { isDark } = useTheme()
  const themeStyles = isDark ? darkTheme : lightTheme

  const passwordId = route.params.passwordId

  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true)

  const [form, setForm] = useState<{
    SiteName: string
    UsernameOrEmail: string
    Password: string
    PasswordRepeat: string
    Notes: string
    PasswordExpirationDate: string
    CategoryId: string
    fieldErrors: {
      SiteName?: string
      UsernameOrEmail?: string
      Password?: string
      CategoryId?: string
    }
  }>({
    SiteName: '',
    UsernameOrEmail: '',
    Password: '',
    PasswordRepeat: '',
    Notes: '',
    PasswordExpirationDate: '',
    CategoryId: '',
    fieldErrors: {},
  })

  // Fetch password + categories
  useEffect(() => {
    let isMounted = true
    ;(async () => {
      // 1) fetch categories
      try {
        const catRes = await api.get<ServiceResult<Category[]>>('/categories')
        if (catRes.data && catRes.data.success && isMounted) {
          setCategories(catRes.data.data)
        }
      } catch (_e) {
        // ignore—validation will catch if CategoryId is missing
      } finally {
        if (isMounted) setCategoriesLoading(false)
      }

      // 2) fetch password
      try {
        const pRes = await api.get<ServiceResult<PasswordItem>>(
          `/passwordvaults/${passwordId}`
        )
        if (pRes.data && pRes.data.success && isMounted) {
          const pw = pRes.data.data
          setForm({
            SiteName: pw.SiteName,
            UsernameOrEmail: pw.UsernameOrEmail,
            Password: pw.Password,
            PasswordRepeat: pw.Password,
            Notes: pw.Notes ?? '',
            PasswordExpirationDate: pw.PasswordExpirationDate ?? '',
            CategoryId: pw.CategoryId,
            fieldErrors: {},
          })
          setError(null)
        } else {
          if (isMounted)
            setError(pRes.data.message || 'Failed to load password')
        }
      } catch (_e) {
        if (isMounted) setError('An unexpected error occurred.')
      } finally {
        if (isMounted) setLoading(false)
      }
    })()
    return () => {
      isMounted = false
    }
  }, [passwordId])

  const handleChange = (
    key:
      | 'SiteName'
      | 'UsernameOrEmail'
      | 'Password'
      | 'PasswordRepeat'
      | 'Notes'
      | 'PasswordExpirationDate'
      | 'CategoryId',
    value: string
  ) => {
    setForm(f => ({
      ...f,
      [key]: value,
      fieldErrors: { ...f.fieldErrors, [key]: undefined },
    }))
    setError(null)
  }

  const handleSave = async () => {
    // validation
    const errs: any = {}
    let hasError = false
    if (!form.SiteName.trim()) {
      errs.SiteName = 'Site Name is required.'
      hasError = true
    }
    if (!form.UsernameOrEmail.trim()) {
      errs.UsernameOrEmail = 'Username/Email is required.'
      hasError = true
    }
    if (!form.Password) {
      errs.Password = 'Password is required.'
      hasError = true
    }
    if (!form.CategoryId) {
      errs.CategoryId = 'Select a category.'
      hasError = true
    }
    if (form.Password !== form.PasswordRepeat) {
      errs.Password = 'Passwords must match.'
      hasError = true
    }
    if (hasError) {
      setForm(f => ({ ...f, fieldErrors: errs }))
      return
    }

    setSaving(true)
    try {
      const payload: PasswordPayload = {
        UserId: '', // (backend will read from token)
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
      const resp = await api.put<ServiceResult<PasswordItem>>(
        `/passwordvaults/${passwordId}`,
        payload
      )
      if (resp.data && resp.data.success) {
        Alert.alert('Success', 'Password updated.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ])
      } else {
        Alert.alert('Error', resp.data.message || 'Failed to update.')
      }
    } catch (_e) {
      Alert.alert('Error', 'An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || categoriesLoading) {
    return (
      <View style={[styles.loaderContainer, themeStyles.container]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.loaderContainer, themeStyles.container]}>
        <Text style={themeStyles.text}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.title, themeStyles.text]}>Edit Password</Text>

      <TextInput
        style={[
          styles.input,
          themeStyles.card,
          form.fieldErrors.SiteName && styles.inputError,
        ]}
        placeholder="Site Name*"
        placeholderTextColor={isDark ? '#888' : '#666'}
        value={form.SiteName}
        onChangeText={text => handleChange('SiteName', text)}
      />
      {form.fieldErrors.SiteName ? (
        <Text style={styles.errorText}>{form.fieldErrors.SiteName}</Text>
      ) : null}

      <TextInput
        style={[
          styles.input,
          themeStyles.card,
          form.fieldErrors.UsernameOrEmail && styles.inputError,
        ]}
        placeholder="Username or Email*"
        placeholderTextColor={isDark ? '#888' : '#666'}
        value={form.UsernameOrEmail}
        onChangeText={text => handleChange('UsernameOrEmail', text)}
      />
      {form.fieldErrors.UsernameOrEmail ? (
        <Text style={styles.errorText}>
          {form.fieldErrors.UsernameOrEmail}
        </Text>
      ) : null}

      <TextInput
        style={[
          styles.input,
          themeStyles.card,
          form.fieldErrors.Password && styles.inputError,
        ]}
        placeholder="Password*"
        placeholderTextColor={isDark ? '#888' : '#666'}
        secureTextEntry
        value={form.Password}
        onChangeText={text => handleChange('Password', text)}
      />
      {form.fieldErrors.Password ? (
        <Text style={styles.errorText}>{form.fieldErrors.Password}</Text>
      ) : null}

      <TextInput
        style={[styles.input, themeStyles.card]}
        placeholder="Repeat Password*"
        placeholderTextColor={isDark ? '#888' : '#666'}
        secureTextEntry
        value={form.PasswordRepeat}
        onChangeText={text => handleChange('PasswordRepeat', text)}
      />

      <TextInput
        style={[styles.input, themeStyles.card]}
        placeholder="Notes"
        placeholderTextColor={isDark ? '#888' : '#666'}
        value={form.Notes}
        onChangeText={text => handleChange('Notes', text)}
      />

      <TextInput
        style={[styles.input, themeStyles.card]}
        placeholder="Expiration Date (YYYY-MM-DD)"
        placeholderTextColor={isDark ? '#888' : '#666'}
        value={form.PasswordExpirationDate}
        onChangeText={text => handleChange('PasswordExpirationDate', text)}
      />

      <Text style={[styles.label, themeStyles.text]}>Category*</Text>
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
      {form.fieldErrors.CategoryId ? (
        <Text style={styles.errorText}>{form.fieldErrors.CategoryId}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.saveButton, themeStyles.button]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color={themeStyles.buttonText.color} />
        ) : (
          <Text style={[styles.saveButtonText, themeStyles.buttonText]}>
            Save
          </Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 4,
    fontFamily: 'Poppins_400Regular',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    marginBottom: 8,
    fontFamily: 'Poppins_400Regular',
    fontWeight: '600',
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    fontFamily: 'Poppins_500Medium',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 4,
    overflow: 'hidden',
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
})
