import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions,
} from 'react-native'
import { useTheme } from '../../context/ThemeContext'
const { width } = Dimensions.get('window')

const PRESET_COLORS = [
    '#4C4DDC', // blue
    '#E91E63', // pink
    '#FF9800', // orange
    '#4CAF50', // green
    '#9C27B0', // purple
    '#00BCD4', // cyan
]

export default function ThemeColorScreen() {
    const { accent, setAccent, themeStyles } = useTheme()

    const renderSwatch = ({ item }: { item: string }) => {
        const selected = item === accent
        return (
            <TouchableOpacity
                onPress={() => setAccent(item)}
                style={[
                    styles.swatch,
                    { backgroundColor: item },
                    selected && styles.swatchSelected
                ]}
            />
        )
    }

    return (
        <View style={[styles.container, themeStyles.container]}>
            <Text style={[styles.title, themeStyles.text]}>
                Choose your accent color
            </Text>
            <FlatList
                data={PRESET_COLORS}
                keyExtractor={c => c}
                renderItem={renderSwatch}
                horizontal
                contentContainerStyle={styles.list}
                showsHorizontalScrollIndicator={false}
            />
            <View style={styles.preview}>
                <TouchableOpacity
                    style={[styles.buttonSample, themeStyles.button]}
                >
                    <Text style={[styles.buttonText, themeStyles.buttonText]}>
                        Primary Button
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start'
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: 16
    },
    list: {
        paddingVertical: 20
    },
    swatch: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginHorizontal: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    swatchSelected: {
        borderColor: '#FFF',
        elevation: 4,
    },
    preview: {
        marginTop: 40,
        alignItems: 'center',
    },
    buttonSample: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    buttonText: {
        fontFamily: 'Poppins_600SemiBold',
    },
})
