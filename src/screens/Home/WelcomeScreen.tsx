import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SvgUri } from 'react-native-svg'
import { darkTheme, lightTheme } from '../../assets/colors/theme'
import { useTheme } from '../../context/ThemeContext'

const { width, height } = Dimensions.get('window')

export default function WelcomeScreen({
  onDone,
}: {
  onDone?: () => void
}) {
  const navigation = useNavigation<any>()
  const scrollRef = useRef<ScrollView>(null)
  const [page, setPage] = useState(0)
  const { isDark } = useTheme();
  const themeStyles = isDark ? darkTheme : lightTheme;

  const pages = [
    {
      title: 'Secure Your Passwords',
      text: 'Store all your credentials in one encrypted, easy-to-access vault.',
    },
    {
      title: 'Generate Strong Passwords',
      text: 'Create unique, high‑entropy passwords with our built‑in generator.',
    },
    {
      title: 'Access Anywhere',
      text: 'Sync across devices and enable two‑factor authentication for extra security.',
    },
  ]

  const handleDone = () => {
    if (onDone) {
      return onDone()
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' as never }],
    })
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width)
    setPage(idx)
  }

  return (
    <View style={styles.container}>
      {/* background SVGs */}
      <View style={styles.topLeftSvg}>
        <SvgUri
          // width="150"
          // height="150"
          uri={require('../../assets/images/topLeft.svg')}
        />
      </View>
      <View style={styles.bottomRightSvg}>
        <SvgUri
          // width="150"
          // height="150"
          uri={require('../../assets/images/bottomRight.svg')}
        />
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ref={scrollRef}
        contentContainerStyle={{ width: width * pages.length }}
      >
        {pages.map((p, i) => (
          <View key={i} style={styles.page}>
            <Text style={styles.title}>{p.title}</Text>
            <Text style={styles.text}>{p.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Skip button */}
      {page < pages.length - 1 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => {
            console.log('⏩ Skip pressed!')
            scrollRef.current?.scrollTo({
              x: (pages.length - 1) * width,
              y: 0,
              animated: true,
            })
          }}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* pagination dots */}
      <View style={styles.dots}>
        {pages.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, page === i && styles.dotActive]}
          />
        ))}
      </View>

      {/* “Let’s Start” on last page */}
      {page === pages.length - 1 && (
        <TouchableOpacity style={[styles.startButton, themeStyles.buttonBorder]} onPress={handleDone}>
          <Text style={[styles.startText, themeStyles.buttonText]}>Let’s Start</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  topLeftSvg: {
    position: 'absolute',
    top: -(height * 0.03),
    left: 0
  },
  bottomRightSvg: {
    position: 'absolute',
    bottom: -(height * 0.03),
    right: 0
  },
  skipButton: {
    position: 'absolute',
    top: height * 0.05,
    right: 20,
    padding: 8,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#4C4DDC',
    // fontWeight: '500',
    fontFamily: 'Poppins_600SemiBold'
  },
  page: {
    width,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#002055',
    marginTop: height * 0.1
  },
  text: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    color: '#4F4F4F',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: height * 0.1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#4C4DDC'
  },
  startButton: {
    position: 'absolute',
    bottom: height * 0.3,
    left: width * 0.1,
    right: width * 0.1,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 3
  },
  startText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
})