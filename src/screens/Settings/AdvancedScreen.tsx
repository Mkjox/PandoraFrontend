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
import { useTheme } from '@context/ThemeContext';
import { lightTheme, darkTheme } from '@assets/colors/theme';

const { width } = Dimensions.get('window');

const AdvancedScreen: React.FC = () => {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;

    const [autoBackup, setAutoBackup] = useState(true);

    return (
        <ScrollView style={[styles.container, theme.styles.container]}>
            <View style={styles.spacer} />

            <Text style={[styles.title, theme.styles.text]}>Advanced Settings</Text>

            <View style={[styles.group, theme.styles.card, theme.styles.border]}>
                <Text style={[styles.itemHeader, theme.styles.text]}>Data Backup</Text>
                <View style={styles.itemRow}>
                    <Text style={[styles.itemLabel, theme.styles.text]}>Auto Backup</Text>
                    <Switch value={autoBackup} onValueChange={setAutoBackup} />
                </View>
                <Text style={[styles.itemHelp, theme.styles.text]}>
                    When on, your vault is backed up every time you make a change.
                </Text>
                <TouchableOpacity style={styles.linkRow}>
                    <Text style={[styles.linkText, theme.styles.text]}>Run Backup Now</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.group, theme.styles.card, theme.styles.border]}>
                <Text style={[styles.itemHeader, theme.styles.text]}>Data Import/Export</Text>
                <TouchableOpacity style={styles.linkRow}>
                    <Text style={[styles.linkText, theme.styles.text]}>Export All Data</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkRow}>
                    <Text style={[styles.linkText, theme.styles.text]}>Import Data File</Text>
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
    group: {
        marginHorizontal: width * 0.05,
        marginBottom: 16,
        borderRadius: 8,
        padding: 12,
        elevation: 1,
    },
    itemHeader: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: 8,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    itemLabel: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
    },
    itemHelp: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#888',
        marginBottom: 8,
    },
    linkRow: {
        paddingVertical: 8,
    },
    linkText: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        textDecorationLine: 'underline',
    },
});

export default AdvancedScreen;