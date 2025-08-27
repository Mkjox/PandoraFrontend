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
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import PasswordService from "../../services/PasswordService";
import { MaterialIcons } from "@expo/vector-icons";
import { ServiceResult } from "../../types/service.types";
import { useAppDispatch } from "../../redux/hooks";

type RootStackParamList = {
  EditPassword: { passwordId: string };
};

type EditPasswordRouteProp = RouteProp<RootStackParamList, "EditPassword">;

const { width } = Dimensions.get("window");
const H_PADDING = Math.round(width * 0.05);

const EditPasswordScreen: React.FC = () => {
  const route = useRoute<EditPasswordRouteProp>();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { themeStyles } = useTheme();

  const { passwordId } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id: passwordId,
    siteName: "",
    usernameOrEmail: "",
    notes: "",
    password: "",
    newPassword: "",
    newPasswordRepeat: "",
    categoryId: "",
    passwordExpirationDate: "",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await PasswordService.getPasswordById(passwordId);
      if (res.success && res.data) {
        // res.data is PasswordItem (capitalized keys) from mapRaw
        setForm((prev) => ({
          ...prev,
          siteName: (res.data as any).siteName ?? "",
          usernameOrEmail: (res.data as any).usernameOrEmail ?? "",
          notes: (res.data as any).notes ?? "",
          password: (res.data as any).password ?? "",
          categoryId: (res.data as any).categoryId ?? "",
          passwordExpirationDate: (res.data as any).passwordExpirationDate ?? "",
        }));
      } else {
        Alert.alert("Error", res.message || "Failed to load password");
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordId]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // basic validation
    if (form.newPassword !== form.newPasswordRepeat) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    const payload: Record<string, any> = {
      siteName: form.siteName,
      usernameOrEmail: form.usernameOrEmail,
      notes: form.notes,
      categoryId: form.categoryId || undefined,
      // expiration if present
      ...(form.passwordExpirationDate ? { passwordExpirationDate: form.passwordExpirationDate } : {}),
    };

    if (form.newPassword) {
      payload.newPassword = form.newPassword;
      payload.newPasswordRepeat = form.newPasswordRepeat;
      payload.password = form.password; // current password
    } else {
      // if no new password, optionally include current password as 'password' if backend requires it
      payload.password = form.password;
    }

    try {
      setSaving(true);
      // dispatch expects (id, payload)
      const res = (await dispatch(
        // @ts-ignore - thunk action
        PasswordService.updatePassword(passwordId, payload)
      )) as ServiceResult<any>;
      setSaving(false);

      if (res.success) {
        Alert.alert("Success", "Password updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", res.message || "Failed to update password");
      }
    } catch (err: any) {
      setSaving(false);
      console.error("Save error:", err);
      Alert.alert("Error", err?.message || "Failed to update password");
    }
  };

  if (loading) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderInput = (
    label: string,
    field: keyof typeof form,
    secure?: boolean,
    multiline?: boolean
  ) => (
    <View style={[styles.card, themeStyles.card, themeStyles.border]}>
      <Text style={[styles.label, themeStyles.text]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          themeStyles.text,
          multiline ? { height: 100, textAlignVertical: "top" } : undefined,
        ]}
        value={(form[field] as string) || ""}
        onChangeText={(t) => handleChange(field as string, t)}
        secureTextEntry={secure}
        placeholder={`Enter ${label}`}
        placeholderTextColor={themeStyles.textGray.color}
        multiline={multiline}
      />
    </View>
  );

  return (
    <ScrollView
      style={themeStyles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.spacer} />

      {renderInput("Site Name", "siteName")}
      {renderInput("Username / Email", "usernameOrEmail")}
      {renderInput("Current Password (for verification)", "password", true)}
      {renderInput("New Password", "newPassword", true)}
      {renderInput("Repeat New Password", "newPasswordRepeat", true)}
      {renderInput("Notes", "notes", false, true)}
      {renderInput("Category Id", "categoryId")}

      <View style={styles.actionRow}>
        <TouchableOpacity
          disabled={saving}
          style={[styles.actionBtn, themeStyles.button, saving && { opacity: 0.7 }]}
          onPress={handleSave}
        >
          {saving ? (
            <ActivityIndicator color={themeStyles.buttonText.color} />
          ) : (
            <>
              <MaterialIcons name="save" size={18} color={themeStyles.buttonText.color} />
              <Text style={[styles.actionText, themeStyles.buttonText]}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

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
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 6,
  },
  input: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    paddingVertical: 6,
  },
  actionRow: {
    marginTop: 18,
    alignItems: "center",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
    elevation: 2,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
  },
});

export default EditPasswordScreen;
