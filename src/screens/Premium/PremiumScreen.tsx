import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { darkTheme, lightTheme } from '../../assets/colors/theme';
import {
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
  Ionicons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const PremiumScreen: React.FC = () => {
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;
  const navigation = useNavigation();
  const priceText = '$29.99 / year';

  const features = [
    {
      key: 'sync',
      icon: <MaterialCommunityIcons name="cloud-sync-outline" size={28} color={themeStyles.text.color} />,
      title: 'Auto Sync',
      desc: 'Your vault stays up to date across all devices',
    },
    {
      key: 'share',
      icon: <MaterialCommunityIcons name="account-group-outline" size={28} color={themeStyles.text.color} />,
      title: 'Group Sharing',
      desc: 'Easily share and revoke access with teams or family',
    },
    {
      key: 'backup',
      icon: <FontAwesome5 name="file-medical-alt" size={28} color={themeStyles.text.color} />,
      title: 'Encrypted Backup',
      desc: 'Keep a secure off‑site copy of all your data',
    },
    {
      key: 'support',
      icon: <MaterialIcons name="support-agent" size={28} color={themeStyles.text.color} />,
      title: 'Premium Support',
      desc: 'Priority email & chat support whenever you need it',
    },
  ];

  return (
    <View style={[styles.screen, themeStyles.container]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="diamond" size={48} color={themeStyles.button.backgroundColor} />
          <Text style={[styles.headline, themeStyles.text]}>Go Premium</Text>
          <Text style={[styles.subhead, themeStyles.textGray]}>
            Unlock advanced features and unbeatable peace of mind.
          </Text>
        </View>

        {features.map((f) => (
          <View key={f.key} style={[styles.card, themeStyles.card, themeStyles.border]}>
            <View style={styles.cardIcon}>{f.icon}</View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, themeStyles.text]}>{f.title}</Text>
              <Text style={[styles.cardDesc, themeStyles.textGray]}>{f.desc}</Text>
            </View>
          </View>
        ))}

        <View style={styles.noteContainer}>
          <MaterialCommunityIcons
            name="information-outline"
            size={20}
            color={themeStyles.textGray.color}
          />
          <Text style={[styles.noteText, themeStyles.textGray]}>
            By subscribing you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, themeStyles.card]}>
        <TouchableOpacity
          style={[styles.actionButton, themeStyles.border]}
          onPress={() => navigation.navigate('PurchaseFlow' as never)}
        >
          <Text style={[styles.actionText, themeStyles.customButtonText]}>Upgrade Now</Text>
        </TouchableOpacity>
        <Text style={[styles.priceText, themeStyles.textGray]}>{priceText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: {
    padding: 24,
    paddingBottom: 120, // space for footer
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headline: {
    fontSize: 26,
    fontFamily: 'Poppins_700Bold',
    marginTop: 12,
  },
  subhead: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  cardIcon: {
    marginRight: 16,
    width: 40,
    alignItems: 'center',
    alignSelf:'center'
  },
  cardText: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  cardDesc: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 4,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 4,
    marginBottom: 8
  },
  noteText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginLeft: 6,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#aaa',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  actionButton: {
    width: width * 0.9,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    
  },
  actionText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  priceText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
});

export default PremiumScreen;
