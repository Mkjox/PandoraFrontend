import React, { useState } from 'react';
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
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../assets/colors/theme';

const { height, width } = Dimensions.get('window');

const SuggestScreen: React.FC = () => {
    const { themeStyles, isDark } = useTheme();

    const [suggestion, setSuggestion] = useState('');

    const handleSubmit = () => {
        if (!suggestion.trim()) {
            return Alert.alert('Oops!', 'Please enter your suggestion before submitting.');
        }
        // TODO: send suggestion to your backend or email service
        Alert.alert('Thank you!', 'Your suggestion has been sent.');
        setSuggestion('');
    };

    return (
        <ScrollView style={[styles.container, themeStyles.container]}>
            <View style={styles.spacer} />

            <Text style={[styles.title, themeStyles.text]}>Send Us Your Suggestions</Text>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, themeStyles.text]}>We’re Listening</Text>
                <Text style={[styles.sectionBody, themeStyles.text]}>
                    Got an idea or feedback? Let us know how we can improve Pandora. Your input helps shape future updates!
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, themeStyles.text]}>Your Suggestion</Text>
                <TextInput
                    style={[styles.textArea, themeStyles.card]}
                    multiline
                    placeholder="Type your suggestion here..."
                    placeholderTextColor={isDark ? '#888' : '#666'}
                    value={suggestion}
                    onChangeText={setSuggestion}
                />
            </View>

            <TouchableOpacity style={[styles.button, themeStyles.buttonBorder]} onPress={handleSubmit}>
                <Text style={[styles.buttonText, themeStyles.buttonText]}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    spacer: {
        height: StatusBar.currentHeight || 20
    },
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
        elevation: 2
    },
    button: {
        marginHorizontal: width * 0.05,
        marginTop: 8,
        height: height * 0.055,
        borderRadius: 6,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
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
});

export default SuggestScreen;
