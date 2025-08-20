import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { darkTheme, lightTheme } from '../../assets/colors/theme';
import {
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
  Ionicons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PremiumScreen: React.FC = () => {
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;
  const navigation = useNavigation<any>();
  const priceText = '$29.99 / year';

  // Diamond animation
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  const features = [
    {
      key: 'sync',
      icon: <MaterialCommunityIcons name="cloud-sync-outline" size={32} color={themeStyles.text.color} />,
      title: 'Auto Sync',
      desc: 'Always updated across all devices.',
    },
    {
      key: 'share',
      icon: <MaterialCommunityIcons name="account-group-outline" size={32} color={themeStyles.text.color} />,
      title: 'Group Sharing',
      desc: 'Share & manage access effortlessly.',
    },
    {
      key: 'backup',
      icon: <FontAwesome5 name="file-medical-alt" size={28} color={themeStyles.text.color} />,
      title: 'Encrypted Backup',
      desc: 'Secure off-site copy of your data.',
    },
    {
      key: 'support',
      icon: <MaterialIcons name="support-agent" size={32} color={themeStyles.text.color} />,
      title: 'Premium Support',
      desc: 'Priority help when you need it.',
    },
  ];

  return (
    <View style={[styles.screen, themeStyles.container]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <LinearGradient
          colors={['#ff7eb3', '#ff758c']}
          style={styles.hero}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Ionicons name="diamond" size={80} color="#fff" />
          </Animated.View>
          <Text style={styles.heroTitle}>Go Premium</Text>
          <Text style={styles.heroSubtitle}>
            Unlock all features, get priority support, and keep your data ultra-secure.
          </Text>
        </LinearGradient>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          {features.map((f) => (
            <View
              key={f.key}
              style={[styles.featureCard, themeStyles.card, themeStyles.border]}
            >
              <View style={styles.featureIcon}>{f.icon}</View>
              <Text style={[styles.featureTitle, themeStyles.text]}>{f.title}</Text>
              <Text style={[styles.featureDesc, themeStyles.textGray]}>{f.desc}</Text>
            </View>
          ))}
        </View>

        {/* Price Section */}
        <View style={[styles.priceCard, themeStyles.card]}>
          <Text style={[styles.priceText, themeStyles.text]}>{priceText}</Text>
          <Text style={[styles.priceSub, themeStyles.textGray]}>
            That’s less than $2.50/month!
          </Text>
        </View>

        {/* Terms Section */}
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

      {/* Sticky CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('PurchaseFlow' as never)}
        >
          <LinearGradient
            colors={['#ff7eb3', '#ff758c']}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>Unlock for {priceText}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  hero: {
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  heroTitle: {
    fontSize: 30,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
    marginTop: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#fff',
    marginTop: 8,
    paddingHorizontal: 30,
    textAlign: 'center',
  },
  featuresSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  featureCard: {
    padding: 20,
    borderRadius: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  featureIcon: {
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginTop: 6,
  },
  priceCard: {
    marginTop: 24,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
  },
  priceSub: {
    fontSize: 13,
    marginTop: 4,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
    marginBottom: 100,
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
    backgroundColor: 'transparent',
  },
  ctaButton: { width: '100%' },
  ctaGradient: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 17,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
  },
});

export default PremiumScreen;
