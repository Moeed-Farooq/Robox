import React, { useCallback } from 'react';
import { Animated, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { en } from '../../languages';
import { TAB } from '../../enums';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import useSplashAnimation from '../../hooks/useSplashAnimation';
import Image from '../../common/Image';
import { IMAGES } from '../../assets/images';
import { showAppOpenIfAvailable } from '../../services/ads';

const SplashScreen = ({ navigation }) => {
  const handleComplete = useCallback(() => {
    const goHome = () => navigation.replace(TAB.BOTTOM);

    const shown = showAppOpenIfAvailable({
      onClosed: goHome,
      onError: goHome,
    });

    if (!shown) {
      goHome();
    }
  }, [navigation]);

  const {
    particles,
    getParticleStyle,
    orbAStyle,
    orbBStyle,
    orbCStyle,
    fadeUp,
  } = useSplashAnimation(handleComplete);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.splashBg} barStyle="light-content" />

      <LinearGradient
        colors={[COLORS.bgPurpleDark, COLORS.splashBg, COLORS.gradientStart, COLORS.Purple]}
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
        <View style={styles.logoWrap}>
          <View style={styles.logoGlow}>
            <View style={styles.logoContainer}>
              <Image src={IMAGES.LOGO} style={styles.logoImage} />
            </View>
          </View>
        </View>

        <Animated.View style={[styles.titleBlock, fadeUp(0.3)]}>
          <Label style={styles.titleMain} color={COLORS.white}>
            {en.robuxPoints}
          </Label>
        </Animated.View>

        <Animated.View style={fadeUp(0.5)}>
          <Label style={styles.subtitle}>{en.getPremiumRewards}</Label>
        </Animated.View>
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
  logoGlow: {
    width: wp(42),
    height: wp(42),
    borderRadius: wp(8),
    backgroundColor: COLORS.accent + HEX_OPACITY[12],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightYellow + HEX_OPACITY[45],
  },
  logoContainer: {
    width: wp(30),
    height: wp(30),
  },
  logoImage: {
    width: wp(30),
    height: wp(30)
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
    textShadowColor: COLORS.accent + HEX_OPACITY[40],
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
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
});
