import React from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { darkTheme, lightTheme } from "../assets/colors/theme";
import { AntDesign, Entypo, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const SettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDark } = useTheme();
    const themeStyles = isDark ? darkTheme : lightTheme;

    return (
        <View style={[themeStyles.container, styles.container]} >
            <View style={styles.topSection}>
                <Text style={styles.title}>Settings</Text>
            </View>

            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Suggest')}>
                <MaterialIcons name='lightbulb' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Suggest an idea</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Account')}>
                <MaterialIcons name='person' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Security')}>
                <MaterialIcons name='shield' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Security</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Autofill')}>
                <FontAwesome name='magic' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Autofill</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Search')}>
                <MaterialCommunityIcons name='magnify' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Actions')}>
                <MaterialCommunityIcons name='broom' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Actions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Help')}>
                <AntDesign name='questioncircle' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Help and support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Advanced')}>
                <Ionicons name='options' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Advanced</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('About')}>
                <FontAwesome name='info-circle' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>About Pandora</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Privacy')}>
                <MaterialCommunityIcons name='shield-search' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Privacy policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options}>
                <Entypo name='log-out' size={24} style={themeStyles.iconColor} />
                <Text style={styles.optionsText}>Logout</Text>
            </TouchableOpacity>
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