import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import PersonalVaultService from "../../services/PersonalVaultService";
import CategoryService from "../../services/CategoryService";
import { ServiceResult } from "../../types/service.types";
import { PersonalVaultPayload } from "../../types/personalVault.types";
import { MaterialIcons } from "@expo/vector-icons";

type EditVaultParams = {
  EditVault: { vaultId: string };
};
type RouteProps = RouteProp<EditVaultParams, "EditVault">;

const { width } = Dimensions.get("window");
const H_PADDING = Math.round(width * 0.05);

export default function EditVaultsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProps>();
  const dispatch = useAppDispatch();
  const { themeStyles, isDark } = useTheme();

  const vaultId = route.params.vaultId;

  // categories from redux (keeps consistent with other screens)
  const { categories, loading: catLoading } = useAppSelector((s) => s.category);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    id: vaultId,
    title: "",
    content: "",
    summary: "",
    tags: "", // comma separated in UI
    isLocked: false,
    unlockDate: "",
    categoryId: "",
    expirationDate: "",
    isFavorite: false,
    lastModifiedDate: "",
    fieldErrors: {} as Record<string, string | undefined>,
  });

  // fetch categories + vault
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // fetch categories via redux thunk (if not loaded)
        dispatch(CategoryService.getCategoriesByUser() as any);
      } catch (e) {
        // ignore
      }

      try {
        const res = await PersonalVaultService.getVaultsById(vaultId);
        if (!mounted) return;
        if (res.success && res.data) {
          const v: any = res.data;
          setForm((prev) => ({
            ...prev,
            id: vaultId,
            title: v.title ?? v.secureTitle ?? "",
            content: v.content ?? v.secureContent ?? "",
            summary: v.summary ?? v.secureSummary ?? "",
            tags: (v.tags ?? v.secureTags ?? []).join(", "),
            isLocked: !!v.isLocked,
            unlockDate: v.unlockDate ?? "",
            categoryId: v.categoryId ?? v.categoryId ?? "",
            expirationDate: v.expirationDate ?? "",
            isFavorite: !!v.isFavorite,
            lastModifiedDate: v.lastModifiedDate ?? v.lastModifiedDate ?? "",
            fieldErrors: {},
          }));
          setError(null);
        } else {
          setError(res.message || "Failed to load vault");
        }
      } catch (e: any) {
        setError("An unexpected error occurred.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [vaultId, dispatch]);

  const handleChange = (key: keyof typeof form, value: any) => {
    setForm((f) => ({
      ...f,
      [key]: value,
      fieldErrors: { ...f.fieldErrors, [key]: undefined },
    }));
    setError(null);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    let hasError = false;
    if (!form.title || !form.title.trim()) {
      errs.title = "Title is required.";
      hasError = true;
    }
    if (!form.content || !form.content.trim()) {
      errs.content = "Content is required.";
      hasError = true;
    }
    if (!form.categoryId) {
      errs.categoryId = "Select a category.";
      hasError = true;
    }
    setForm((f) => ({ ...f, fieldErrors: errs }));
    return !hasError;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      // Build the DTO exactly as backend expects (fields present)
      const dto: any = {
        id: form.id,
        title: form.title ?? null,
        content: form.content ?? null,
        summary: form.summary ?? null,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        isLocked: !!form.isLocked,
        unlockDate: form.unlockDate ? new Date(form.unlockDate).toISOString() : null,
        categoryId: form.categoryId || null,
        expirationDate: form.expirationDate
          ? new Date(form.expirationDate).toISOString()
          : null,
        isFavorite: !!form.isFavorite,
        lastModifiedDate: new Date().toISOString(),
      };

      // Call service via dispatch to keep redux in sync
      const res = (await dispatch(
        // @ts-ignore
        PersonalVaultService.updateVault(vaultId, dto)
      )) as ServiceResult<any>;

      if (res.success) {
        Alert.alert("Success", "Vault updated.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", res.message || "Failed to update.");
      }
    } catch (e: any) {
      console.error("Update error:", e);
      Alert.alert("Error", e?.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || catLoading) {
    return (
      <View style={[styles.loaderContainer, themeStyles.container]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.loaderContainer, themeStyles.container]}>
        <Text style={themeStyles.text}>{error}</Text>
      </View>
    );
  }

  const renderInput = (
    label: string,
    field: keyof typeof form,
    multiline = false,
    placeholder?: string
  ) => (
    <View style={[styles.card, themeStyles.card, themeStyles.border]}>
      <Text style={[styles.label, themeStyles.text]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline ? { height: 100, textAlignVertical: "top" } : undefined,
          themeStyles.text,
        ]}
        value={(form[field] as string) || ""}
        onChangeText={(t) => handleChange(field, t)}
        placeholder={placeholder ?? label}
        placeholderTextColor={isDark ? "#888" : "#666"}
        multiline={multiline}
      />
      {form.fieldErrors[field as string] ? (
        <Text style={styles.errorText}>{form.fieldErrors[field as string]}</Text>
      ) : null}
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, themeStyles.container]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.spacer} />
      <View style={[styles.headerRow, themeStyles.card, themeStyles.border]}>
        <View style={styles.headerText}>
          <Text style={[styles.title, themeStyles.text]}>Edit Vault</Text>
        </View>
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="close" size={20} color={themeStyles.iconColor.color} />
        </TouchableOpacity>
      </View>

      {renderInput("Title*", "title")}
      {renderInput("Content*", "content", true)}
      {renderInput("Summary", "summary")}
      {renderInput("Tags (comma separated)", "tags", false, "tag1, tag2")}

      <View style={[styles.switchRow, themeStyles.card, themeStyles.border]}>
        <Text style={themeStyles.text}>Locked</Text>
        <Switch
          value={form.isLocked}
          onValueChange={(v) => handleChange("isLocked", v)}
        />
      </View>

      {form.isLocked && (
        <View style={[styles.card, themeStyles.card, themeStyles.border]}>
          <Text style={[styles.label, themeStyles.text]}>Unlock Date (YYYY-MM-DD)</Text>
          <TextInput
            style={[styles.input, themeStyles.text]}
            value={form.unlockDate}
            onChangeText={(t) => handleChange("unlockDate", t)}
            placeholder="2025-08-25"
            placeholderTextColor={isDark ? "#888" : "#666"}
          />
        </View>
      )}

      <View style={[styles.card, themeStyles.card, themeStyles.border]}>
        <Text style={[styles.label, themeStyles.text]}>Expiration Date (YYYY-MM-DD)</Text>
        <TextInput
          style={[styles.input, themeStyles.text]}
          value={form.expirationDate}
          onChangeText={(t) => handleChange("expirationDate", t)}
          placeholder="2025-12-31"
          placeholderTextColor={isDark ? "#888" : "#666"}
        />
      </View>

      <View style={[styles.card, themeStyles.card, themeStyles.border]}>
        <Text style={[styles.label, themeStyles.text]}>Category*</Text>
        <View style={[styles.pickerContainer, themeStyles.card]}>
          <Picker
            selectedValue={form.categoryId}
            onValueChange={(v) => handleChange("categoryId", v)}
          >
            <Picker.Item label="Select category..." value="" />
            {categories.map((c: any) => (
              <Picker.Item key={c.id} label={c.name} value={c.id} />
            ))}
          </Picker>
        </View>
        {form.fieldErrors.categoryId ? (
          <Text style={styles.errorText}>{form.fieldErrors.categoryId}</Text>
        ) : null}
      </View>

      <View style={[styles.switchRow, { marginTop: 6 }]}>
        <Text style={themeStyles.text}>Favorite</Text>
        <Switch
          value={form.isFavorite}
          onValueChange={(v) => handleChange("isFavorite", v)}
        />
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          disabled={saving}
          style={[styles.saveButton, themeStyles.button, saving && { opacity: 0.7 }]}
          onPress={handleSave}
        >
          {saving ? (
            <ActivityIndicator color={themeStyles.buttonText.color} />
          ) : (
            <Text style={[styles.saveButtonText, themeStyles.buttonText]}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

import { Picker } from "@react-native-picker/picker"; // keep at file top if not already imported

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 24,
  },
  spacer: {
    height: StatusBar.currentHeight || 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
  },
  headerText: {
    flex: 1,
  },
  headerAction: {
    padding: 6,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
  actionRow: {
    marginTop: 18,
    alignItems: "center",
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  errorText: {
    color: "#D32F2F",
    marginTop: 6,
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
  },
});
