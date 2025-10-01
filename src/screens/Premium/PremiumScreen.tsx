import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../assets/colors/theme';

const { width } = Dimensions.get("window");

const PremiumScreen = () => {
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <View style={styles.hero}>
          <Ionicons
            name="diamond-outline"
            size={72}
            color={themeStyles.button.backgroundColor}
          />
          <Text style={[styles.heroTitle, { color: themeStyles.text.color }]}>
            Go Premium
          </Text>
          <Text
            style={[styles.heroSubtitle, { color: themeStyles.textGray.color }]}
          >
            Unlock full potential of your passwords
          </Text>
        </View>

        {/* Pricing Card */}
        <View style={[styles.pricingCard, { backgroundColor: themeStyles.card.backgroundColor }]}>
          <Text style={[styles.priceTitle, { color: themeStyles.text.color }]}>
            Premium Plan
          </Text>
          <Text style={[styles.priceValue, { color: themeStyles.button.backgroundColor }]}>
            $4.99
          </Text>
          <Text style={[styles.perMonth, { color: themeStyles.textGray.color }]}>
            per month
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Feature
            theme={themeStyles}
            icon="lock-closed-outline"
            title="Unlimited Vaults"
            desc="Save all your passwords securely"
          />
          <Feature
            theme={themeStyles}
            icon="key-outline"
            title="Biometric Unlock"
            desc="Fast access with fingerprint or Face ID"
          />
          <Feature
            theme={themeStyles}
            icon="cloud-upload-outline"
            title="Cloud Backup"
            desc="Keep your vault always synced"
          />
          <Feature
            theme={themeStyles}
            icon="shield-checkmark-outline"
            title="Advanced Security"
            desc="Top-level encryption and privacy"
          />
        </View>

        {/* CTA */}
        <TouchableOpacity style={[styles.button, themeStyles.button]}>
          <Text style={[styles.buttonText, themeStyles.buttonText]}>Upgrade Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const Feature = ({ theme, icon, title, desc }: any) => (
  <View style={[styles.featureCard, { backgroundColor: theme.card.backgroundColor }]}>
    <Ionicons name={icon} size={28} color={theme.icon.color} />
    <View style={{ flex: 1 }}>
      <Text style={[styles.featureTitle, { color: theme.text.color }]}>{title}</Text>
      <Text style={[styles.featureDesc, { color: theme.textGray.color }]}>{desc}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  hero: {
    alignItems: "center",
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 10,
  },
  heroSubtitle: {
    fontSize: 15,
    marginTop: 6,
    textAlign: "center",
    maxWidth: width * 0.8,
  },
  pricingCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  priceTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 36,
    fontWeight: "800",
  },
  perMonth: {
    fontSize: 14,
    marginTop: 4,
  },
  features: {
    marginBottom: 30,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    marginBottom: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  featureDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PremiumScreen;
