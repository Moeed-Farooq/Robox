import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import { en } from '../../languages';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import Pressable from '../../common/Pressable';
import { SCREEN } from '../../enums';
import useHomeHeroAnimation from '../../hooks/useHomeHeroAnimation';

const HomeHeroBanner = ({ navigation, totalPoints = 0, totalPointsLoading = false }) => {
  const {
    cardEnter,
    fadeUp,
    orbAStyle,
    orbBStyle,
    floatStyle,
    ringStyle,
    liveDotStyle,
  } = useHomeHeroAnimation();

  return (
    <Animated.View style={[styles.heroShell, cardEnter]}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        style={[styles.heroOrb, styles.heroOrbPrimary, orbAStyle]}
      />
      <Animated.View
        style={[styles.heroOrb, styles.heroOrbAccent, orbBStyle]}
      />

      <View style={styles.heroContent}>
        <View style={styles.heroTopRow}>
          <View style={styles.textColumn}>
            <Animated.View style={fadeUp(0.15)}>
              <View style={styles.liveBadge}>
                <Animated.View style={[styles.liveDot, liveDotStyle]} />
                <Label style={styles.liveBadgeText}>{en.games}</Label>
              </View>
            </Animated.View>

            <Animated.View style={fadeUp(0.35)}>
              <Label style={styles.robuxText} color={COLORS.white}>
                {en.robuxPoints}
              </Label>
            </Animated.View>

            <Animated.View style={fadeUp(0.55)}>
              <Label style={styles.welcomeText} color={COLORS.lightWhite}>
                {en.welconeBack}
              </Label>
            </Animated.View>

            <Animated.View style={fadeUp(0.65)}>
              <Label style={styles.totalPointsText}>
                {en.totalPoints}: {totalPointsLoading ? '--' : Number(totalPoints).toLocaleString()}
              </Label>
            </Animated.View>
          </View>

          <Animated.View style={[styles.controllerWrap, floatStyle]}>
            <Animated.View style={[styles.controllerRing, ringStyle]} />
            <Pressable
              style={styles.controller}
              onPress={() => navigation.navigate(SCREEN.GAMES_SCREEN)}
            >
              <SvgIcon
                icon={SVG.gameControllerWhite}
                width={hp(3.6)}
                height={hp(3.6)}
              />
            </Pressable>
          </Animated.View>
        </View>

        <Animated.View style={fadeUp(0.75)}>
          <View style={styles.heroFooter}>
            <View style={styles.heroChip}>
              <SvgIcon icon={SVG.starsWhite} width={hp(1.8)} height={hp(1.8)} />
              <Label style={styles.heroChipText}>{en.dailyRewards}</Label>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroChip}>
              <SvgIcon icon={SVG.starWheel} width={hp(1.8)} height={hp(1.8)} />
              <Label style={styles.heroChipText}>{en.playRobuxBlast}</Label>
            </View>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default HomeHeroBanner;

const styles = StyleSheet.create({
  heroShell: {
    borderRadius: wp(6),
    marginTop: hp(1),
    marginBottom: hp(2.5),
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 10,
  },
  heroContent: {
    paddingTop: hp(2.4),
    paddingBottom: hp(2.6),
    paddingHorizontal: wp(5),
  },
  heroOrb: {
    position: 'absolute',
    borderRadius: 999,
  },
  heroOrbPrimary: {
    width: wp(28),
    height: wp(28),
    top: -hp(2),
    right: -wp(4),
    backgroundColor: COLORS.darkWhite + HEX_OPACITY[15],
  },
  heroOrbAccent: {
    width: wp(22),
    height: wp(22),
    bottom: -hp(1),
    left: -wp(6),
    backgroundColor: COLORS.contrastYellow + HEX_OPACITY[20],
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  textColumn: {
    flex: 1,
    paddingRight: wp(2),
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.darkWhite + HEX_OPACITY[18],
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: hp(2),
    marginBottom: hp(1),
    borderWidth: 1,
    borderColor: COLORS.darkWhite + HEX_OPACITY[22],
  },
  liveDot: {
    width: hp(0.9),
    height: hp(0.9),
    borderRadius: hp(0.45),
    backgroundColor: COLORS.lightestGreen,
    marginRight: wp(1.5),
  },
  liveBadgeText: {
    color: COLORS.creamWhite,
    fontSize: hp(1.25),
    fontFamily: FONT.semiBold,
    letterSpacing: wp(0.6),
    textTransform: 'uppercase',
  },
  welcomeText: {
    fontSize: hp(1.85),
    lineHeight: hp(2.6),
    marginTop: hp(0.5),
    fontFamily: FONT.regular,
    opacity: 0.95,
  },
  totalPointsText: {
    color: COLORS.yellow,
    fontSize: hp(1.9),
    marginTop: hp(0.8),
    fontFamily: FONT.semiBold,
  },
  robuxText: {
    fontSize: hp(3.2),
    lineHeight: hp(4.2),
    fontFamily: FONT.semiBold,
    letterSpacing: 0.3,
  },
  controllerWrap: {
    width: hp(7.2),
    height: hp(7.2),
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  controllerRing: {
    position: 'absolute',
    width: hp(7.2),
    height: hp(7.2),
    borderRadius: hp(3.6),
    borderWidth: 2,
    borderColor: COLORS.yellow,
  },
  controller: {
    width: hp(6.4),
    height: hp(6.4),
    backgroundColor: COLORS.darkWhite + HEX_OPACITY[22],
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(2.2),
    borderWidth: 1,
    borderColor: COLORS.darkWhite + HEX_OPACITY[35],
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2.2),
    backgroundColor: COLORS.black + HEX_OPACITY[18],
    borderRadius: hp(2),
    paddingVertical: hp(1.1),
    paddingHorizontal: wp(3),
    borderWidth: 1,
    borderColor: COLORS.darkWhite + HEX_OPACITY[12],
  },
  heroChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(1.5),
  },
  heroChipText: {
    color: COLORS.lightWhite,
    fontSize: hp(1.25),
    fontFamily: FONT.medium,
  },
  heroDivider: {
    width: 1,
    height: hp(2),
    backgroundColor: COLORS.darkWhite + HEX_OPACITY[20],
    marginHorizontal: wp(1),
  },
});
