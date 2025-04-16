import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../assets/colors/theme";

const AccountScreen = () => {
    const { isDark } = useTheme();

    const themeStyles = isDark ? darkTheme : lightTheme;

    return (
        <View style={[styles.container, themeStyles.container]}>
            <View style={styles.margin}>
                <Text>This is AccountScreen</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    margin: {
        marginTop: StatusBar.currentHeight
    }
})

export default AccountScreen