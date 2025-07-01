import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { darkTheme, lightTheme } from '../../assets/colors/theme';
import {
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
  FontAwesome,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const PremiumScreen: React.FC = () => {
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;
  const navigation = useNavigation();

  // Example static price; in real implementation, fetch from backend or store
  const priceText = '$29.99/year';

  // Benefit items: icon, title, description
  const benefits: Array<{
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
  }> = [
      {
        id: 'devices',
        icon: (
          <MaterialCommunityIcons
            name="devices"
            size={24}
            color={themeStyles.icon.color}
          />
        ),
        title: 'Unlimited devices',
        description: 'Use on all computers and mobile devices',
      },
      {
        id: 'sharing',
        icon: (
          <MaterialCommunityIcons
            name="share-variant"
            size={24}
            color={themeStyles.icon.color}
          />
        ),
        title: 'Safe, easy sharing',
        description: 'Share passwords, notes, and more with trusted people',
      },
      {
        id: 'emergency',
        icon: (
          <FontAwesome5
            name="ambulance"
            size={24}
            color={themeStyles.icon.color}
          />
        ),
        title: 'Emergency access',
        description: 'Ensure account access in emergencies',
      },
      {
        id: 'support',
        icon: (
          <MaterialIcons
            name="support-agent"
            size={24}
            color={themeStyles.icon.color}
          />
        ),
        title: 'Priority tech support',
        description: 'Get fast, personal responses to your questions',
      },
    ];

  const onPressGoPremium = () => {
    // TODO: integrate actual purchase / subscription flow here.
    // e.g. navigation.navigate('PurchaseFlow');
    // or call in-app purchase API, then on success navigate to confirmation
    navigation.navigate('PurchaseFlow' as never);
  };

  return (
    <ScrollView style={[styles.container, themeStyles.container]} showsVerticalScrollIndicator={false}>
      {/* Top banner section */}
      <View style={styles.bannerContainer}>
        {/* 
          Replace this with an actual image/illustration asset:
          e.g. <Image source={require('../assets/images/premium_banner.png')} style={styles.bannerImage} />
        */}
        <View style={[styles.bannerPlaceholder, themeStyles.container]}>
          <Text style={[styles.bannerPlaceholderText, themeStyles.text]}>
            {/* Placeholder: plane drawing + location pin */}
            {/* You can overlay an Image here */}
            Premium Illustration
          </Text>
        </View>
        <Text style={[styles.bannerTitle]}>
          Peace of mind.
        </Text>
        <Text style={[styles.bannerSubtitle]}>
          Wherever you go.
        </Text>
        <Text style={[styles.bannerCaption]}>
          Explore Premium today.
        </Text>
      </View>

      {/* Benefits card */}
      <View style={[styles.benefitsCard, themeStyles.card, themeStyles.border]}>
        {benefits.map(item => (
          <View key={item.id} style={styles.benefitRow}>
            <View style={[styles.benefitIconCircle, themeStyles.card]}>
              {item.icon}
            </View>
            <View style={styles.benefitTextContainer}>
              <Text style={[styles.benefitTitle, themeStyles.text]}>
                {item.title}
              </Text>
              <Text
                style={[styles.benefitDescription, themeStyles.textGray]}
              >
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Divider / info */}
      <View style={styles.infoSection}>
        <MaterialCommunityIcons
          name="shield-check"
          size={32}
          color={themeStyles.icon.color}
        />
        <Text style={[styles.infoText, themeStyles.text]}>
          Effortless security for your digital life
        </Text>
        <Text style={[styles.subInfoText, themeStyles.textGray]}>
          By enabling Premium you agree to the Terms of Service and Privacy Policy.
        </Text>
      </View>

      {/* Go Premium button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.premiumButton, themeStyles.buttonBorder]}
          onPress={onPressGoPremium}
        >
          <Text style={[styles.premiumButtonText, themeStyles.buttonText]}>Go Premium</Text>
        </TouchableOpacity>
        <Text style={[styles.priceText, themeStyles.textGray]}>
          Just {priceText}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    backgroundColor: '#5C3EA8',
    paddingTop: StatusBar.currentHeight,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    height: height * 0.5
  },
  bannerPlaceholder: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerPlaceholderText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  bannerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    fontSize: 20,
    fontFamily: 'Poppins_500Medium',
    color: '#FFFFFF',
    marginTop: 4,
  },
  bannerCaption: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#E0E0E0',
    marginTop: 8,
  },
  benefitsCard: {
    marginHorizontal: width * 0.05,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    marginTop: -(height * 0.09)
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  benefitDescription: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 2,
  },
  infoSection: {
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: width * 0.1,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    marginTop: 8,
    textAlign: 'center',
  },
  subInfoText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginTop: 4,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginHorizontal: width * 0.1,
  },
  premiumButton: {
    height: height * 0.07,
    borderRadius: 10,
    width: '100%',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 10
  },
  premiumButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  priceText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginTop: 8,
    marginBottom: 10
  },
});

export default PremiumScreen;
