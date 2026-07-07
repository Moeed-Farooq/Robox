import React, { useCallback } from 'react';
import { Animated, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { en } from '../../languages';
import { TAB } from '../../enums';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import { SVG } from '../../assets';
import useSplashAnimation from '../../hooks/useSplashAnimation';
import Image from '../../common/Image';
import { IMAGES } from '../../assets/images';

const SplashScreen = ({ navigation }) => {
  const handleComplete = useCallback(() => {
    navigation.replace(TAB.BOTTOM);
  }, [navigation]);

  const {
    particles,
    getParticleStyle,
    orbAStyle,
    orbBStyle,
    orbCStyle,
    logoWrapStyle,
    logoRingStyle,
    fadeUp,
    progressWidth,
  } = useSplashAnimation(handleComplete);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.splashBg} barStyle="light-content" />

      <LinearGradient
        colors={[COLORS.splashBg, COLORS.gradientMid, COLORS.bgPurpleDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[styles.particle, getParticleStyle(particle)]}
        />
      ))}

      <Animated.View style={[styles.orb, styles.orbGold, orbAStyle]} />
      <Animated.View style={[styles.orb, styles.orbMint, orbBStyle]} />
      <Animated.View style={[styles.orb, styles.orbPurple, orbCStyle]} />

      <View style={styles.centerContent}>
        <Animated.View style={[styles.logoWrap, logoWrapStyle]}>
          <Animated.View style={[styles.logoRing, logoRingStyle]} />
          <View style={styles.logoGlow}>
            <View style={styles.logoContainer}>
              <Image src={IMAGES.LOGO} style={styles.logoImage}/>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.titleBlock, fadeUp(0.3)]}>
          <Label style={styles.titleMain} color={COLORS.white}>
            {en.robuxPoints}
          </Label>
        </Animated.View>

        <Animated.View style={fadeUp(0.5)}>
          <Label style={styles.subtitle}>{en.getPremiumRewards}</Label>
        </Animated.View>
      </View>

      <Animated.View style={[styles.bottomSection, fadeUp(0.65)]}>
        <View style={styles.progressShell}>
          <View style={styles.progressBarBg}>
            <Animated.View style={[styles.progressFillWrap, { width: progressWidth }]}>
              <LinearGradient
                colors={[COLORS.yellow, COLORS.accent, COLORS.Purple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientFill}
              />
            </Animated.View>
          </View>
        </View>
      </Animated.View>
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
    borderRadius: 999,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orbGold: {
    width: wp(65),
    height: wp(65),
    top: hp(6),
    left: -wp(18),
    backgroundColor: COLORS.yellow + HEX_OPACITY[12],
  },
  orbMint: {
    width: wp(55),
    height: wp(55),
    bottom: hp(18),
    right: -wp(14),
    backgroundColor: COLORS.lightestGreen + HEX_OPACITY[10],
  },
  orbPurple: {
    width: wp(40),
    height: wp(40),
    top: hp(32),
    right: wp(8),
    backgroundColor: COLORS.Purple + HEX_OPACITY[18],
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(4),
  },
  logoWrap: {
    width: wp(44),
    height: wp(44),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  logoRing: {
    position: 'absolute',
    width: wp(44),
    height: wp(44),
    borderRadius: wp(2),
    borderWidth: 1.5,
    borderColor: COLORS.yellow,
  },
  logoGlow: {
    width: wp(42),
    height: wp(42),
    borderRadius: wp(2),
    backgroundColor: COLORS.darkWhite + HEX_OPACITY[12],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.darkWhite + HEX_OPACITY[25],
  },
  logoContainer: {
    width: wp(30),
    height: wp(30),
  },
  logoImage: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(2),
  },
  titleBlock: {
    alignItems: 'center',
    marginBottom: hp(0.8),
  },
  titleMain: {
    fontSize: hp(2.8),
    fontFamily: FONT.extraBold,
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingHorizontal: wp(6),
  },
  subtitle: {
    color: COLORS.lightWhite,
    fontSize: hp(1.6),
    fontFamily: FONT.medium,
    opacity: 0.9,
    letterSpacing: 0.4,
    textAlign: 'center',
    paddingHorizontal: wp(8),
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: hp(8),
    paddingHorizontal: wp(12),
  },
  progressShell: {
    width: '100%',
    shadowColor: COLORS.yellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  progressBarBg: {
    width: '100%',
    height: hp(0.9),
    backgroundColor: COLORS.darkWhite + HEX_OPACITY[10],
    borderRadius: hp(2),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.darkWhite + HEX_OPACITY[15],
  },
  progressFillWrap: {
    height: '100%',
  },
  gradientFill: {
    flex: 1,
    borderRadius: hp(2),
  },
});
