import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { darkTheme, lightTheme } from "../assets/colors/theme";
import { AntDesign, Entypo, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const SettingsScreen: React.FC = () => {
    const { isDark } = useTheme();
    const themeStyles = isDark ? darkTheme : lightTheme;

    return (
        <View style={[themeStyles.container, styles.container]} >
            <View style={styles.topSection}>
                <Text style={styles.title}>Settings</Text>
            </View>

            <View style={styles.options}>
                <MaterialIcons name='lightbulb' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Suggest an idea</Text>
            </View>
            <View style={styles.options}>
                <MaterialIcons name='person' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Account</Text>
            </View>
            <View style={styles.options}>
                <MaterialIcons name='shield' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Security</Text>
            </View>
            <View style={styles.options}>
                <FontAwesome name='magic' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Autofill</Text>
            </View>
            <View style={styles.options}>
                <MaterialCommunityIcons name='magnify' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Search</Text>
            </View>
            <View style={styles.options}>
                <MaterialCommunityIcons name='broom' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Actions</Text>
            </View>
            <View style={styles.options}>
                <AntDesign name='questioncircle' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Help and support</Text>
            </View>
            <View style={styles.options}>
                <Ionicons name='options' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Advanced</Text>
            </View>
            <View style={styles.options}>
                <FontAwesome name='info-circle' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>About Pandora</Text>
            </View>
            <View style={styles.options}>
                <MaterialCommunityIcons name='shield-search' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Privacy policy</Text>
            </View>
            <View style={styles.options}>
                <Entypo name='log-out' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Logout</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topSection: {
        marginTop: StatusBar.currentHeight
    },
    title: {
        fontSize: 22,
        margin: 20,
        fontFamily: 'Poppins_700Bold',
    },
    options: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 15
    },
    optionsText: {
        marginHorizontal: 10,
        fontFamily: 'Poppins_500Medium',
        fontSize: 16
    }
})

export default SettingsScreen