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
  Platform,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useTheme } from "@context/ThemeContext";
import PasswordService from "@services/PasswordService";
import { MaterialIcons } from "@expo/vector-icons";
import { ServiceResult } from "@appTypes/service.types";
import { useAppDispatch } from "@redux/hooks";
import CustomAlert from "@components/CustomAlert";
import DateTimePicker from "@react-native-community/datetimepicker";
import { darkTheme, lightTheme } from "@assets/colors/theme";
import Toast from "react-native-toast-message";

type RootStackParamList = {
  EditPassword: { passwordId: string };
};

type EditPasswordRouteProp = RouteProp<RootStackParamList, "EditPassword">;

const { width } = Dimensions.get("window");
const H_PADDING = Math.round(width * 0.05);

const EditPasswordsScreen: React.FC = () => {
  const route = useRoute<EditPasswordRouteProp>();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const { passwordId } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [form, setForm] = useState({
    id: passwordId,
    siteName: "",
    usernameOrEmail: "",
    notes: "",
    password: "",
    newPassword: "",
    newPasswordRepeat: "",
    categoryId: "",
  });

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateTemp, setDateTemp] = useState(new Date());

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await PasswordService.getPasswordById(passwordId);
      if (res.success && res.data) {
        setForm((prev) => ({
          ...prev,
          siteName: (res.data as any).siteName ?? "",
          usernameOrEmail: (res.data as any).usernameOrEmail ?? "",
          notes: (res.data as any).notes ?? "",
          password: (res.data as any).password ?? "",
          categoryId: (res.data as any).categoryId ?? "",
        }));
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.message || 'Failed to load password.'
        });
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordId]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (form.newPassword !== form.newPasswordRepeat) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'New passwords do not match.'
      });
      return;
    }

    setSaving(true);

    try {
      const dto: any = {
        siteName: form.siteName,
        usernameOrEmail: form.usernameOrEmail,
        notes: form.notes,
        categoryId: form.categoryId || undefined,
        newPassword: form.newPassword,
        newPasswordRepeat: form.newPasswordRepeat,
        password: form.password,
      };

      const res = (await dispatch(
        // @ts-ignore - thunk action
        PasswordService.updatePassword(passwordId, dto)
      )) as ServiceResult<any>;

      if (res.success) {
        setShowSuccessAlert(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.message || 'Failed to update Password.'
        });
      }
    } catch (err: any) {
      setSaving(false);
      console.error("Update error:", err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.message || 'Failed to update Password'
      });
    } finally {
      setSaving(false);
    }
  };

  const renderInput = (
    label: string,
    field: keyof typeof form,
    secure?: boolean,
    multiline?: boolean
  ) => (
    <View style={[styles.card, theme.styles.card, theme.styles.border]}>
      <Text style={[styles.label, theme.styles.text]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          theme.styles.text,
          multiline ? { height: 100, textAlignVertical: "top" } : undefined,
        ]}
        value={(form[field] as string) || ""}
        onChangeText={(t) => handleChange(field as string, t)}
        secureTextEntry={secure}
        placeholder={`Enter ${label}`}
        placeholderTextColor={theme.styles.textGray.color}
        multiline={multiline}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={[theme.styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={theme.styles.container}
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
            style={[
              styles.actionBtn,
              theme.styles.button,
              saving && { opacity: 0.7 },
            ]}
            onPress={handleSave}
          >
            {saving ? (
              <ActivityIndicator color={theme.styles.buttonText.color} />
            ) : (
              <>
                <MaterialIcons
                  name="save"
                  size={18}
                  color={theme.styles.buttonText.color}
                />
                <Text style={[styles.actionText, theme.styles.buttonText]}>
                  Save Changes
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <CustomAlert
        visible={showSuccessAlert}
        title="Success"
        message="Password updated successfully"
        onClose={() => {
          setShowSuccessAlert(false);
          navigation.goBack();
        }}
      />
    </>
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

export default EditPasswordsScreen;
