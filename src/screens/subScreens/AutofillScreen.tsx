import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    Dimensions,
    Switch,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../assets/colors/theme';

const { width } = Dimensions.get('window');

const AutofillScreen: React.FC = () => {
    const { isDark } = useTheme();
    const themeStyles = isDark ? darkTheme : lightTheme;

    const [autofillEnabled, setAutofillEnabled] = useState(false);

    const toggleAutofill = () => {
        setAutofillEnabled((prev) => !prev);
        // TODO: persist this setting
    };

    return (
        <ScrollView style={[styles.container, themeStyles.container]}>
            <View style={styles.spacer} />

            <Text style={[styles.title, themeStyles.text]}>Autofill Settings</Text>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, themeStyles.text]}>Enable Autofill</Text>
                <View style={styles.optionRow}>
                    <Text style={[styles.optionText, themeStyles.text]}>
                        {autofillEnabled ? 'On' : 'Off'}
                    </Text>
                    <Switch value={autofillEnabled} onValueChange={toggleAutofill} />
                </View>
                <Text style={[styles.helperText, themeStyles.text]}>
                    When enabled, Pandora will offer to autofill your credentials in compatible apps.
                </Text>
            </View>
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
        marginBottom: 8,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    optionText: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
    },
    helperText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#888',
    },
});

export default AutofillScreen;