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
import CategoryService from "../../services/CategoryService";
import { Category } from "../../types/category.types";
import { MaterialIcons } from "@expo/vector-icons";
import { ServiceResult } from "../../types/service.types";

type RootStackParamList = {
  CategoryDetails: { id: string };
};

type CategoryDetailsRouteProp = RouteProp<RootStackParamList, "CategoryDetails">;

const { width } = Dimensions.get("window");

export default function CategoryDetailsScreen() {
  const route = useRoute<CategoryDetailsRouteProp>();
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = route.params;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res: ServiceResult<Category> = await CategoryService.getCategoryById(id);
        if (res.success && res.data) {
          setCategory(res.data);
          setError(null);
        } else {
          setError(res.message || "Category not found");
        }
      } catch (e: any) {
        setError("Failed to load category");
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

  if (error || !category) {
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
        <Text style={[styles.title, themeStyles.text]}>{category.name}</Text>
        {category.description ? (
          <Text style={[styles.subtitle, themeStyles.textGray]}>
            {category.description}
          </Text>
        ) : null}
      </View>

      <View style={[styles.section, themeStyles.card]}>
        <Text style={[styles.label, themeStyles.text]}>ID:</Text>
        <Text style={[styles.value, themeStyles.text]}>{category.id}</Text>
      </View>

      <TouchableOpacity
        style={[styles.editButton, themeStyles.button]}
        onPress={() =>
          navigation.navigate("AddCredentials" as any, {
            tab: "category",
            categoryId: category.id,
            name: category.name,
            description: category.description ?? "",
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
