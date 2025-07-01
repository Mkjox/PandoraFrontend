import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    Dimensions,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../assets/colors/theme';

const { height, width } = Dimensions.get('window');

const SearchScreen: React.FC = () => {
    const { isDark } = useTheme();
    const themeStyles = isDark ? darkTheme : lightTheme;

    const [searchQuery, setSearchQuery] = useState('');

    // PLACEHOLDER DATA
    const [recent, setRecent] = useState<string[]>([
        'Email account',
        'Bank login',
        'Work VPN',
    ]);

    const onChangeSearch = (query: string) => setSearchQuery(query);

    const clearRecent = () => setRecent([]);

    return (
        <ScrollView style={[styles.container, themeStyles.container]}>
            <View style={styles.spacer} />

            <Text style={[styles.title, themeStyles.text]}>Search Vault</Text>

            {/* Search Input */}
            <View style={styles.section}>
                <Searchbar
                    placeholder="Type to search..."
                    placeholderTextColor={isDark ? '888' : '666'}
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={[styles.searchBar, themeStyles.buttonBorder]}
                    inputStyle={[themeStyles.text, { alignSelf: 'center' }]}
                />
            </View>

            {/* Recent Searches */}
            <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                    <Text style={[styles.sectionHeader, themeStyles.text]}>Recent Searches</Text>
                    {recent.length > 0 && (
                        <TouchableOpacity onPress={clearRecent}>
                            <Text style={[styles.clearText, themeStyles.text]}>Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {recent.length === 0 ? (
                    <Text style={[styles.helperText, themeStyles.text]}>No recent searches</Text>
                ) : (
                    <FlatList
                        data={recent}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={[styles.recentItem, themeStyles.card, themeStyles.border]}>
                                <Text style={[styles.recentText, themeStyles.text]}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
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
    },
    searchBar: {
        borderRadius: 8,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionHeader: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: 8,
    },
    clearText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: '#ff5c5c',
    },
    recentItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginBottom: 8,
    },
    recentText: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
    },
    helperText: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        color: '#888',
        marginTop: 4,
    },
});

export default SearchScreen;