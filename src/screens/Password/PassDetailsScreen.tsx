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
  Pressable,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import PasswordService from "../../services/PasswordService";
import { PasswordItem } from "../../types/password.types";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

type RootStackParamList = {
  PassDetails: { id: string };
};
type PassDetailsRouteProp = RouteProp<RootStackParamList, 'PassDetails'>;

const { width } = Dimensions.get('window');
const H_PADDING = Math.round(width * 0.05);

const PassDetailsScreen: React.FC = () => {
  const route = useRoute<PassDetailsRouteProp>();
  const navigation = useNavigation<any>();
  const { themeStyles } = useTheme();

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

  const formatDate = (d?: string | null) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };

  return (
    <ScrollView style={themeStyles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.spacer} />

      <View style={[styles.headerRow, themeStyles.card, themeStyles.border]}>
        <View style={[styles.avatar, themeStyles.iconBg]}>
          <Text style={[styles.avatarText, themeStyles.text]}>
            {item.SiteName ? item.SiteName.charAt(0).toUpperCase() : 'P'}
          </Text>
        </View>

        <View style={styles.headerText}>
          <Text numberOfLines={1} style={[styles.title, themeStyles.text]}>{item.SiteName}</Text>
          <Text numberOfLines={1} style={[styles.subtitle, themeStyles.textGray]}>
            {item.UsernameOrEmail}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => navigation.navigate('EditPassword', { passwordId: item.id })}
        >
          <MaterialIcons name="edit" size={20} color={themeStyles.iconColor.color} />
        </TouchableOpacity>
      </View>

      {/* Password Card */}
      <View style={[styles.card, themeStyles.card, themeStyles.border]}>
        <View style={styles.row}>
          <Text style={[styles.label, themeStyles.text]}>Password</Text>
          <Pressable
            onPress={() => setShowPassword(v => !v)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Toggle password visibility"
          >
            <Entypo name={showPassword ? 'eye' : 'eye-with-line'} size={20} color={themeStyles.iconColor.color} />
          </Pressable>
        </View>

        <View style={styles.valueWrap}>
          <Text selectable style={[styles.value, themeStyles.text]}>
            {showPassword ? item.Password : '••••••••'}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, themeStyles.text]}>Expires</Text>
            <Text style={[styles.metaValue, themeStyles.text]}>{formatDate(item.PasswordExpirationDate)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, themeStyles.text]}>Category</Text>
            <Text style={[styles.metaValue, themeStyles.text]}>{item.CategoryId ?? '—'}</Text>
          </View>
        </View>
      </View>

      {item.Notes ? (
        <View style={[styles.card, themeStyles.card, themeStyles.border]}>
          <Text style={[styles.label, themeStyles.text]}>Notes</Text>
          <Text style={[styles.value, themeStyles.text]}>{item.Notes}</Text>
        </View>
      ) : null}

      {/* Commented navigation data left intact as requested */}
      {/* onPress={() => navigation.navigate('EditPassword' as any, { 
          passwordId: item.id,
          userId: item.UserId,
          siteName: item.SiteName,
          usernameOrEmail: item.UsernameOrEmail,
          password: item.Password,
          notes: item.Notes ?? '',
          passwordExpirationDate: item.PasswordExpirationDate ?? undefined,
          categoryId: item.CategoryId,
         })} */}

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, themeStyles.button]}
          onPress={() => navigation.navigate('EditPassword', { passwordId: item.id })}
        >
          <MaterialIcons name="edit" size={18} color={themeStyles.buttonText.color} />
          <Text style={[styles.actionText, themeStyles.buttonText]}>Edit</Text>
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
    justifyContent: 'center',
    alignItems: 'center'
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  headerAction: {
    marginLeft: 8,
    padding: 6,
  },

  title: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    marginTop: 4,
    opacity: 0.85,
  },

  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 8,
  },

  valueWrap: {
    marginTop: 8,
    marginBottom: 10,
  },

  value: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  metaItem: {
    flex: 1,
  },

  metaLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    opacity: 0.7,
  },

  metaValue: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    marginTop: 4,
  },

  actionRow: {
    marginTop: 18,
    alignItems: 'center',
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
    elevation: 2,
  },

  actionText: {
    marginLeft: 8,
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
  },
});

export default PassDetailsScreen;
