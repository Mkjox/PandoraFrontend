import React, { useMemo } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { darkTheme, lightTheme } from "../../assets/colors/theme"
import { MaterialIcons, FontAwesome5, Entypo } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useAppSelector } from "../../redux/hooks"
import { isStrongPassword } from "../../utils/password"

const { width, height } = Dimensions.get("window")

type Tool = {
  id: string
  title: string
  subtitle: string
  icon: React.ReactElement
  onPress: () => void
}

const SecurityToolsScreen: React.FC = () => {
  const { isDark } = useTheme()
  const themeStyles = isDark ? darkTheme : lightTheme
  const navigation = useNavigation();

  const { passwords } = useAppSelector(s => s.passwords);
  const percentage = useMemo(() => {
    if (!passwords.length) return '0.00';
    const strongCount = passwords.filter(pw => isStrongPassword(pw.Password)).length;
    return ((strongCount / passwords.length) * 100).toFixed(2);
  }, [passwords]);

  const tools: Tool[] = [
    {
      id: "generator",
      title: "Password Generator",
      subtitle: "Create strong, unique passwords",
      icon: <MaterialIcons name="vpn-key" size={24} color={themeStyles.icon.color} />,
      onPress: () => { navigation.navigate("PasswordGenerator" as never) },
    },
    {
      id: "emergency",
      title: "Emergency Access",
      subtitle: "Peace of mind in an emergency",
      icon: <FontAwesome5 name="ambulance" size={24} color={themeStyles.icon.color} />,
      onPress: () => { navigation.navigate("EmergencyAccess" as never) },
    },
    {
      id: "challenge",
      title: `Security Challenge (${percentage}%)`,
      subtitle: "Put your passwords to the test",
      icon: <MaterialIcons name="security" size={24} color={themeStyles.icon.color} />,
      onPress: () => { navigation.navigate("SecurityChallenge" as never) },
    },
    {
      id: "dashboard",
      title: "Security Dashboard",
      subtitle: "Monitor your online security",
      icon: <MaterialIcons name="dashboard" size={24} color={themeStyles.icon.color} />,
      onPress: () => { navigation.navigate("SecurityDashboard" as never) },
    },
    {
      id: "identities",
      title: "Identities",
      subtitle: "Manage your personal identities",
      icon: <MaterialIcons name="badge" size={24} color={themeStyles.icon.color} />,
      onPress: () => { navigation.navigate("Identities" as never); },
    },
  ]

  const renderItem = ({ item }: { item: Tool }) => (
    <TouchableOpacity
      style={[styles.cardInnerWrapper, themeStyles.card, themeStyles.border]}
      onPress={item.onPress}
    >
      <View style={styles.cardIcon}>
        {item.icon}
      </View>
      <View style={styles.cardInnerAlignment}>
        <Text style={[styles.cardTitle, themeStyles.text]}>{item.title}</Text>
        <Text style={[styles.cardContent, themeStyles.textGray]} numberOfLines={1}>
          {item.subtitle}
        </Text>
      </View>
      <Entypo
        name="chevron-right"
        size={24}
        color={themeStyles.icon.color}
        style={styles.chevron}
      />
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container, themeStyles.container]}>
      <View style={styles.topSection}>
        <Text style={[styles.title, themeStyles.text]}>Security Tools</Text>
      </View>
      <FlatList
        data={tools}
        keyExtractor={t => t.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topSection: {
    marginTop: StatusBar.currentHeight,
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.02
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold"
  },
  listContent: {
    paddingBottom: 20
  },
  cardInnerWrapper: {
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.01,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    paddingHorizontal: 12,
    paddingVertical: 14
  },
  cardIcon: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  cardInnerAlignment: {
    flex: 1,
    justifyContent: "center"
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    marginBottom: 2
  },
  cardContent: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular"
  },
  chevron: {
    marginLeft: 8
  },
})

export default SecurityToolsScreen;