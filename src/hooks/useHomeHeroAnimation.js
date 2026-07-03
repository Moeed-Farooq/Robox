import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { hp, wp } from '../enums/StyleGuide';

const loopPulse = (value, duration, easing = Easing.inOut(Easing.sin)) =>
  Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1,
        duration,
        easing,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 0,
        duration,
        easing,
        useNativeDriver: true,
      }),
    ]),
  );

const useHomeHeroAnimation = () => {
  const entrance = useRef(new Animated.Value(0)).current;
  const orbA = useRef(new Animated.Value(0)).current;
  const orbB = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;
  const liveDot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    loopPulse(orbA, 3200).start();
    loopPulse(orbB, 4200).start();
    loopPulse(float, 1800).start();
    loopPulse(liveDot, 700).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(ring, {
          toValue: 1,
          duration: 1400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(ring, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [entrance, float, liveDot, orbA, orbB, ring]);

  const cardEnter = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [28, 0],
        }),
      },
      {
        scale: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [0.94, 1],
        }),
      },
    ],
  };

  const fadeUp = delay => ({
    opacity: entrance.interpolate({
      inputRange: [0, delay, 1],
      outputRange: [0, 0, 1],
    }),
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, delay, 1],
          outputRange: [16, 16, 0],
        }),
      },
    ],
  });

  const orbAStyle = {
    opacity: orbA.interpolate({
      inputRange: [0, 1],
      outputRange: [0.35, 0.7],
    }),
    transform: [
      {
        translateX: orbA.interpolate({
          inputRange: [0, 1],
          outputRange: [0, wp(3)],
        }),
      },
      {
        translateY: orbA.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -hp(1.2)],
        }),
      },
      {
        scale: orbA.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.12],
        }),
      },
    ],
  };

  const orbBStyle = {
    opacity: orbB.interpolate({
      inputRange: [0, 1],
      outputRange: [0.25, 0.55],
    }),
    transform: [
      {
        translateX: orbB.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -wp(2.5)],
        }),
      },
      {
        translateY: orbB.interpolate({
          inputRange: [0, 1],
          outputRange: [0, hp(1.5)],
        }),
      },
    ],
  };

  const floatStyle = {
    transform: [
      {
        translateY: float.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -hp(0.6)],
        }),
      },
    ],
  };

  const ringStyle = {
    opacity: ring.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [0.55, 0.25, 0],
    }),
    transform: [
      {
        scale: ring.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.55],
        }),
      },
    ],
  };

  const liveDotStyle = {
    opacity: liveDot.interpolate({
      inputRange: [0, 1],
      outputRange: [0.45, 1],
    }),
    transform: [
      {
        scale: liveDot.interpolate({
          inputRange: [0, 1],
          outputRange: [0.85, 1.15],
        }),
      },
    ],
  };

  return {
    cardEnter,
    fadeUp,
    orbAStyle,
    orbBStyle,
    floatStyle,
    ringStyle,
    liveDotStyle,
  };
};

export default useHomeHeroAnimation;
