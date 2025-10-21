import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function AnimatedSplash() {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1
    );

    scale.value = withTiming(1.4, {
      duration: 1800,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <MaskedView
        style={styles.maskContainer}
        maskElement={
          <View style={styles.maskCenter}>
            <Animated.View style={[styles.rotatingCircle, animatedCircleStyle]} />
          </View>
        }
      >
        <LinearGradient
          colors={['#1c6d79', '#63cdda']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientText}
        >
          <Text style={styles.text}>Pandora</Text>
        </LinearGradient>
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskContainer: {
    width: width,
    height: height / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotatingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'black',
  },
  gradientText: {
    padding: 20,
    borderRadius: 20
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
    color: 'white',
  },
});
