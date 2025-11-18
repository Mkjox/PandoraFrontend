import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Dimensions,
    Switch,
    TouchableOpacity,
    Alert,
} from 'react-native'
import Slider from '@react-native-community/slider'
import { useTheme } from '@context/ThemeContext'
import { darkTheme, lightTheme } from '@assets/colors/theme'
import CustomButton from '@components/CustomButton'
import * as Clipboard from 'expo-clipboard'
import Toast from 'react-native-toast-message'
import CustomCard from '@components/CustomCard'

const { height, width } = Dimensions.get('window')

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
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;

    const [length, setLength] = useState(12)
    const [includeUpper, setIncludeUpper] = useState(true)
    const [includeNumbers, setIncludeNumbers] = useState(true)
    const [includeSymbols, setIncludeSymbols] = useState(false)
    const [password, setPassword] = useState('')

    const onGenerate = () => {
        if (length < 4) {
            Toast.show({
                type: 'error',
                text1: 'Length too short',
                text2: 'Please choose at least 4 characters.'
            });
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
        Clipboard.setStringAsync(password)
        Toast.show({
            type: 'info',
            text1: 'Copied to clipboard.',
            text2: 'Clipboard will get cleared after 15 seconds'
        });

        setTimeout(() => {
            Clipboard.setStringAsync(' ');
        }, 15000);
    }

    return (
        <View style={[styles.container, theme.styles.container]}>
            <Text style={[styles.title, theme.styles.text]}>
                Password Generator
            </Text>

            <View style={[styles.card, theme.styles.card]}>
                <Text style={[styles.label, theme.styles.text]}>Length: {length}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={4}
                    maximumValue={32}
                    step={1}
                    value={length}
                    minimumTrackTintColor={theme.styles.button.backgroundColor}
                    onValueChange={setLength}
                />

                <View style={styles.row}>
                    <Text style={[styles.label, theme.styles.text]}>
                        Include Uppercase
                    </Text>
                    <Switch
                        value={includeUpper}
                        onValueChange={setIncludeUpper}
                        trackColor={{
                            true: theme.styles.button.backgroundColor,
                            false: '#888',
                        }}
                        thumbColor={includeUpper ? '#fff' : '#ccc'}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={[styles.label, theme.styles.text]}>
                        Include Numbers
                    </Text>
                    <Switch
                        value={includeNumbers}
                        onValueChange={setIncludeNumbers}
                        trackColor={{
                            true: theme.styles.button.backgroundColor,
                            false: '#888',
                        }}
                        thumbColor={includeNumbers ? '#fff' : '#ccc'}
                    />
                </View>

                <View style={styles.row}>
                    <Text style={[styles.label, theme.styles.text]}>
                        Include Symbols
                    </Text>
                    <Switch
                        value={includeSymbols}
                        onValueChange={setIncludeSymbols}
                        trackColor={{
                            true: theme.styles.button.backgroundColor,
                            false: '#888',
                        }}
                        thumbColor={includeSymbols ? '#fff' : '#ccc'}
                    />
                </View>

                <CustomButton
                    onPress={onGenerate}
                    title='Generate'
                    style={[styles.button, theme.styles.button]}
                />

            </View>

            {password ? (
                <>
                    <CustomCard style={[styles.resultCard, theme.styles.card, theme.styles.border]}>
                        <Text style={[styles.passwordText, theme.styles.text]}>
                            {password}
                        </Text>
                    </CustomCard>
                    <View style={{padding: 16}}>
                    <CustomButton
                        onPress={onCopy}
                        title='Copy'
                        style={[styles.copyButton, theme.styles.button]}
                    />
                    </View>
                </>
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
        height: height * 0.06,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
    resultCard: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 16
    },
    passwordText: {
        fontSize: 18,
        fontFamily: 'Poppins_500Medium',
    },
    copyButton: {
        height: height * 0.06,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    copyText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
    },
})

export default PasswordGeneratorScreen