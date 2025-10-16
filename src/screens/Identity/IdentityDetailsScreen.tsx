import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useTheme } from "@context/ThemeContext";
import { darkTheme, lightTheme } from "@assets/colors/theme";
import IdentityService from "@services/IdentityService";
import { IdentityItem } from "@appTypes/identity.types";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

type RootStackParamList = {
    IdentityDetails: { id: string };
};
type IdentityDetailsRouteProp = RouteProp<RootStackParamList, "IdentityDetails">;

const { width } = Dimensions.get("window");

const IdentityDetailsScreen: React.FC = () => {
    const route = useRoute<IdentityDetailsRouteProp>();
    const navigation = useNavigation<any>();
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;
    const [item, setItem] = useState<IdentityItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { id } = route.params;

    useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await IdentityService.getIdentityById(id);
            if (res.success && res.data) {
                setItem(res.data);
                setError(null);
            } else {
                setError(res.message || "Identity not found");
            }
            setLoading(false);
        })();
    }, [id]);

    const handleDelete = async () => {
        Alert.alert(
            "Delete Identity",
            "Are you sure you want to delete this identity?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await IdentityService.deleteIdentity(id);
                            navigation.goBack();
                        } catch (error) {
                            console.error("Failed to delete identity:", error);
                            // Optionally show an error toast or alert here
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={[theme.styles.container, styles.center]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error || !item) {
        return (
            <View style={[theme.styles.container, styles.center]}>
                <Text style={theme.styles.text}>
                    {error || "No details available"}
                </Text>
            </View>
        )
    }

    return (
        <ScrollView style={theme.styles.container}>
            <View style={styles.spacer} />

            <View style={[styles.header, theme.styles.card]}>
                <Text style={[styles.title, theme.styles.text]}>{item.fullName}</Text>
            </View>

            <View style={[styles.section, theme.styles.card]}>
                <Text style={[styles.label, theme.styles.text]}>Email:</Text>
                <Text style={[styles.value, theme.styles.text]}>{item.email}</Text>
            </View>

            {item.phone ? (
                <View style={[styles.section, theme.styles.card]}>
                    <Text style={[styles.label, theme.styles.text]}>Phone:</Text>
                    <Text style={[styles.value, theme.styles.text]}>{item.phone}</Text>
                </View>
            ) : null}

            {item.address ? (
                <View style={[styles.section, theme.styles.card]}>
                    <Text style={[styles.label, theme.styles.text]}>Address:</Text>
                    <Text style={[styles.value, theme.styles.text]}>{item.address}</Text>
                </View>
            ) : null}

            {item.notes ? (
                <View style={[styles.section, theme.styles.card]}>
                    <Text style={[styles.label, theme.styles.text]}>Notes:</Text>
                    <Text style={[styles.value, theme.styles.text]}>{item.notes}</Text>
                </View>
            ) : null}

            <TouchableOpacity
                style={[styles.editButton, theme.styles.button]}
                onPress={() =>
                    navigation.navigate("EditIdentity", {
                        mode: "edit",
                        identityId: item.id,
                        fullName: item.fullName,
                        email: item.email,
                        phone: item.phone,
                        address: item.address,
                        notes: item.notes,
                    } as any)
                }
            >
                <MaterialIcons name="edit" size={20} color={theme.styles.buttonText.color} />
                <Text style={[styles.editText, theme.styles.buttonText]}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.deleteButton, theme.styles.card]}
                onPress={handleDelete}
            >
                <Entypo name="trash" size={20} color="red" />
                <Text style={[styles.deleteText, { color: "red" }]}>Delete</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    spacer: {
        height: StatusBar.currentHeight || 20,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        marginHorizontal: width * 0.05,
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
        elevation: 1,
    },
    title: {
        fontSize: 20,
        fontFamily: "Poppins_700Bold",
    },
    section: {
        marginHorizontal: width * 0.05,
        marginBottom: 12,
        padding: 12,
        borderRadius: 8,
        elevation: 2,
    },
    label: {
        fontSize: 14,
        fontFamily: "Poppins_600SemiBold",
    },
    value: {
        fontSize: 16,
        fontFamily: "Poppins_400Regular",
        marginTop: 4,
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: width * 0.05,
        marginTop: 24,
        padding: 12,
        borderRadius: 8,
        justifyContent: "center",
    },
    editText: {
        fontSize: 16,
        fontFamily: "Poppins_500Medium",
        marginLeft: 8,
    },
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: width * 0.05,
        marginTop: 12,
        padding: 12,
        borderRadius: 8,
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "red",
    },
    deleteText: {
        fontSize: 16,
        fontFamily: "Poppins_500Medium",
        marginLeft: 8,
    },
});

export default IdentityDetailsScreen;