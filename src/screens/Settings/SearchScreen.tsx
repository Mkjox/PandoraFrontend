import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Dimensions,
    FlatList,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useTheme } from '@context/ThemeContext';
import { darkTheme, lightTheme } from '@assets/colors/theme';

const { width } = Dimensions.get('window');

const SearchScreen: React.FC = () => {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;
    const [searchQuery, setSearchQuery] = useState('');
    const [recent, setRecent] = useState<string[]>([]);

    const onChangeSearch = (query: string) => setSearchQuery(query);

    const addToRecent = (query: string) => {
        if (!query.trim()) return;
        setRecent((prev) => {
            const updated = [query, ...prev.filter((item) => item !== query)];
            return updated.slice(0, 10); // keep only 10 recent
        });
    };

    const clearRecent = () => setRecent([]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[styles.container, theme.styles.container]}
        >
            <View style={styles.spacer} />

            <Text style={[styles.title, theme.styles.text]}>Search Vault</Text>

            {/* Search Input */}
            <View style={styles.section}>
                <Searchbar
                    placeholder="Type to search..."
                    placeholderTextColor={isDark ? '#888' : '#666'}
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={[
                        styles.searchBar,
                        { backgroundColor: theme.styles.container.backgroundColor },
                    ]}
                    inputStyle={[theme.styles.text, { alignSelf: 'center' }]}
                    onSubmitEditing={() => {
                        addToRecent(searchQuery);
                        setSearchQuery('');
                    }}
                    blurOnSubmit={false}
                />
            </View>

            {/* Recent Searches */}
            <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                    <Text style={[styles.sectionHeader, theme.styles.text]}>
                        Recent Searches
                    </Text>
                    {recent.length > 0 && (
                        <TouchableOpacity onPress={clearRecent}>
                            <Text style={[styles.clearText, theme.styles.text]}>Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {recent.length === 0 ? (
                    <Text style={[styles.helperText, theme.styles.text]}>
                        No recent searches
                    </Text>
                ) : (
                    <FlatList
                        data={recent}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.recentItem, theme.styles.card, theme.styles.border]}
                                onPress={() => setSearchQuery(item)}
                            >
                                <Text style={[styles.recentText, theme.styles.text]}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )}
                        keyboardShouldPersistTaps="handled"
                        style={{ backgroundColor: theme.styles.container.backgroundColor }}
                    />
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    spacer: {
        height: StatusBar.currentHeight || 20,
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
        borderWidth: 1,
        borderColor: '#ccc'
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