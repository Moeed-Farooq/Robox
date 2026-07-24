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

const SPLASH_DURATION_MS = 4500;

const useSplashAnimation = onComplete => {
  const entrance = useRef(new Animated.Value(0)).current;
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
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, SPLASH_DURATION_MS);

    Animated.timing(entrance, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    loopPulse(orbA, 3400).start();
    loopPulse(orbB, 4200).start();
    loopPulse(orbC, 5000).start();

    const particleTimers = particles.map(particle =>
      setTimeout(() => {
        Animated.loop(
          Animated.timing(particle.anim, {
            toValue: 1,
            duration: particle.duration,
            useNativeDriver: true,
          }),
        ).start();
      }, particle.delay),
    );

    return () => {
      clearTimeout(completeTimer);
      particleTimers.forEach(clearTimeout);
    };
  }, [entrance, onComplete, orbA, orbB, orbC, particles]);

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

  return {
    particles,
    getParticleStyle,
    orbAStyle: orbStyle(orbA, wp(4), -hp(1.5), [0.3, 0.65]),
    orbBStyle: orbStyle(orbB, -wp(3), hp(2), [0.2, 0.5]),
    orbCStyle: orbStyle(orbC, wp(2), hp(1), [0.15, 0.4]),
    fadeUp,
  };
};

export default useSplashAnimation;
