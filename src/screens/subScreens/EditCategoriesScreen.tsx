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
import { useTheme } from '../../context/ThemeContext'
import { darkTheme, lightTheme } from '../../assets/colors/theme'
import { Category } from '../../types/category.types'
import api from '../../services/api'
import AuthService from '../../services/AuthService'
import { ServiceResult } from '../../types/service.types'
import { CategoryPayload } from '../../types/category.types'

type EditCatParams = {
  EditCategory: { categoryId: string }
}

type RouteProps = RouteProp<EditCatParams, 'EditCategory'>

export default function EditCategoriesScreen() {
  const navigation = useNavigation()
  const route = useRoute<RouteProps>()
  const { isDark } = useTheme()
  const themeStyles = isDark ? darkTheme : lightTheme

  const categoryId = route.params.categoryId

  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<{
    name: string
    description: string
    fieldErrors: { name?: string }
  }>({
    name: '',
    description: '',
    fieldErrors: {},
  })

  // Fetch existing category (requires token)
  useEffect(() => {
    let isMounted = true
    ;(async () => {
      const token = await AuthService.getToken()
      if (!token) {
        Alert.alert('Error', 'Not authenticated. Please log in again.')
        navigation.goBack()
        return
      }
      try {
        const resp = await api.get<ServiceResult<Category>>(
          `/categories/${categoryId}`
        )
        if (resp.data && resp.data.success) {
          const cat = resp.data.data
          if (!isMounted) return
          setForm({
            name: cat.name,
            description: cat.description ?? '',
            fieldErrors: {},
          })
          setError(null)
        } else {
          if (!isMounted) return
          setError(resp.data.message || 'Failed to load category')
        }
      } catch (e: any) {
        if (!isMounted) return
        setError('An unexpected error occurred.')
      } finally {
        if (!isMounted) return
        setLoading(false)
      }
    })()
    return () => {
      isMounted = false
    }
  }, [categoryId, navigation])

  const handleChange = (key: 'name' | 'description', value: string) => {
    setForm(f => ({
      ...f,
      [key]: value,
      fieldErrors: { ...f.fieldErrors, [key]: undefined },
    }))
    setError(null)
  }

  const handleSave = async () => {
    // Validation
    let hasError = false
    const errs: { name?: string } = {}
    if (!form.name.trim()) {
      errs.name = 'Name is required.'
      hasError = true
    }
    if (hasError) {
      setForm(f => ({ ...f, fieldErrors: errs }))
      return
    }

    setSaving(true)
    try {
      const payload: CategoryPayload = {
        UserId: '', // (backend will ignore userId if auth token is used)
        name: form.name.trim(),
        description: form.description.trim(),
      }
      const resp = await api.put<ServiceResult<Category>>(
        `/categories/${categoryId}`,
        payload
      )
      if (resp.data && resp.data.success) {
        Alert.alert('Success', 'Category updated.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ])
      } else {
        Alert.alert('Error', resp.data.message || 'Failed to update.')
      }
    } catch (e: any) {
      Alert.alert('Error', 'An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
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
      <Text style={[styles.title, themeStyles.text]}>Edit Category</Text>

      <TextInput
        style={[
          styles.input,
          themeStyles.card,
          form.fieldErrors.name && styles.inputError,
        ]}
        placeholder="Name*"
        placeholderTextColor={isDark ? '#888' : '#666'}
        value={form.name}
        onChangeText={text => handleChange('name', text)}
      />
      {form.fieldErrors.name ? (
        <Text style={styles.errorText}>{form.fieldErrors.name}</Text>
      ) : null}

      <TextInput
        style={[styles.input, themeStyles.card]}
        placeholder="Description"
        placeholderTextColor={isDark ? '#888' : '#666'}
        value={form.description}
        onChangeText={text => handleChange('description', text)}
      />

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
