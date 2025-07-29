import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Switch,
  Alert,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { useTheme } from '../../context/ThemeContext'
import { darkTheme, lightTheme } from '../../assets/colors/theme'
import { PersonalVaultPayload } from '../../types/personalVault.types'
import { Category } from '../../types/category.types'
import { ServiceResult } from '../../types/service.types'
import api from '../../services/api'
import AuthService from '../../services/AuthService'
import PersonalVaultService from '../../services/PersonalVaultService'
import CategoryService from '../../services/CategoryService'
import ImagePickerButton from '../../components/ImagePickerButton'

type EditVaultParams = {
  EditVault: { vaultId: string }
}

type RouteProps = RouteProp<EditVaultParams, 'EditVault'>

export default function EditVaultScreen() {
  const navigation = useNavigation()
  const route = useRoute<RouteProps>()
  const { themeStyles, isDark } = useTheme()

  const vaultId = route.params.vaultId

  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true)

  const [form, setForm] = useState<{
    Title: string
    Content: string
    // Url: string
    // MediaFile: string         // base64
    Summary: string
    Tags: string
    IsLocked: boolean
    IsShareable: boolean
    UnlockDate: string
    ExpirationDate: string
    IsFavorite: boolean
    CategoryId: string
    fieldErrors: {
      Title?: string
      Content?: string
      CategoryId?: string
    }
  }>({
    Title: '',
    Content: '',
    // Url: '',
    // MediaFile: '',
    Summary: '',
    Tags: '',
    IsLocked: false,
    IsShareable: false,
    UnlockDate: '',
    ExpirationDate: '',
    IsFavorite: false,
    CategoryId: '',
    fieldErrors: {},
  })

  // Fetch vault + categories
  useEffect(() => {
    let isMounted = true
      ; (async () => {
        // 1) categories
        try {
          const catRes = await api.get<ServiceResult<Category[]>>('/categories')
          if (catRes.data && catRes.data.success && isMounted) {
            setCategories(catRes.data.data)
          }
        } catch (_e) {
        } finally {
          if (isMounted) setCategoriesLoading(false)
        }

        // 2) vault
        try {
          const vRes = await api.get<ServiceResult<PersonalVaultPayload & { id: string }>>(
            `/vaults/${vaultId}`
          )
          if (vRes.data && vRes.data.success && isMounted) {
            const v: any = vRes.data.data
            setForm({
              Title: v.Title,
              Content: v.Content,
              // Url: v.Url,
              // MediaFile: v.MediaFile ?? '',
              Summary: v.Summary ?? '',
              Tags: (v.Tags ?? []).join(', '),
              IsLocked: v.IsLocked,
              IsShareable: v.IsShareable,
              UnlockDate: v.UnlockDate ?? '',
              ExpirationDate: v.ExpirationDate ?? '',
              IsFavorite: v.IsFavorite,
              CategoryId: v.CategoryId,
              fieldErrors: {},
            })
            setError(null)
          } else {
            if (isMounted)
              setError(vRes.data.message || 'Failed to load vault')
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
  }, [vaultId])

  const handleChange = (
    key:
      | 'Title'
      | 'Content'
      // | 'Url'
      // | 'MediaFile'
      | 'Summary'
      | 'Tags'
      | 'IsLocked'
      | 'IsShareable'
      | 'UnlockDate'
      | 'ExpirationDate'
      | 'IsFavorite'
      | 'CategoryId',
    value: any
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
    if (!form.Title.trim()) {
      errs.Title = 'Title is required.'
      hasError = true
    }
    if (!form.Content.trim()) {
      errs.Content = 'Content is required.'
      hasError = true
    }
    if (!form.CategoryId) {
      errs.CategoryId = 'Select a category.'
      hasError = true
    }
    if (hasError) {
      setForm(f => ({ ...f, fieldErrors: errs }))
      return
    }

    setSaving(true)
    try {
      const payload: PersonalVaultPayload = {
        UserId: '', // backend reads from token
        Title: form.Title,
        Content: form.Content,
        // Url: form.Url,
        // MediaFile: form.MediaFile,
        Summary: form.Summary,
        Tags: form.Tags.split(',').map((t: string) => t.trim()),
        IsLocked: form.IsLocked,
        IsShareable: form.IsShareable,
        UnlockDate: form.UnlockDate
          ? new Date(form.UnlockDate).toISOString()
          : undefined,
        CategoryId: form.CategoryId,
        ExpirationDate: form.ExpirationDate
          ? new Date(form.ExpirationDate).toISOString()
          : undefined,
        IsFavorite: form.IsFavorite,
      }
      const resp = await api.put<ServiceResult<PersonalVaultPayload & { id: string }>>(
        `/vaults/${vaultId}`,
        payload
      )
      if (resp.data && resp.data.success) {
        Alert.alert('Success', 'Vault updated.', [
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
      <Text style={[styles.title, themeStyles.text]}>Edit Vault</Text>

      <TextInput
        style={[
          styles.input,
          themeStyles.card,
          form.fieldErrors.Title && styles.inputError,
        ]}
        placeholder="Title*"
        placeholderTextColor={isDark ? '#888' : '#666'}
        value={form.Title}
        onChangeText={text => handleChange('Title', text)}
      />
      {form.fieldErrors.Title ? (
        <Text style={styles.errorText}>{form.fieldErrors.Title}</Text>
      ) : null}

      <TextInput
        style={[
          styles.input,
          themeStyles.card,
          form.fieldErrors.Content && styles.inputError,
        ]}
        placeholder="Content*"
        placeholderTextColor={isDark ? '#888' : '#666'}
        value={form.Content}
        onChangeText={text => handleChange('Content', text)}
      />
      {form.fieldErrors.Content ? (
        <Text style={styles.errorText}>{form.fieldErrors.Content}</Text>
      ) : null}

      {/* <TextInput
        style={styles.input}
        placeholder="URL"
        placeholderTextColor={isDark ? '#888' : '#666'}
        value={form.Url}
        onChangeText={text => handleChange('Url', text)}
      />

      <ImagePickerButton
        title={form.MediaFile ? 'Change Image' : 'Upload Image'}
        onImagePicked={base64 => handleChange('MediaFile', base64)}
        style={styles.uploadButton}
        textStyle={styles.uploadButtonText}
      />
      {form.MediaFile ? (
        <Text
          style={[styles.helpText, themeStyles.textGray]}
          numberOfLines={1}
        >
          Image chosen ({form.MediaFile.length.toLocaleString()} chars)
        </Text>
      ) : null} */}

      <TextInput
        style={styles.input}
        placeholder="Summary"
        placeholderTextColor={isDark ? '#888' : '#666'}
        value={form.Summary}
        onChangeText={text => handleChange('Summary', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Tags (comma separated)"
        placeholderTextColor={isDark ? '#888' : '#666'}
        value={form.Tags}
        onChangeText={text => handleChange('Tags', text)}
      />

      <View style={styles.switchRow}>
        <Text style={themeStyles.text}>Allow sharing?</Text>
        <Switch
          value={form.IsShareable}
          onValueChange={v => handleChange('IsShareable', v)}
        />
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, themeStyles.text]}>Locked</Text>
        <Switch
          value={form.IsLocked}
          onValueChange={v => handleChange('IsLocked', v)}
        />
      </View>

      <TextInput
        style={[styles.input]}
        placeholder="Unlock Date (YYYY-MM-DD)"
        placeholderTextColor={isDark ? '#888' : '#666'}
        value={form.UnlockDate}
        onChangeText={text => handleChange('UnlockDate', text)}
      />

      <TextInput
        style={[styles.input]}
        placeholder="Expiration Date (YYYY-MM-DD)"
        placeholderTextColor={isDark ? '#888' : '#666'}
        value={form.ExpirationDate}
        onChangeText={text => handleChange('ExpirationDate', text)}
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

      <View style={[styles.row, { marginBottom: 12 }]}>
        <Text style={[styles.label, themeStyles.text]}>Favorite</Text>
        <Switch
          value={form.IsFavorite}
          onValueChange={v => handleChange('IsFavorite', v)}
        />
      </View>

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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 4,
    overflow: 'hidden',
  },
  uploadButton: {
    marginVertical: 12,
    backgroundColor: '#6E7FEC',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  helpText: {
    marginBottom: 12,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
