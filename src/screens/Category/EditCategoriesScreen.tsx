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
import { useTheme } from "@context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppDispatch } from "@redux/hooks";
import { ServiceResult } from "@appTypes/service.types";
import { Category, UpdateCategoryPayload } from "@appTypes/category.types";
import CategoryService from "@services/CategoryService";
import CustomAlert from "@components/CustomAlert";
import { darkTheme, lightTheme } from "@assets/colors/theme";
import Toast from "react-native-toast-message";
import CustomSpinner from "@components/CustomSpinner";

type RootStackParamList = {
  EditCategory: { categoryId: string };
};

type EditCategoryRouteProp = RouteProp<RootStackParamList, "EditCategory">;

const { width } = Dimensions.get("window");
const H_PADDING = Math.round(width * 0.05);

const EditCategoriesScreen: React.FC = () => {
  const route = useRoute<EditCategoryRouteProp>();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const { categoryId } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [form, setForm] = useState<UpdateCategoryPayload>({
    id: categoryId,
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await CategoryService.getCategoriesByUser()(dispatch);
        if (response.success && response.data) {
          const cat = response.data.find((c) => c.id === categoryId);
          if (cat) {
            setForm({
              id: cat.id,
              name: cat.name,
              description: cat.description || "",
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Category not found.'
            });
            navigation.goBack();
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: response.message || 'Failed to load category.'
          });
          navigation.goBack();
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err?.message || 'Failed to load category.'
        });
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleChange = (field: keyof UpdateCategoryPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Category name cannot be empty.'
      });
      return;
    }

    setSaving(true);

    try {
      const res = (await dispatch(
        // @ts-ignore - thunk
        CategoryService.updateCategory(form)
      )) as ServiceResult<Category>;

      if (res.success) {
        setShowSuccessAlert(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.message || 'Failed to update category'
        });
      }
    } catch (err: any) {
      console.error("Update error:", err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err?.message || 'Failed to update category.'
      });
    } finally {
      setSaving(false);
    }
  };

  const renderInput = (
    label: string,
    field: keyof UpdateCategoryPayload,
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
        value={form[field] || ""}
        onChangeText={(t) => handleChange(field, t)}
        placeholder={`Enter ${label}`}
        placeholderTextColor={theme.styles.textGray.color}
        multiline={multiline}
      />
    </View>
  );

  if (loading) {
    return (
      <CustomSpinner />
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

        {renderInput("Category Name", "name")}
        {renderInput("Description", "description", true)}

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
        message="Category updated successfully"
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

export default EditCategoriesScreen;
