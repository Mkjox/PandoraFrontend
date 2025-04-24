import React from "react";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { darkTheme, lightTheme } from "../assets/colors/theme";
import { AntDesign, Entypo, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const {width, height} = Dimensions.get("window");

const SettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const { isDark } = useTheme();
    const themeStyles = isDark ? darkTheme : lightTheme;

    return (
        <View style={[themeStyles.container, styles.container]} >
            <View style={styles.topSection}>
                <Text style={[styles.title, themeStyles.text]}>Settings</Text>
            </View>

            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Suggest')}>
                <MaterialIcons name='lightbulb' size={24} style={themeStyles.iconColor} />
                <Text style={[styles.optionsText, themeStyles.text]}>Suggest an idea</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Account')}>
                <MaterialIcons name='person' size={24} style={themeStyles.iconColor} />
                <Text style={[styles.optionsText, themeStyles.text]}>Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Security')}>
                <MaterialIcons name='shield' size={24} style={themeStyles.iconColor} />
                <Text style={[styles.optionsText, themeStyles.text]}>Security</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Autofill')}>
                <FontAwesome name='magic' size={24} style={themeStyles.iconColor} />
                <Text style={[styles.optionsText, themeStyles.text]}>Autofill</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Search')}>
                <MaterialCommunityIcons name='magnify' size={24} style={themeStyles.iconColor} />
                <Text style={[styles.optionsText, themeStyles.text]}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Actions')}>
                <MaterialCommunityIcons name='broom' size={24} style={themeStyles.iconColor} />
                <Text style={[styles.optionsText, themeStyles.text]}>Actions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Help')}>
                <AntDesign name='questioncircle' size={24} style={themeStyles.iconColor} />
                <Text style={[styles.optionsText, themeStyles.text]}>Help and support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Advanced')}>
                <Ionicons name='options' size={24} style={themeStyles.iconColor} />
                <Text style={[styles.optionsText, themeStyles.text]}>Advanced</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('About')}>
                <FontAwesome name='info-circle' size={24} style={themeStyles.iconColor} />
                <Text style={[styles.optionsText, themeStyles.text]}>About Pandora</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate('Privacy')}>
                <MaterialCommunityIcons name='shield-search' size={24} style={themeStyles.iconColor} />
                <Text style={[styles.optionsText, themeStyles.text]}>Privacy policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.options}>
                <Entypo name='log-out' size={24} style={themeStyles.iconColor} />
                <Text style={[styles.optionsText, themeStyles.text]}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: width * 0.05
    },
    topSection: {
        marginTop: StatusBar.currentHeight,
    },
    title: {
        fontSize: 22,
        marginVertical: 20,
        fontFamily: 'Poppins_700Bold',
    },
    options: {
        flexDirection: 'row',
        marginVertical: 15,
    },
    optionsText: {
        marginHorizontal: 10,
        fontFamily: 'Poppins_500Medium',
        fontSize: 16
    }
})

export default SettingsScreen