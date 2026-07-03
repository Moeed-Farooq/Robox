import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { COLORS, HEX_OPACITY, hp, wp } from '../enums/StyleGuide';

const PARTICLE_COUNT = 40;

const PARTICLE_COLORS = [
  COLORS.darkWhite + HEX_OPACITY[40],
  COLORS.darkWhite + HEX_OPACITY[20],
  COLORS.lightestGreen + HEX_OPACITY[25],
  COLORS.contrastYellow + HEX_OPACITY[20],
];

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

const useSplashAnimation = onComplete => {
  const progress = useRef(new Animated.Value(0)).current;
  const entrance = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;
  const logoRing = useRef(new Animated.Value(0)).current;
  const orbA = useRef(new Animated.Value(0)).current;
  const orbB = useRef(new Animated.Value(0)).current;
  const orbC = useRef(new Animated.Value(0)).current;

  const particles = useRef(
    [...Array(PARTICLE_COUNT)].map(() => ({
      anim: new Animated.Value(0),
      left: wp(Math.random() * 100),
      size: wp(Math.random() * 2.2 + 0.8),
      duration: 2800 + Math.random() * 3200,
      delay: Math.random() * 1200,
      color:
        PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    })),
  ).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 100,
      duration: 4500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        onComplete?.();
      }
    });

    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(entrance, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    loopPulse(logoFloat, 2200).start();
    loopPulse(orbA, 3400).start();
    loopPulse(orbB, 4200).start();
    loopPulse(orbC, 5000).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoRing, {
          toValue: 1,
          duration: 1600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(logoRing, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    particles.forEach(particle => {
      setTimeout(() => {
        Animated.loop(
          Animated.timing(particle.anim, {
            toValue: 1,
            duration: particle.duration,
            useNativeDriver: true,
          }),
        ).start();
      }, particle.delay);
    });
  }, [entrance, logoFloat, logoRing, logoScale, onComplete, orbA, orbB, orbC, particles, progress]);

  const getParticleStyle = particle => ({
    width: particle.size,
    height: particle.size,
    left: particle.left,
    backgroundColor: particle.color,
    transform: [
      {
        translateY: particle.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [hp(105), -hp(15)],
        }),
      },
    ],
    opacity: particle.anim.interpolate({
      inputRange: [0, 0.15, 0.85, 1],
      outputRange: [0, 1, 1, 0],
    }),
  });

  const orbStyle = (value, outputX, outputY, opacityRange) => ({
    opacity: value.interpolate({
      inputRange: [0, 1],
      outputRange: opacityRange,
    }),
    transform: [
      {
        translateX: value.interpolate({
          inputRange: [0, 1],
          outputRange: [0, outputX],
        }),
      },
      {
        translateY: value.interpolate({
          inputRange: [0, 1],
          outputRange: [0, outputY],
        }),
      },
      {
        scale: value.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        }),
      },
    ],
  });

  const logoWrapStyle = {
    opacity: entrance,
    transform: [
      { scale: logoScale },
      {
        translateY: logoFloat.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -hp(0.8)],
        }),
      },
    ],
  };

  const logoRingStyle = {
    opacity: logoRing.interpolate({
      inputRange: [0, 0.35, 1],
      outputRange: [0.6, 0.3, 0],
    }),
    transform: [
      {
        scale: logoRing.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
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
          outputRange: [20, 20, 0],
        }),
      },
    ],
  });

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return {
    particles,
    getParticleStyle,
    orbAStyle: orbStyle(orbA, wp(4), -hp(1.5), [0.3, 0.65]),
    orbBStyle: orbStyle(orbB, -wp(3), hp(2), [0.2, 0.5]),
    orbCStyle: orbStyle(orbC, wp(2), hp(1), [0.15, 0.4]),
    logoWrapStyle,
    logoRingStyle,
    fadeUp,
    progressWidth,
  };
};

export default useSplashAnimation;
