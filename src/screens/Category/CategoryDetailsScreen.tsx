import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useTheme } from "@context/ThemeContext";
import { lightTheme, darkTheme } from "@assets/colors/theme";
import { useAppSelector, useAppDispatch } from "@redux/hooks";
import { Category } from "@appTypes/category.types";
import { AntDesign, Entypo } from "@expo/vector-icons";
import CategoryService from "@services/CategoryService";

type RootStackParamList = {
  CategoryDetails: { id: string };
};

type CategoryDetailsRouteProp = RouteProp<RootStackParamList, "CategoryDetails">;

const { width } = Dimensions.get("window");

export default function CategoryDetailsScreen() {
  const route = useRoute<CategoryDetailsRouteProp>();
  const navigation = useNavigation<any>();
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;
  const dispatch = useAppDispatch();

  const { id } = route.params;

  // get the category from Redux state
  const category = useAppSelector((s) =>
    s.category.categories.find((c: Category) => c.id === id)
  );

  const onDelete = () => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(CategoryService.deleteCategory(id));
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!category) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <Text style={themeStyles.text}>Category not found</Text>
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

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, themeStyles.button]}
          onPress={() =>
            navigation.navigate("EditCategory", {
              categoryId: category.id
            })
          }
        >
          <AntDesign
            name="edit"
            size={20}
            color={themeStyles.buttonText.color}
          />
          <Text style={[styles.actionText, themeStyles.buttonText]}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, themeStyles.button]}
          onPress={onDelete}
        >
          <Entypo
            name="trash"
            size={20}
            color={themeStyles.buttonText.color}
          />
          <Text style={[styles.actionText, themeStyles.buttonText]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
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
    marginVertical: 8,
    // marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  subtitle: {
    fontSize: 16,
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
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: width * 0.05,
    marginTop: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    marginLeft: 8,
  },
});
