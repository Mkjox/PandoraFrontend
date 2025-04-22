import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { darkTheme, lightTheme } from "../assets/colors/theme";
import VaultService from "../services/PersonalVaultService";
import { PersonalVaultPayload } from "../types/personalVault.types";

const { width, height } = Dimensions.get("window");

const PersonalVaultScreen = () => {
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  const [vaults, setVaults] = useState<PersonalVaultPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVaults = async () => {
      try {
        const response = await VaultService.getPersonalVaults();
        if (response.success) {
          setVaults(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to load personal vaults.");
      } finally {
        setLoading(false);
      }
    };

    fetchVaults();
  }, []);

  const renderItem = ({ item }: { item: PersonalVaultPayload }) => (
    <View style={[styles.cardInnerWrapper, themeStyles.card]}>
      <View style={styles.cardIcon}>
        <Text style={{ textAlign: "center" }}>🔐</Text>
      </View>
      <View style={styles.cardInnerAlignment}>
        <Text style={styles.cardTitle}>{item.Title}</Text>
        <Text style={[themeStyles.textGray, styles.cardContent]} numberOfLines={1}>
          {item.Content}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, themeStyles.container]}>
      <View style={styles.topSection}>
        <Text style={[styles.title, themeStyles.text]}>Personal Vault</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#888" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={{ textAlign: "center", color: "red" }}>{error}</Text>
      ) : (
        <FlatList
          data={vaults}
          keyExtractor={(item) => item.Id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    marginTop: StatusBar.currentHeight,
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  listContent: {
    paddingBottom: 20,
  },
  cardInnerWrapper: {
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.01,
    borderRadius: 10,
    height: height * 0.12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    paddingHorizontal: 10,
  },
  cardIcon: {
    backgroundColor: "white",
    height: height * 0.08,
    width: width * 0.16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardInnerAlignment: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    marginBottom: 4,
  },
  cardContent: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
});

export default PersonalVaultScreen;
