import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTheme } from "@context/ThemeContext";
import { darkTheme, lightTheme } from "@assets/colors/theme";
import { useAppDispatch } from "@redux/hooks";
import AuthService from "@services/AuthService";
import IdentityService from "@services/IdentityService";
import { IdentityPayload } from "@appTypes/identity.types";
import { ServiceResult } from "@appTypes/service.types";
import Toast from "react-native-toast-message";

type RouteParams = {
  EditIdentity: {
    mode: "create" | "edit";
    identityId?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
  };
};
type EditIdentityRouteProp = RouteProp<RouteParams, "EditIdentity">;

const EditIdentityScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<EditIdentityRouteProp>();
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;
  const dispatch = useAppDispatch();

  const mode = route.params.mode;
  const identityId = route.params.identityId;

  // Form state
  const [form, setForm] = useState<{
    fullName: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
  }>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  // Per-field error messages
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  // Submitting flag
  const [submitting, setSubmitting] = useState(false);

  // On mount, if edit mode and params provided, prefill the form
  useEffect(() => {
    if (mode === "edit" && identityId) {
      setForm({
        fullName: route.params.fullName || "",
        email: route.params.email || "",
        phone: route.params.phone || "",
        address: route.params.address || "",
        notes: route.params.notes || "",
      });
    }
  }, [mode, identityId, route.params]);

  // Update a single field and clear its error
  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // Validate required fields; returns true if valid
  const validate = (): boolean => {
    const newErrors: Partial<typeof form> = {};
    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else {
      const emailTrim = form.email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrim)) {
        newErrors.email = "Invalid email format.";
      }
    }
    // phone/address/notes are optional
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      return;
    }
    setSubmitting(true);
    try {
      // 1. Retrieve userId from token
      const decoded = await AuthService.decodeToken();
      const userId = decoded?.nameid;
      if (!userId) {
        throw new Error("User not authenticated. Please log in again.");
      }

      // 2. Build payload
      const payload: IdentityPayload = {
        UserId: userId,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        // include optional fields only if non-empty
        ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
        ...(form.address.trim() ? { address: form.address.trim() } : {}),
        ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
      };

      let res: ServiceResult<any>;
      if (mode === "edit" && identityId) {
        // Update existing identity
        res = (await dispatch(
          IdentityService.updateIdentity(identityId, payload) as any
        )) as ServiceResult<any>;
        if (!res.success) {
          throw new Error(res.message || "Failed to update identity.");
        }
        // Alert.alert("Success", "Identity updated.");
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Identity updated.'
        });
      } else {
        // Create new identity
        res = (await dispatch(
          IdentityService.createIdentity(payload) as any
        )) as ServiceResult<any>;
        if (!res.success) {
          throw new Error(res.message || "Failed to create identity.");
        }
        // Alert.alert("Success", "Identity created.");
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Identity created.'
        });
      }

      navigation.goBack();
    } catch (err: any) {
      console.error("EditIdentity error:", err);
      // Alert.alert("Error", err.message || "Operation failed.");
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.message || 'Operation failed.'
      });
    } finally {
      setSubmitting(false);
    }
  }, [dispatch, form, identityId, mode, navigation]);

  return (
    <ScrollView
      contentContainerStyle={[styles.container, themeStyles.container]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, themeStyles.text]}>
        {mode === "edit" ? "Edit Identity" : "New Identity"}
      </Text>

      {/* Full Name */}
      <TextInput
        style={[
          styles.input,
          themeStyles.card,
          errors.fullName ? styles.inputError : undefined,
        ]}
        placeholder="Full Name*"
        placeholderTextColor={isDark ? "#888" : "#666"}
        value={form.fullName}
        onChangeText={(v) => handleChange("fullName", v)}
      />
      {errors.fullName ? (
        <Text style={styles.errorText}>{errors.fullName}</Text>
      ) : null}

      {/* Email */}
      <TextInput
        style={[
          styles.input,
          themeStyles.card,
          errors.email ? styles.inputError : undefined,
        ]}
        placeholder="Email*"
        placeholderTextColor={isDark ? "#888" : "#666"}
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(v) => handleChange("email", v)}
      />
      {errors.email ? (
        <Text style={styles.errorText}>{errors.email}</Text>
      ) : null}

      {/* Phone (optional) */}
      <TextInput
        style={[styles.input, themeStyles.card]}
        placeholder="Phone"
        placeholderTextColor={isDark ? "#888" : "#666"}
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(v) => handleChange("phone", v)}
      />

      {/* Address (optional) */}
      <TextInput
        style={[styles.input, themeStyles.card]}
        placeholder="Address"
        placeholderTextColor={isDark ? "#888" : "#666"}
        value={form.address}
        onChangeText={(v) => handleChange("address", v)}
      />

      {/* Notes (optional) */}
      <TextInput
        style={[styles.input, themeStyles.card]}
        placeholder="Notes"
        placeholderTextColor={isDark ? "#888" : "#666"}
        value={form.notes}
        onChangeText={(v) => handleChange("notes", v)}
      />

      <TouchableOpacity
        style={[styles.submitButton, themeStyles.button, submitting ? styles.disabledButton : null]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color={isDark ? "#fff" : "#000"} />
        ) : (
          <Text style={[themeStyles.buttonText, styles.buttonText]}>
            {mode === "edit" ? "Update" : "Create"}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: StatusBar.currentHeight || 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
  },
  inputError: {
    borderColor: "#D32F2F",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 13,
    marginBottom: 12,
    marginLeft: 4,
    fontFamily: "Poppins_400Regular",
    fontWeight: "700",
  },
  submitButton: {
    marginTop: 20,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});

export default EditIdentityScreen;