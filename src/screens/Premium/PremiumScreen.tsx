import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { darkTheme, lightTheme } from '../../assets/colors/theme';
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PremiumScreen: React.FC = () => {
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;
  const navigation = useNavigation<any>();

  // pulse animation for the shield icon
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const insights = [
    {
      key: 'strength',
      icon: <FontAwesome5 name="lock" size={26} color={themeStyles.text.color} />,
      title: 'Password Strength',
      desc: 'Most of your stored passwords are strong.',
    },
    {
      key: 'reuse',
      icon: (
        <MaterialCommunityIcons
          name="repeat-variant"
          size={28}
          color={themeStyles.text.color}
        />
      ),
      title: 'Reused Passwords',
      desc: '2 accounts use the same password.',
    },
    {
      key: 'breach',
      icon: (
        <MaterialCommunityIcons
          name="alert-decagram-outline"
          size={28}
          color={themeStyles.text.color}
        />
      ),
      title: 'Breach Check',
      desc: 'No recent breaches detected.',
    },
  ];

  return (
    <View style={[styles.screen, themeStyles.container]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={['#ff9966', '#ff5e62']} style={styles.hero}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Ionicons name="shield-checkmark" size={80} color="#fff" />
          </Animated.View>
          <Text style={styles.heroTitle}>Security Insights</Text>
          <Text style={styles.heroSubtitle}>
            Stay informed about your vault’s health and keep your data protected.
          </Text>
        </LinearGradient>

        {/* Insights Section */}
        <View style={styles.insightsSection}>
          {insights.map((i) => (
            <View
              key={i.key}
              style={[styles.insightCard, themeStyles.card, themeStyles.border]}
            >
              <View style={styles.insightIcon}>{i.icon}</View>
              <Text style={[styles.insightTitle, themeStyles.text]}>
                {i.title}
              </Text>
              <Text style={[styles.insightDesc, themeStyles.textGray]}>
                {i.desc}
              </Text>
            </View>
          ))}
        </View>

        {/* Tip of the Day */}
        <View style={[styles.tipCard, themeStyles.card]}>
          <MaterialCommunityIcons
            name="lightbulb-on-outline"
            size={22}
            color={themeStyles.text.color}
          />
          <Text style={[styles.tipText, themeStyles.text]}>
            Tip: Enable two-factor authentication for your most important
            accounts.
          </Text>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('PasswordGenerator' as never)}
        >
          <LinearGradient
            colors={['#ff9966', '#ff5e62']}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>Generate Stronger Passwords</Text>
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
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
    marginTop: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#fff',
    marginTop: 8,
    paddingHorizontal: 28,
    textAlign: 'center',
  },
  insightsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  insightCard: {
    padding: 20,
    borderRadius: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  insightIcon: { marginBottom: 10 },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
  insightDesc: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginTop: 6,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 14,
  },
  tipText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    marginLeft: 8,
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
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
  },
});

export default PremiumScreen;
