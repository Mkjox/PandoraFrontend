import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { lightTheme, darkTheme } from '@assets/colors/theme';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const { width } = Dimensions.get('window');

const HelpScreen: React.FC = () => {
    const { isDark } = useTheme();
    const themeStyles = isDark ? darkTheme : lightTheme;

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: 'How do I reset my master password?',
            answer:
                'Go to Settings → Security → Change Password. You will need your current master password to proceed.',
        },
        {
            question: 'How can I back up my data?',
            answer:
                'Your data is automatically encrypted and backed up to the cloud whenever you make changes.',
        },
        {
            question: 'What if I forget my master password?',
            answer:
                'For security, we cannot recover your master password. You must reset the app, which will erase existing data.',
        },
    ];

    const toggle = (i: number) => {
        LayoutAnimation.easeInEaseOut();
        setOpenIndex(openIndex === i ? null : i);
    };

    return (
        <ScrollView style={[styles.container, themeStyles.container]}>
            <View style={styles.spacer} />

            <Text style={[styles.title, themeStyles.text]}>Help & Support</Text>

            <View style={styles.accordion}>
                {faqs.map((faq, i) => {
                    const isOpen = openIndex === i;
                    return (
                        <View key={i} style={[styles.item, themeStyles.card, themeStyles.border]}>
                            <TouchableOpacity onPress={() => toggle(i)} style={styles.questionRow}>
                                <Text style={[styles.question, themeStyles.text]}>{faq.question}</Text>
                                <Text style={[styles.chevron, themeStyles.text]}>
                                    {isOpen ? '▲' : '▼'}
                                </Text>
                            </TouchableOpacity>
                            {isOpen && (
                                <Text style={[styles.answer, themeStyles.text]}>
                                    {faq.answer}
                                </Text>
                            )}
                        </View>
                    );
                })}
            </View>

            <TouchableOpacity style={[styles.emailButton, themeStyles.button]} onPress={() => { }}>
                <Text style={[styles.emailButtonText, themeStyles.buttonText]}>✉️ Email Support</Text>
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
        marginBottom: 16,
    },
    accordion: {
        marginHorizontal: width * 0.05,
    },
    item: {
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        elevation: 2,
    },
    questionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        flex: 1,
    },
    chevron: {
        marginLeft: 8,
        fontSize: 14,
    },
    answer: {
        marginTop: 8,
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        lineHeight: 20,
    },
    emailButton: {
        marginHorizontal: width * 0.05,
        marginTop: 24,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    emailButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
    },
});

export default HelpScreen;