import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    Dimensions,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@context/ThemeContext';
import { lightTheme, darkTheme } from '@assets/colors/theme';
import Toast from 'react-native-toast-message';
import CustomButton from '@components/CustomButton';
import CustomSpinner from '@components/CustomSpinner';

const { height, width } = Dimensions.get('window');
const COOLDOWN_HOURS = 6; // lock period after a suggestion
const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;

const SuggestScreen: React.FC = () => {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;

    const [suggestion, setSuggestion] = useState('');
    const [isOnCooldown, setIsOnCooldown] = useState(false);
    const [remainingTime, setRemainingTime] = useState<number | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        checkCooldown();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const checkCooldown = async () => {
        const lastSent = await AsyncStorage.getItem('lastSuggestionTime');
        if (lastSent) {
            const lastTime = parseInt(lastSent, 10);
            const now = Date.now();
            const diff = now - lastTime;

            if (diff < COOLDOWN_MS) {
                const timeLeft = COOLDOWN_MS - diff;
                startTimer(timeLeft);
            }
        }
    };

    const startTimer = (initialMs: number) => {
        setIsOnCooldown(true);
        updateRemainingTime(initialMs);

        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setRemainingTime(prev => {
                if (!prev) return null;
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    setIsOnCooldown(false);
                    return null;
                }
                return prev - 1;
            });
        }, 60000); // update every 1 min
    };

    const updateRemainingTime = (ms: number) => {
        const minutesLeft = Math.ceil(ms / (1000 * 60));
        setRemainingTime(minutesLeft);
    };

    const handleSubmit = async () => {
        if (!suggestion.trim()) {
            return (
                Toast.show({
                    type: 'error',
                    text1: 'Oops!',
                    text2: 'Please enter your suggestion before submitting.'
                })
            )
        }

        if (isOnCooldown) {
            return (
                Toast.show({
                    type: 'error',
                    text1: 'Slow down!',
                    text2: `You can only send one suggestion every ${COOLDOWN_HOURS} hours.\nPlease wait about ${remainingTime} minutes.`
                })
            )
        }

        // TODO: send suggestion to backend/email service
        Toast.show({
            type: 'success',
            text1: 'Thank you!',
            text2: 'Your suggestion has been sent.'
        });
        setSuggestion('');

        const now = Date.now();
        await AsyncStorage.setItem('lastSuggestionTime', now.toString());
        startTimer(COOLDOWN_MS);
    };

    return (
        <ScrollView style={[styles.container, theme.styles.container]}>
            <View style={styles.spacer} />

            <Text style={[styles.title, theme.styles.text]}>Send Us Your Suggestions</Text>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, theme.styles.text]}>We’re Listening</Text>
                <Text style={[styles.sectionBody, theme.styles.text]}>
                    Got an idea or feedback? Let us know how we can improve Pandora. Your input helps shape future updates!
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, theme.styles.text]}>Your Suggestion</Text>
                <TextInput
                    style={[styles.textArea, theme.styles.card]}
                    multiline
                    placeholder="Type your suggestion here..."
                    placeholderTextColor={isDark ? '#888' : '#666'}
                    value={suggestion}
                    onChangeText={setSuggestion}
                    editable={!isOnCooldown}
                />
            </View>

            {/* <TouchableOpacity
                style={[
                    styles.button,
                    theme.styles.button,
                    isOnCooldown && { opacity: 0.5 }
                ]}
                onPress={handleSubmit}
                disabled={isOnCooldown}
            >
                <Text style={[styles.buttonText, theme.styles.buttonText]}>
                    {isOnCooldown
                        ? `Wait ${remainingTime} min`
                        : 'Submit'}
                </Text>
            </TouchableOpacity> */}

            <CustomButton
                onPress={handleSubmit}
                disabled={isOnCooldown}
                title={isOnCooldown ? `Wait ${remainingTime} min` : 'Submit'}
                style={[
                    styles.button,
                ]}
            />


        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    spacer: { height: StatusBar.currentHeight || 20 },
    title: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        marginHorizontal: width * 0.05,
        marginBottom: 20,
    },
    section: {
        marginHorizontal: width * 0.05,
        marginBottom: 24,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#888',
        paddingBottom: 12,
    },
    sectionHeader: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: 6,
    },
    sectionBody: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        lineHeight: 22,
    },
    textArea: {
        height: 120,
        borderRadius: 8,
        padding: 12,
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        marginTop: 8,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#ccc',
        elevation: 2,
    },
    button: {
    height: height * 0.06,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal: width * 0.05,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
    },
});

export default SuggestScreen;
