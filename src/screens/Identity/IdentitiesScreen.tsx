import React, { useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    FlatList,
    TouchableOpacity
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { darkTheme, lightTheme } from "@assets/colors/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import IdentityService from "@services/IdentityService";
import { IdentityItem } from "@appTypes/identity.types";
import { AntDesign } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const IdentitiesScreen: React.FC = () => {
    const { isDark } = useTheme();
    const themeStyles = isDark ? darkTheme : lightTheme;
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();

    const { identities, loading, error } = useAppSelector((state) => state.identity);

    useFocusEffect(
        useCallback(() => {
            dispatch(IdentityService.getIdentitiesByUser() as any);
        }, [dispatch])
    );

    const renderItem = ({ item }: { item: IdentityItem }) => (
        <TouchableOpacity
            style={[styles.card, themeStyles.card]}
            onPress={() => navigation.navigate("IdentityDetails", { id: item.id } as any)}
        >
            <View style={styles.cardInner}>
                <Text style={[styles.cardTitle, themeStyles.text]} numberOfLines={1}>
                    {item.fullName}
                </Text>
                <Text style={[styles.cardSubtitle, themeStyles.textGray]} numberOfLines={1}>
                    {item.email}
                </Text>
            </View>
            <AntDesign name="right" size={16} color={themeStyles.icon.color} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, themeStyles.container]}>
            <View style={styles.topSection}>
                <Text style={[styles.title, themeStyles.text]}>Identities</Text>
                <TouchableOpacity
                    style={[styles.addButton, themeStyles.button]}
                    onPress={() => navigation.navigate("EditIdentity", {
                        mode: "create",
                    } as any)
                    }
                >
                    <AntDesign name="plus" size={16} color={themeStyles.buttonText.color} />
                    <Text style={[styles.addButtonText, themeStyles.buttonText]}>Add</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator style={{ marginTop: 40 }} size="large" />
            ) : error ? (
                <Text style={[styles.errorText, themeStyles.text]}>{error}</Text>
            ) : identities.length === 0 ? (
                <Text style={[styles.emptyText, themeStyles.text]}>No identities found. Tap "Add" to create one.</Text>
            ) : (
                <FlatList
                    data={identities}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: width * 0.05,
        paddingTop: StatusBar.currentHeight,
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins_700Bold',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    addButtonText: {
        marginLeft: 6,
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        marginBottom: height * 0.015,
        borderRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    cardInner: {
        flex: 1,
        marginRight: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
    },
    cardSubtitle: {
        marginTop: 4,
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
    },
    errorText: {
        marginTop: 40,
        textAlign: 'center',
        color: 'red',
        fontSize: 16,
    },
    emptyText: {
        marginTop: 40,
        textAlign: 'center',
        fontSize: 16,
    },
});

export default IdentitiesScreen;