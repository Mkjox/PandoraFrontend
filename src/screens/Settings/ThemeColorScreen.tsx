import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { useTheme } from '@context/ThemeContext'

const { width } = Dimensions.get('window')

type Preset = {
  id: string
  label: string
  mode: 'light' | 'dark'
  accent: string
}

const PRESETS: Preset[] = [
  { id: 'lightDefault', label: 'Light (Default)', mode: 'light', accent: '#1c6d79' },
  { id: 'lightSoft', label: 'Light (Soft)', mode: 'light', accent: '#9E9E9E' },
  { id: 'darkDefault', label: 'Dark (Default)', mode: 'dark', accent: '#3580FF' },
  { id: 'darkAurora', label: 'Dark (Aurora)', mode: 'dark', accent: '#FFB400' },
]

export default function ThemeColorScreen() {
  const { isDark, toggleTheme, accent, setAccent, theme } = useTheme()

  const applyPreset = (preset: Preset) => {
    // 1) switch mode if needed
    if ((preset.mode === 'dark') !== isDark) {
      toggleTheme()
    }
    // 2) update accent
    setAccent(preset.accent)
  }

  const renderItem = ({ item }: { item: Preset }) => {
    const selected = item.mode === (isDark ? 'dark' : 'light') && item.accent === accent
    return (
      <TouchableOpacity
        style={[
          styles.card,
          theme.styles.card,
          selected && { borderColor: accent, borderWidth: 2 },
        ]}
        activeOpacity={0.7}
        onPress={() => applyPreset(item)}
      >
        <View style={styles.swatchRow}>
          <View
            style={[
              styles.modeCircle,
              { backgroundColor: item.mode === 'dark' ? '#333' : '#EEE' },
            ]}
          />
          <View style={[styles.accentSwatch, { backgroundColor: item.accent }]} />
        </View>
        <Text style={[styles.label, theme.styles.text]}>{item.label}</Text>
        {selected && <Text style={[styles.selected, { color: accent }]}>✓ Selected</Text>}
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, theme.styles.container]}>
      <Text style={[styles.header, theme.styles.text]}>
        Choose your theme preset
      </Text>
      <FlatList
        data={PRESETS}
        keyExtractor={p => p.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 12,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  swatchRow: {
    width: width * 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  modeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 8,
  },
  accentSwatch: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#999',
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  selected: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
})
