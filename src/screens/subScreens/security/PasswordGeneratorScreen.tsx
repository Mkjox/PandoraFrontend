import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Dimensions,
    Switch,
    TouchableOpacity,
    Clipboard,
    Alert,
} from 'react-native'
import Slider from '@react-native-community/slider'
import { useTheme } from '../../../context/ThemeContext'
import { darkTheme, lightTheme } from '../../../assets/colors/theme'

const { width } = Dimensions.get('window')

// helper to build the charset
const buildCharset = (
    includeUpper: boolean,
    includeNumbers: boolean,
    includeSymbols: boolean
) => {
    let cs = 'abcdefghijklmnopqrstuvwxyz'
    if (includeUpper) cs += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeNumbers) cs += '0123456789'
    if (includeSymbols) cs += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    return cs
}

// random password generator
const generatePassword = (
    length: number,
    includeUpper: boolean,
    includeNumbers: boolean,
    includeSymbols: boolean
) => {
    const charset = buildCharset(includeUpper, includeNumbers, includeSymbols)
    let pw = ''
    for (let i = 0; i < length; i++) {
        pw += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return pw
}

const PasswordGeneratorScreen: React.FC = () => {
    const { isDark } = useTheme()
    const themeStyles = isDark ? darkTheme : lightTheme

    const [length, setLength] = useState(12)
    const [includeUpper, setIncludeUpper] = useState(true)
    const [includeNumbers, setIncludeNumbers] = useState(true)
    const [includeSymbols, setIncludeSymbols] = useState(false)
    const [password, setPassword] = useState('')

    const onGenerate = () => {
        if (length < 4) {
            Alert.alert('Length too short', 'Please choose at least 4 characters.')
            return
        }
        const pw = generatePassword(
            length,
            includeUpper,
            includeNumbers,
            includeSymbols
        )
        setPassword(pw)
    }

    const onCopy = () => {
        if (!password) return
        Clipboard.setString(password)
        Alert.alert('Copied to clipboard')
    }

    return (
        <View style={[styles.container, themeStyles.container]}>
            <Text style={[styles.title, themeStyles.text]}>
                Password Generator
            </Text>

            <View style={[styles.card, themeStyles.card]}>
                <Text style={[styles.label, themeStyles.text]}>Length: {length}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={4}
                    maximumValue={32}
                    step={1}
                    value={length}
                    minimumTrackTintColor={themeStyles.button.backgroundColor}
                    onValueChange={setLength}
                />

                <View style={styles.row}>
                    <Text style={[styles.label, themeStyles.text]}>
                        Include Uppercase
                    </Text>
                    <Switch
                        value={includeUpper}
                        onValueChange={setIncludeUpper}
                        trackColor={{
                            true: themeStyles.button.backgroundColor,
                            false: '#888',
                        }}
                        thumbColor={includeUpper ? '#fff' : '#ccc'}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={[styles.label, themeStyles.text]}>
                        Include Numbers
                    </Text>
                    <Switch
                        value={includeNumbers}
                        onValueChange={setIncludeNumbers}
                        trackColor={{
                            true: themeStyles.button.backgroundColor,
                            false: '#888',
                        }}
                        thumbColor={includeNumbers ? '#fff' : '#ccc'}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={[styles.label, themeStyles.text]}>
                        Include Symbols
                    </Text>
                    <Switch
                        value={includeSymbols}
                        onValueChange={setIncludeSymbols}
                        trackColor={{
                            true: themeStyles.button.backgroundColor,
                            false: '#888',
                        }}
                        thumbColor={includeSymbols ? '#fff' : '#ccc'}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, themeStyles.button]}
                    onPress={onGenerate}
                >
                    <Text style={[styles.buttonText, themeStyles.buttonText]}>
                        Generate
                    </Text>
                </TouchableOpacity>
            </View>

            {password ? (
                <View style={[styles.resultCard, themeStyles.card]}>
                    <Text style={[styles.passwordText, themeStyles.text]}>
                        {password}
                    </Text>
                    <TouchableOpacity
                        style={[styles.copyButton, themeStyles.button]}
                        onPress={onCopy}
                    >
                        <Text style={[styles.copyText, themeStyles.buttonText]}>
                            Copy
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        paddingHorizontal: width * 0.06,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        marginBottom: 16,
    },
    card: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
    },
    slider: {
        width: '100%',
        height: 40,
        marginVertical: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    button: {
        marginTop: 12,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
    resultCard: {
        padding: 16,
        borderRadius: 8,
    },
    passwordText: {
        fontSize: 18,
        fontFamily: 'Poppins_500Medium',
        marginBottom: 12,
    },
    copyButton: {
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    copyText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
    },
})

export default PasswordGeneratorScreen;