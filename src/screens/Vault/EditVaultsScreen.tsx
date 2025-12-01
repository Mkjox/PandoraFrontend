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
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTheme } from "@context/ThemeContext";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import PersonalVaultService from "@services/PersonalVaultService";
import CategoryService from "@services/CategoryService";
import { ServiceResult } from "@appTypes/service.types";
import CustomAlert from "@components/CustomAlert";
import DateTimePicker from "@react-native-community/datetimepicker";
import { darkTheme, lightTheme } from "@assets/colors/theme";
import Toast from "react-native-toast-message";
import CustomPicker from "@components/CustomPicker";

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
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const vaultId = route.params.vaultId;
  const { categories, loading: catLoading } = useAppSelector((s) => s.category);

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    id: vaultId,
    title: "",
    content: "",
    summary: "",
    tags: "",
    isLocked: false,
    unlockDate: "",
    categoryId: "",
    expirationDate: "",
    isFavorite: false,
    lastModifiedDate: "",
    fieldErrors: {} as Record<string, string | undefined>,
  });

  // date pickers
  const [showUnlockPicker, setShowUnlockPicker] = useState(false);
  const [showExpirationPicker, setShowExpirationPicker] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        dispatch(CategoryService.getCategoriesByUser() as any);
      } catch { }

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
            categoryId: v.categoryId ?? "",
            expirationDate: v.expirationDate ?? "",
            isFavorite: !!v.isFavorite,
            lastModifiedDate: v.lastModifiedDate ?? "",
            fieldErrors: {},
          }));
          setError(null);
        } else {
          setError(res.message || "Failed to load vault");
        }
      } catch {
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
    if (!form.title.trim()) {
      errs.title = "Title is required.";
      hasError = true;
    }
    if (!form.content.trim()) {
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
      const dto: any = {
        id: form.id,
        title: form.title,
        content: form.content,
        summary: form.summary,
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

      const res = (await dispatch(
        // @ts-ignore
        PersonalVaultService.updateVault(vaultId, dto)
      )) as ServiceResult<any>;

      if (res.success) {
        setShowSuccessAlert(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.message || 'Failed to update Vault.'
        });
      }
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e?.message || 'Failed to update Vault.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || catLoading) {
    return (
      <View style={[styles.loaderContainer, theme.styles.container]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.loaderContainer, theme.styles.container]}>
        <Text style={theme.styles.text}>{error}</Text>
      </View>
    );
  }

  const renderInput = (
    label: string,
    field: keyof typeof form,
    multiline = false,
    placeholder?: string
  ) => (
    <View style={[styles.card, theme.styles.card, theme.styles.border]}>
      <Text style={[styles.label, theme.styles.text]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline ? { height: 100, textAlignVertical: "top" } : undefined,
          theme.styles.text,
        ]}
        value={(form[field] as string) || ""}
        onChangeText={(t) => handleChange(field, t)}
        placeholder={placeholder ?? label}
        placeholderTextColor={isDark ? "#888" : "#666"}
        multiline={multiline}
      />
      {form.fieldErrors[field] ? (
        <Text style={styles.errorText}>{form.fieldErrors[field]}</Text>
      ) : null}
    </View>
  );

  return (
    <>
      <ScrollView
        style={[styles.container, theme.styles.container]}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.spacer} />

        {renderInput("Title*", "title")}
        {renderInput("Content*", "content", true)}
        {renderInput("Summary", "summary")}
        {renderInput("Tags (comma separated)", "tags", false, "tag1, tag2")}

        <View style={[styles.switchRow, theme.styles.card, theme.styles.border]}>
          <Text style={theme.styles.text}>Locked?</Text>
          <Switch
            value={form.isLocked}
            onValueChange={(v) => handleChange("isLocked", v)}
          />
        </View>

        {form.isLocked && (
          <TouchableOpacity
            style={[styles.card, theme.styles.card, theme.styles.border]}
            onPress={() => setShowUnlockPicker(true)}
          >
            <Text style={[styles.label, theme.styles.text]}>Unlock Date</Text>
            <Text style={theme.styles.text}>
              {form.unlockDate ? new Date(form.unlockDate).toDateString() : "Select date"}
            </Text>
          </TouchableOpacity>
        )}

        {form.expirationDate ?
          <TouchableOpacity
            style={[styles.card, theme.styles.card, theme.styles.border]}
            onPress={() => setShowExpirationPicker(true)}
          >
            <Text style={[styles.label, theme.styles.text]}>Expiration Date</Text>
            <Text style={theme.styles.text}>
              {form.expirationDate
                ? new Date(form.expirationDate).toDateString()
                : "Select date"}
            </Text>
          </TouchableOpacity>
          : null}

        <View style={[styles.card, theme.styles.card, theme.styles.border]}>
          <Text style={[styles.label, theme.styles.text]}>Category*</Text>
          <View style={[styles.pickerContainer, theme.styles.card]}>
            <CustomPicker
              value={form.categoryId}
              onChange={(v) => handleChange('categoryId', v)}
              items={categories.map(c => ({
                label: c.name,
                value: c.id
              }))}
            />
          </View>
          {form.fieldErrors.categoryId ? (
            <Text style={styles.errorText}>{form.fieldErrors.categoryId}</Text>
          ) : null}
        </View>

        <View style={[styles.switchRow, { marginTop: 6 }]}>
          <Text style={theme.styles.text}>Favorite</Text>
          <Switch
            value={form.isFavorite}
            onValueChange={(v) => handleChange("isFavorite", v)}
          />
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            disabled={saving}
            style={[styles.saveButton, theme.styles.button, saving && { opacity: 0.7 }]}
            onPress={handleSave}
          >
            {saving ? (
              <ActivityIndicator color={theme.styles.buttonText.color} />
            ) : (
              <Text style={[styles.saveButtonText, theme.styles.buttonText]}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {showUnlockPicker && (
        <DateTimePicker
          value={form.unlockDate ? new Date(form.unlockDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            setShowUnlockPicker(false);
            if (date) handleChange("unlockDate", date.toISOString());
          }}
        />
      )}

      {showExpirationPicker && (
        <DateTimePicker
          value={form.expirationDate ? new Date(form.expirationDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            setShowExpirationPicker(false);
            if (date) handleChange("expirationDate", date.toISOString());
          }}
        />
      )}

      <CustomAlert
        visible={showSuccessAlert}
        title="Success"
        message="Vault updated successfully"
        onClose={() => {
          setShowSuccessAlert(false);
          navigation.goBack();
        }}
      />
    </>
  );
}

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
