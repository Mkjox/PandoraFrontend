import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useTheme } from "../../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../../assets/colors/theme";
import PasswordService from "../../../services/PasswordService";
import { PasswordItem } from "../../../types/password.types";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

type RootStackParamList = {
  PassDetails: { id: string };
};
type PassDetailsRouteProp = RouteProp<RootStackParamList, 'PassDetails'>;

const { width } = Dimensions.get('window');

const PassDetailsScreen: React.FC = () => {
  const route = useRoute<PassDetailsRouteProp>();
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  const [item, setItem] = useState<PasswordItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { id } = route.params;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await PasswordService.getPasswordById(id);
      if (res.success && res.data) {
        setItem(res.data);
        setError(null);
      } else {
        setError(res.message || 'Password not found');
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <Text style={themeStyles.text}>{error || 'No details available'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={themeStyles.container}>
      <View style={styles.spacer} />

      <View style={[styles.header, themeStyles.card]}>
        <Text style={[styles.title, themeStyles.text]}>{item.SiteName}</Text>
        <Text style={[styles.subtitle, themeStyles.textGray]}>{item.UsernameOrEmail}</Text>
      </View>

      <View style={[styles.section, themeStyles.card]}>
        <View style={styles.row}>
          <Text style={[styles.label, themeStyles.text]}>Password:</Text>
          <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
            <Entypo
              name={showPassword ? 'eye' : 'eye-with-line'}
              size={20}
              color={themeStyles.iconColor.color}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.value, themeStyles.text]}>
          {showPassword ? item.Password : '••••••••'}
        </Text>
      </View>

      {item.Notes ? (
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.label, themeStyles.text]}>Notes:</Text>
          <Text style={[styles.value, themeStyles.text]}>{item.Notes}</Text>
        </View>
      ) : null}

      {item.PasswordExpirationDate ? (
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.label, themeStyles.text]}>Expires:</Text>
          <Text style={[styles.value, themeStyles.text]}>
            {new Date(item.PasswordExpirationDate).toLocaleDateString()}
          </Text>
        </View>
      ) : null}

      {item.CategoryId ? (
        <View style={[styles.section, themeStyles.card]}>
          <Text style={[styles.label, themeStyles.text]}>Category ID:</Text>
          <Text style={[styles.value, themeStyles.text]}>{item.CategoryId}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.editButton, themeStyles.button]}
        onPress={() => navigation.navigate('EditPassword', { passwordId: item.id })}
        // onPress={() => navigation.navigate('EditPassword' as any, { 
        //   passwordId: item.id,
        //   userId: item.UserId,
        //   siteName: item.SiteName,
        //   usernameOrEmail: item.UsernameOrEmail,
        //   password: item.Password,
        //   notes: item.Notes ?? '',
        //   passwordExpirationDate: item.PasswordExpirationDate ?? undefined,
        //   categoryId: item.CategoryId,
        //  })}
      >
        <MaterialIcons name="edit" size={20} color={themeStyles.buttonText.color} />
        <Text style={[styles.editText, themeStyles.buttonText]}>Edit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  spacer: {
    height: StatusBar.currentHeight || 20

  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
    fontFamily: 'Poppins_700Bold'
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 4
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
    fontFamily: 'Poppins_600SemiBold'
  },
  value: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginTop: 4
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: width * 0.05,
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  editText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    marginLeft: 8
  },
});

export default PassDetailsScreen;