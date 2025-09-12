import React, { useRef, useEffect } from 'react';
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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PremiumScreen: React.FC = () => {
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;
  const navigation = useNavigation<any>();

  const priceText = '$29.99 / year';

  // Floating animation
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 8,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  const perks = [
    { icon: 'cloud-sync-outline', title: 'Auto Sync', desc: 'Stay updated everywhere' },
    { icon: 'shield-lock-outline', title: 'Advanced Security', desc: 'Extra protection layers' },
    { icon: 'palette-outline', title: 'Exclusive Themes', desc: 'More styles to match you' },
    { icon: 'headset', title: 'Priority Support', desc: 'Get help fast' },
  ];

  return (
    <View style={[styles.screen, themeStyles.container]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <LinearGradient
          colors={['#41e1fa', '#065a41']}
          style={styles.hero}
        >
          <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
            <Ionicons name="diamond" size={90} color="#fff" />
          </Animated.View>
          <Text style={styles.heroTitle}>Go Premium</Text>
          <Text style={styles.heroSubtitle}>
            Unlock everything and level up your experience.
          </Text>
        </LinearGradient>

        {/* Comparison Section */}
        <View style={styles.comparisonContainer}>
          <Text style={[styles.sectionTitle, themeStyles.text]}>Free vs Premium</Text>
          <View style={[styles.comparisonRow, themeStyles.card]}>
            <Text style={[styles.col, themeStyles.text]}>Free</Text>
            <Text style={[styles.col, themeStyles.text]}>Premium</Text>
          </View>
          {[
            ['Limited vaults', 'Unlimited vaults'],
            ['Ads included', 'Ad-free'],
            ['Basic support', 'Priority support'],
            ['1 theme', 'All themes'],
          ].map(([free, premium], i) => (
            <View key={i} style={[styles.comparisonRow, themeStyles.border]}>
              <Text style={[styles.col, themeStyles.textGray]}>{free}</Text>
              <Text style={[styles.col, themeStyles.text]}>{premium}</Text>
            </View>
          ))}
        </View>

        {/* Perks */}
        <View style={styles.perksContainer}>
          <Text style={[styles.sectionTitle, themeStyles.text]}>Why Upgrade?</Text>
          {perks.map((p, i) => (
            <View key={i} style={[styles.perkCard, themeStyles.card]}>
              <MaterialCommunityIcons
                name={p.icon as any}
                size={28}
                color={themeStyles.text.color}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.perkTitle, themeStyles.text]}>{p.title}</Text>
                <Text style={[styles.perkDesc, themeStyles.textGray]}>{p.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Price */}
        <View style={[styles.priceBox, themeStyles.card]}>
          <Text style={[styles.price, themeStyles.text]}>{priceText}</Text>
          <Text style={[styles.subPrice, themeStyles.textGray]}>≈ $2.50/month</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('PurchaseFlow')}>
          <LinearGradient
            colors={['#41e1fa', '#065a41']}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>Unlock Premium</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  hero: {
    paddingTop: StatusBar.currentHeight || 50,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
    marginTop: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#fff',
    marginTop: 6,
    paddingHorizontal: 30,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    marginVertical: 16,
  },
  comparisonContainer: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  col: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  perksContainer: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  perkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  perkTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  perkDesc: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    marginTop: 2,
  },
  priceBox: {
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  price: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
  },
  subPrice: {
    fontSize: 13,
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
  },
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
