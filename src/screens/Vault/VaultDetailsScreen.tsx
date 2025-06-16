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
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../assets/colors/theme";
import PersonalVaultService from "../../services/PersonalVaultService";
import { PersonalVaultPayload } from "../../types/personalVault.types";
import { MaterialIcons } from "@expo/vector-icons";
import { ServiceResult } from "../../types/service.types";

type RootStackParamList = {
  VaultDetails: { id: string };
};

type VaultDetailsRouteProp = RouteProp<RootStackParamList, "VaultDetails">;

const { width } = Dimensions.get("window");

export default function VaultDetailsScreen() {
  const route = useRoute<VaultDetailsRouteProp>();
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  const [vault, setVault] = useState<PersonalVaultPayload & { id: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = route.params;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res: ServiceResult<PersonalVaultPayload & { id: string }> =
          await PersonalVaultService.getVaultsById(id);
        if (res.success && res.data) {
          setVault(res.data);
          setError(null);
        } else {
          setError(res.message || "Vault not found");
        }
      } catch (e: any) {
        setError("Failed to load vault");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !vault) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <Text style={themeStyles.text}>{error || "No details available"}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={themeStyles.container}>
      <View style={styles.spacer} />

      <View style={[styles.header, themeStyles.card]}>
        <Text style={[styles.title, themeStyles.text]}>{vault.Title}</Text>
        <Text style={[styles.subtitle, themeStyles.textGray]} numberOfLines={1}>
          {vault.Content}
        </Text>
      </View>

      <View style={[styles.section, themeStyles.card]}>
        <Text style={[styles.label, themeStyles.text]}>URL:</Text>
        <Text style={[styles.value, themeStyles.text]}>{vault.Url || "—"}</Text>
      </View>

      {vault.MediaFile ? (
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.label, themeStyles.text]}>Media (base64):</Text>
          <Text
            style={[styles.value, themeStyles.text]}
            numberOfLines={1}
          >
            {vault.MediaFile.substring(0, 30)}…
          </Text>
        </View>
      ) : null}

      {vault.Summary ? (
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.label, themeStyles.text]}>Summary:</Text>
          <Text style={[styles.value, themeStyles.text]}>{vault.Summary}</Text>
        </View>
      ) : null}

      {vault.Tags && vault.Tags.length > 0 ? (
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.label, themeStyles.text]}>Tags:</Text>
          <Text style={[styles.value, themeStyles.text]}>
            {vault.Tags.join(", ")}
          </Text>
        </View>
      ) : null}

      {vault.IsLocked ? (
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.label, themeStyles.text]}>Locked Until:</Text>
          <Text style={[styles.value, themeStyles.text]}>
            {vault.UnlockDate
              ? new Date(vault.UnlockDate).toLocaleDateString()
              : "—"}
          </Text>
        </View>
      ) : null}

      {vault.ExpirationDate ? (
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.label, themeStyles.text]}>Expires:</Text>
          <Text style={[styles.value, themeStyles.text]}>
            {new Date(vault.ExpirationDate).toLocaleDateString()}
          </Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.editButton, themeStyles.button]}
        onPress={() =>
          navigation.navigate("AddCredentials" as any, {
            tab: "vault",
            vaultId: vault.id,
            userId: vault.UserId,
            title: vault.Title,
            content: vault.Content,
            url: vault.Url,
            mediaFile: vault.MediaFile,
            summary: vault.Summary,
            tags: vault.Tags.join(","),
            isLocked: vault.IsLocked,
            unlockDate: vault.UnlockDate,
            expirationDate: vault.ExpirationDate,
            categoryId: vault.CategoryId,
            isFavorite: vault.IsFavorite,
          })
        }
      >
        <MaterialIcons name="edit" size={20} color={themeStyles.buttonText.color} />
        <Text style={[styles.editText, themeStyles.buttonText]}>Edit</Text>
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
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    marginTop: 4,
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
});
