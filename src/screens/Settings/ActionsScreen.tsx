import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    Dimensions,
    Switch,
    TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../assets/colors/theme';

const { height, width } = Dimensions.get('window');

const ActionsScreen: React.FC = () => {
    const { themeStyles } = useTheme();

    const [autoLock, setAutoLock] = useState(true);
    const [clearClipboard, setClearClipboard] = useState(false);

    return (
        <ScrollView style={[styles.container, themeStyles.container]}>
            <View style={styles.spacer} />

            <Text style={[styles.title, themeStyles.text]}>Actions</Text>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, themeStyles.text]}>Auto-Lock</Text>
                <View style={styles.optionRow}>
                    <Text style={[styles.optionText, themeStyles.text]}>
                        {autoLock ? 'Enabled' : 'Disabled'}
                    </Text>
                    <Switch value={autoLock} onValueChange={setAutoLock} />
                </View>
                <Text style={[styles.helperText, themeStyles.text]}>
                    Automatically lock the app after inactivity.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, themeStyles.text]}>Clear Clipboard</Text>
                <View style={styles.optionRow}>
                    <Text style={[styles.optionText, themeStyles.text]}>
                        {clearClipboard ? 'Enabled' : 'Disabled'}
                    </Text>
                    <Switch value={clearClipboard} onValueChange={setClearClipboard} />
                </View>
                <Text style={[styles.helperText, themeStyles.text]}>
                    Clear clipboard automatically after copying credentials.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionHeader, themeStyles.text]}>Manual Actions</Text>
                <TouchableOpacity style={[styles.button, themeStyles.button]}>
                    <Text style={[styles.buttonText, themeStyles.buttonText]}>Clear All Sessions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, themeStyles.button]}>
                    <Text style={[styles.buttonText, themeStyles.buttonText]}>Sync Now</Text>
                </TouchableOpacity>
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
    button: {
        marginTop: 8,
        height: height * 0.055,
        borderRadius: 6,
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
        fontFamily: 'Poppins_500Medium',
    },
});

export default ActionsScreen;