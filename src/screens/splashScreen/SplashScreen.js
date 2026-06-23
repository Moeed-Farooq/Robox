import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { en } from '../../languages';
import { TAB } from '../../enums';
import { COLORS, HEX_OPACITY, wp, hp, FONT } from '../../enums/StyleGuide';
import Label from '../../common';
import { SVG } from '../../assets';

const SplashScreen = ({ navigation }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const circle1 = useRef(new Animated.Value(0)).current;
  const circle2 = useRef(new Animated.Value(0)).current;

  const particles = useRef(
    [...Array(50)].map(() => ({
      anim: new Animated.Value(0),
      left: wp(Math.random() * 100),
      size: wp(Math.random() * 2 + 1),
      duration: 3000 + Math.random() * 3000,
      color: [
        'rgba(255,255,255,0.4)',
        'rgba(255,255,255,0.2)',
        'rgba(0,255,128,0.25)',
        'rgba(0,255,128,0.15)',
      ][Math.floor(Math.random() * 4)],
    })),
  ).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      navigation.replace(TAB.BOTTOM);
    });

    Animated.spring(logoScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle1, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(circle1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circle2, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(circle2, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    particles.forEach(particle => {
      Animated.loop(
        Animated.timing(particle.anim, {
          toValue: 1,
          duration: particle.duration,
          useNativeDriver: true,
        }),
      ).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.splashBg} barStyle="light-content" />

      {/* Particles */}
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              width: particle.size,
              height: particle.size,
              left: particle.left,
              backgroundColor: particle.color,
              transform: [
                {
                  translateY: particle.anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [hp(100), -hp(20)],
                  }),
                },
              ],
              opacity: particle.anim.interpolate({
                inputRange: [0, 0.2, 0.8, 1],
                outputRange: [0, 1, 1, 0],
              }),
            },
          ]}
        />
      ))}

      {/* Background blobs */}
      <Animated.View
        style={[
          styles.circle1,
          {
            transform: [
              {
                translateY: circle1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 30],
                }),
              },
            ],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.circle2,
          {
            transform: [
              {
                translateY: circle2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, -30],
                }),
              },
            ],
          },
        ]}
      />

      {/* Top Section */}
      <View style={styles.topSection}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
            },
          ]}>
          <SVG.logo width="100%" height="100%" />
        </Animated.View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Label style={styles.titleText}>{en.robuxPoints}</Label>

        <View style={styles.progressBarBg}>
          <Animated.View
            style={[
              styles.progressFillContainer,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}>
            <LinearGradient
              colors={[COLORS.orange, COLORS.Purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientFill}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
    overflow: 'hidden',
  },

  particle: {
    position: 'absolute',
    borderRadius: 100,
  },

  circle1: {
    position: 'absolute',
    width: wp(60),
    height: wp(60),
    borderRadius: wp(30),
    backgroundColor: 'rgba(255,215,0,0.12)',
    top: hp(8),
    left: -wp(15),
  },

  circle2: {
    position: 'absolute',
    width: wp(70),
    height: wp(70),
    borderRadius: wp(35),
    backgroundColor: 'rgba(0,255,128,0.10)',
    bottom: hp(10),
    right: -wp(20),
  },

  topSection: {
    alignItems: 'center',
    marginTop: hp(10),
  },

  logoContainer: {
    width: wp(42),
    height: wp(42),
  },

  bottomSection: {
    flex: 1,
    marginTop:hp(20),
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(10),
  },

  titleText: {
    color: COLORS.white,
    fontSize: hp(3),
    fontFamily: FONT.extraBold,
    marginBottom: hp(3),
    textAlign: 'center',
  },

  progressBarBg: {
    width: wp(70),
    height: hp(0.8),
    backgroundColor: COLORS.white + HEX_OPACITY[2],
    borderRadius: hp(2),
    overflow: 'hidden',
  },

  progressFillContainer: {
    height: '100%',
  },

  gradientFill: {
    flex: 1,
    borderRadius: hp(2),
  },
});