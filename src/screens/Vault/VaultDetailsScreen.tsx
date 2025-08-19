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
import PersonalVaultService from "../../services/PersonalVaultService";
import { PersonalVaultPayload } from "../../types/personalVault.types";
import { MaterialIcons } from "@expo/vector-icons";
import { ServiceResult } from "../../types/service.types";

type RootStackParamList = {
  VaultDetails: { id: string };
};

type VaultDetailsRouteProp = RouteProp<RootStackParamList, "VaultDetails">;

const { width } = Dimensions.get("window");
const H_PADDING = Math.round(width * 0.05);

export default function VaultDetailsScreen() {
  const route = useRoute<VaultDetailsRouteProp>();
  const navigation = useNavigation<any>();
  const { themeStyles } = useTheme();

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

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <ScrollView
      style={themeStyles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.spacer} />

      {/* Header */}
      <View style={[styles.headerRow, themeStyles.card, themeStyles.border]}>
        <View style={[styles.badge, themeStyles.iconBg]}>
          <MaterialIcons name="lock" size={20} color={themeStyles.iconColor.color} />
        </View>

        <View style={styles.headerText}>
          <Text numberOfLines={1} style={[styles.title, themeStyles.text]}>
            {vault.secureTitle}
          </Text>
          <Text numberOfLines={2} style={[styles.subtitle, themeStyles.textGray]}>
            {vault.secureContent}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerAction}
          onPress={() =>
            navigation.navigate("AddCredentials" as any, {
              tab: "vault",
              vaultId: vault.id,
              userId: vault.userId,
              title: vault.secureTitle,
              content: vault.secureContent,
              // url: vault.Url,
              // mediaFile: vault.MediaFile,
              summary: vault.secureSummary,
              tags: vault.secureTags?.join(","),
              isLocked: vault.IsLocked,
              unlockDate: vault.unlockDate,
              expirationDate: vault.expirationDate,
              categoryId: vault.categoryId,
              isFavorite: vault.IsFavorite,
            })
          }
        >
          <MaterialIcons name="edit" size={20} color={themeStyles.iconColor.color} />
        </TouchableOpacity>
      </View>

      {vault.secureSummary ? (
        <View style={[styles.card, themeStyles.card, styles.sectionMargin, themeStyles.border]}>
          <Text style={[styles.label, themeStyles.text]}>Summary</Text>
          <Text style={[styles.value, themeStyles.text]}>{vault.secureSummary}</Text>
        </View>
      ) : null}

      {vault.secureTags && vault.secureTags.length > 0 ? (
        <View style={[styles.card, themeStyles.card, styles.sectionMargin, themeStyles.border]}>
          <Text style={[styles.label, themeStyles.text]}>Tags</Text>
          <View style={styles.tagsWrap}>
            {vault.secureTags.map((t, i) => (
              <View key={i} style={[styles.tag, themeStyles.card, themeStyles.border]}>
                <Text style={[styles.tagText, themeStyles.text]} numberOfLines={1}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={[styles.rowCards, styles.sectionMargin]}>
        {vault.IsLocked ? (
          <View style={[styles.smallCard, themeStyles.card, themeStyles.border]}>
            <Text style={[styles.smallLabel, themeStyles.text]}>Locked Until</Text>
            <Text style={[styles.smallValue, themeStyles.text]}>
              {vault.unlockDate ? new Date(vault.unlockDate).toLocaleDateString() : '—'}
            </Text>
          </View>
        ) : null}

        {vault.expirationDate ? (
          <View style={[styles.smallCard, themeStyles.card, themeStyles.border]}>
            <Text style={[styles.smallLabel, themeStyles.text]}>Expires</Text>
            <Text style={[styles.smallValue, themeStyles.text]}>
              {new Date(vault.expirationDate).toLocaleDateString()}
            </Text>
          </View>
        ) : null}

        {vault.IsFavorite ? (
          <View style={[styles.smallCard, themeStyles.card, themeStyles.border]}>
            <Text style={[styles.smallLabel, themeStyles.text]}>Favorite</Text>
            <Text style={[styles.smallValue, themeStyles.text]}>{vault.IsFavorite ? 'Yes' : 'No'}</Text>
          </View>
        ) : null}
      </View>

      {/* {vault.IsShareable ? (
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.label, themeStyles.text]}>Is it Shareable:</Text>
          <Text style={[styles.value, themeStyles.text]}>{vault.IsShareable}</Text>
        </View>
      ) : null} */}

      {vault.categoryName ? (
        <View style={[styles.card, themeStyles.card, styles.sectionMargin, themeStyles.border]}>
          <Text style={[styles.label, themeStyles.text]}>Category</Text>
          <Text style={[styles.value, themeStyles.text]}>{vault.categoryName}</Text>
        </View>
      ) : null}

      {vault.createdDate ? (
        <View style={[styles.card, themeStyles.card, styles.sectionMargin, themeStyles.border]}>
          <Text style={[styles.label, themeStyles.text]}>Created</Text>
          <Text style={[styles.value, themeStyles.text]}>{formatDate(vault.createdDate)}</Text>
        </View>
      ) : null}

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, themeStyles.button]}
          onPress={() =>
            navigation.navigate("AddCredentials" as any, {
              tab: "vault",
              vaultId: vault.id,
              userId: vault.userId,
              title: vault.secureTitle,
              content: vault.secureContent,
              // url: vault.Url,
              // mediaFile: vault.MediaFile,
              summary: vault.secureSummary,
              tags: vault.secureTags?.join(","),
              isLocked: vault.IsLocked,
              unlockDate: vault.unlockDate,
              expirationDate: vault.expirationDate,
              categoryId: vault.categoryId,
              isFavorite: vault.IsFavorite,
            })
          }
        >
          <MaterialIcons name="edit" size={18} color={themeStyles.buttonText.color} />
          <Text style={[styles.actionText, themeStyles.buttonText]}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 24,
  },
  spacer: {
    height: StatusBar.currentHeight || 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 14,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerAction: {
    marginLeft: 8,
    padding: 6,
  },

  title: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    marginTop: 4,
    opacity: 0.85,
  },

  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  sectionMargin: {
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
    opacity: 0.85,
  },
  value: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
  },

  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
  },

  rowCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  smallCard: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  smallLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    opacity: 0.75,
  },
  smallValue: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    marginTop: 6,
  },

  actionRow: {
    marginTop: 18,
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
  },
});
