import React from "react"
import {
    View,
    Text,
    SectionList,
    StyleSheet,
    StatusBar,
    Dimensions,
    TouchableOpacity,
} from "react-native"
import { useTheme } from "@context/ThemeContext"
import { darkTheme, lightTheme } from "@assets/colors/theme"
import {
    AntDesign,
    Entypo,
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("window")

type Item = { key: string; title: string; icon: React.ReactNode; onPress?: () => void }

const SettingsScreen: React.FC = () => {
    const navigation = useNavigation<any>()
    const { isDark } = useTheme();
    const themeStyles = isDark ? darkTheme : lightTheme;

    const sections: { title: string; data: Item[] }[] = [
        {
            title: "GENERAL",
            data: [
                {
                    key: "suggest",
                    title: "Suggest an idea",
                    icon: <MaterialIcons name="lightbulb" size={20} color={themeStyles.icon.color} />,
                    onPress: () => navigation.navigate("Suggest" as never),
                },
                {
                    key: "account",
                    title: "Account",
                    icon: <MaterialIcons name="person" size={20} color={themeStyles.icon.color} />,
                    onPress: () => navigation.navigate("Account" as never),
                },
                {
                    key: "privacy",
                    title: "Privacy policy",
                    icon: <MaterialCommunityIcons name="shield-search" size={20} color={themeStyles.icon.color} />,
                    onPress: () => navigation.navigate("Privacy" as never),
                },
            ],
        },
        {
            title: "SECURITY",
            data: [
                {
                    key: "security",
                    title: "Security",
                    icon: <MaterialIcons name="shield" size={20} color={themeStyles.icon.color} />,
                    onPress: () => navigation.navigate("Security" as never),
                },
                {
                    key: "autofill",
                    title: "Autofill",
                    icon: <FontAwesome name="magic" size={20} color={themeStyles.icon.color} />,
                    onPress: () => navigation.navigate("Autofill" as never),
                },
                {
                    key: "search",
                    title: "Search",
                    icon: <MaterialCommunityIcons name="magnify" size={20} color={themeStyles.icon.color} />,
                    onPress: () => navigation.navigate("Search" as never),
                },
                {
                    key: "actions",
                    title: "Actions",
                    icon: <MaterialCommunityIcons name="broom" size={20} color={themeStyles.icon.color} />,
                    onPress: () => navigation.navigate("Actions" as never),
                },
            ],
        },
        {
            title: "ADVANCED",
            data: [
                {
                    key: "advanced",
                    title: "Advanced",
                    icon: <Ionicons name="options" size={20} color={themeStyles.icon.color} />,
                    onPress: () => navigation.navigate("Advanced" as never),
                },
                {
                    key: "about",
                    title: "About Pandora",
                    icon: <FontAwesome name="info-circle" size={20} color={themeStyles.icon.color} />,
                    onPress: () => navigation.navigate("About" as never),
                },
                {
                    key: "help",
                    title: "Help and support",
                    icon: <AntDesign name="questioncircle" size={20} color={themeStyles.icon.color} />,
                    onPress: () => navigation.navigate("Help" as never),
                },
            ],
        },
    ]

    const renderItem = ({ item }: { item: Item }) => (
        <TouchableOpacity
            style={[styles.row]}
            // style={[styles.row, themeStyles.border]}
            onPress={item.onPress}
            activeOpacity={0.7}
        >
            <View style={styles.iconWrapper}>
                {item.icon}
            </View>
            <Text style={[styles.rowText, themeStyles.text]}>{item.title}</Text>
            <Entypo name="chevron-right" size={18} color={themeStyles.icon.color} />
        </TouchableOpacity>
    )

    const renderSectionHeader = ({ section }: any) =>
        section.title ? (
            <Text style={[styles.sectionHeader, themeStyles.text]}>{section.title}</Text>
        ) : null

    return (
        <View style={[styles.container, themeStyles.container]}>
            <SectionList
                sections={sections}
                keyExtractor={item => item.key}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}

            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: width * 0.05,
        paddingTop: StatusBar.currentHeight,
    },
    list: {
        paddingBottom: 20,
    },
    sectionHeader: {
        marginTop: 20,
        marginBottom: 8,
        fontSize: 15,
        fontFamily: "Poppins_600SemiBold",
        color: "#888",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    iconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    rowText: {
        flex: 1,
        fontSize: 16,
        fontFamily: "Poppins_500Medium",
    },
    separator: {
        height: 1,
        backgroundColor: "#ccc",
        marginVertical: 4,
    },
})

export default SettingsScreen