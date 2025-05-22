import React, { useState } from 'react'
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'

type Props = {
  /** Called with `base64` string when an image is picked */
  onImagePicked: (base64: string) => void
  /** Button label */
  title?: string
  /** Override container style */
  style?: ViewStyle
  /** Override text style */
  textStyle?: TextStyle
}

export default function ImagePickerButton({
  onImagePicked,
  title = 'Upload Image',
  style,
  textStyle,
}: Props) {
  const [loading, setLoading] = useState(false)

  const pickImage = async () => {
    // ask for camera-roll permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      alert('Permission to access photos is required!')
      return
    }

    setLoading(true)
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: true,
      })

      if (!result.cancelled && result.base64) {
        onImagePicked(result.base64)
      }
    } catch (err) {
      console.error('Image pick error', err)
      alert('Could not pick the image.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={pickImage}
      disabled={loading}
    >
      {loading
        ? <ActivityIndicator />
        : <Text style={[styles.text, textStyle]}>{title}</Text>
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#6E7FEC',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '600',
  },
})