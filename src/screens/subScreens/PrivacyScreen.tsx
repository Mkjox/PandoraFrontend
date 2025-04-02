import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../assets/colors/theme";

const PrivacyScreen = () => {
    const { isDark } = useTheme();

    const themeStyles = isDark ? darkTheme : lightTheme;

    return (
        <View style={[styles.container, themeStyles.container]}>
            <View style={styles.margin}>
                <Text>This is SuggestScreen</Text>
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

export default PrivacyScreen