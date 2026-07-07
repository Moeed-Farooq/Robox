import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { G, Path } from 'react-native-svg'; // SVG components import karein
import { SVG } from '../../assets';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SPIN_REWARDS } from '../../dummies';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import { en } from '../../languages';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isIOS } from '../../helpers';
import useTotalPoints from '../../hooks/useTotalPoints';
import { showRewardedAdForAction } from '../../services/ads';

const SpinWheelScreen = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerModalVisible, setWinnerModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isSpinAgainAdInProgress, setIsSpinAgainAdInProgress] = useState(false);
  const navigation = useNavigation();
  const { addPoints } = useTotalPoints();

  const totalSegments = SPIN_REWARDS.length;
  const degreesPerSegment = 360 / totalSegments;
  const wheelSize = wp(76);
  const radius = wheelSize / 2;

  const getCoordinatesForPercent = percent => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const makeSlicePath = index => {
    const startPercent = index / totalSegments;
    const endPercent = (index + 1) / totalSegments;

    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);

    const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;

    return `
      M ${radius} ${radius}
      L ${radius + startX * radius} ${radius + startY * radius}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${radius + endX * radius} ${
      radius + endY * radius
    }
      Z
    `;
  };

  const startSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * totalSegments);
    const targetReward = SPIN_REWARDS[randomIndex];

    const targetAngle =
      360 - randomIndex * degreesPerSegment - degreesPerSegment / 2 - 90;
    const finalValue = 1440 + targetAngle;

    spinValue.setValue(0);

    Animated.timing(spinValue, {
      toValue: finalValue,
      duration: 4000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setSelectedReward(targetReward);
      setWinnerModalVisible(true);
      setIsSpinning(false);

      addPoints(targetReward?.reward || 0).catch(error => {
        console.warn('Failed to save Spin Wheel reward:', error?.message || error);
      });
    });
  };

  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const handleSpinAgainWithRewardAd = async () => {
    if (isSpinAgainAdInProgress) {
      return;
    }

    setIsSpinAgainAdInProgress(true);

    try {
      await showRewardedAdForAction(() => {
        setWinnerModalVisible(false);
        startSpin();
      });
    } finally {
      setIsSpinAgainAdInProgress(false);
    }
  };

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: COLORS.splashBg }, styles.mainContainer]}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton}>
          <SvgIcon
            icon={SVG.goBack}
            height={hp(2.5)}
            width={hp(2.5)}
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <SvgIcon icon={SVG.stats} height={hp(2.5)} width={hp(2.5)} />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Label style={[styles.titleText, { color: COLORS.white }]}>
            {en.spin}{' '}
          </Label>
          <Label style={[styles.titleText, { color: COLORS.yellow }]}>
            {en.wheel}
          </Label>
        </View>
        <Label style={styles.subtitleText}>{en.getPremiumRewards}</Label>
      </View>

      <View style={styles.wheelWrapper}>
        <View style={styles.indicatorContainer}>
          <View style={styles.indicatorTriangle} />
        </View>

        <View style={styles.outerGlow}>
          <Animated.View
            style={[
              styles.wheelContainer,
              { transform: [{ rotate: spinInterpolate }] },
            ]}
          >
            <Svg
              width={wheelSize}
              height={wheelSize}
              viewBox={`0 0 ${wheelSize} ${wheelSize}`}
            >
              <G>
                {SPIN_REWARDS.map((item, index) => {
                  const dPath = makeSlicePath(index);
                  return (
                    <Path key={`bg-${item.id}`} d={dPath} fill={item.color} />
                  );
                })}
              </G>
            </Svg>

            <View style={StyleSheet.absoluteFill}>
              {SPIN_REWARDS.map((item, index) => {
                const rotationAngle =
                  index * degreesPerSegment + degreesPerSegment / 2;

                return (
                  <View
                    key={`content-${item.id}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                      transform: [{ rotate: `${rotationAngle}deg` }],
                    }}
                  >
                    <View
                      style={{
                        transform: [
                          { translateX: radius * 0.65 },
                          { rotate: '90deg' },
                        ],
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <SvgIcon
                        icon={item.icon}
                        height={hp(3.5)}
                        width={hp(3.5)}
                      />
                      <Label style={styles.sliceText}>{item.title}</Label>
                    </View>
                  </View>
                );
              })}
            </View>
          </Animated.View>

          <View style={styles.centerHub}>
            <SvgIcon icon={SVG.crown} height={hp(4)} width={hp(4)} />
          </View>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={startSpin}
        disabled={isSpinning}
        style={[styles.spinButton, isSpinning && { opacity: 0.6 }]}
      >
        <SvgIcon
          icon={SVG.spin}
          height={hp(3)}
          width={hp(3)}
          style={{ marginRight: wp(2) }}
        />
        <Label style={styles.spinButtonText}>{en.spin}</Label>
      </TouchableOpacity>

      {winnerModalVisible && (
        <Modal transparent animationType="fade" visible={winnerModalVisible}>
          <View style={styles.modalOverlay}>
            <StatusBar
              backgroundColor={COLORS.black}
              barStyle={'light-content'}
            />
            <View style={styles.modalContent}>
              <SvgIcon icon={SVG.partyPopper} height={hp(5)} width={hp(5)} />
              <Label style={styles.modalCongratulations}>
                {en.congratulations}
              </Label>
              <Label style={styles.modalYouWon}>{en.youWon}</Label>

              <Label style={styles.modalRewardValue}>
                ★ {selectedReward?.reward.toLocaleString()} {en.robux}
              </Label>
              <View
                style={[
                  styles.rarityBadge,
                  { backgroundColor: COLORS.hubOrangeOverlay },
                ]}
              >
                <Label style={styles.rarityText}>
                  {selectedReward?.rarity.toUpperCase()}
                </Label>
              </View>
              <TouchableOpacity
                style={styles.spinAgainBtn}
                onPress={handleSpinAgainWithRewardAd}
                disabled={isSpinAgainAdInProgress}
              >
                <Label style={styles.btnTextActive}>{en.spinAgain}</Label>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.collectBtn}
                onPress={() => setWinnerModalVisible(false)}
              >
                <Label style={styles.btnTextInactive}>{en.collectReward}</Label>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default SpinWheelScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
    alignItems: 'center',
    paddingVertical: isIOS() ? wp(1) : hp(2),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(90),
  },
  iconButton: {
    backgroundColor: COLORS.yellow,
    padding: hp(1.5),
    borderRadius: hp(3),
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: hp(4),
    fontFamily: FONT.bold,
    letterSpacing: 1.5,
  },
  subtitleText: {
    color: COLORS.lightWhite,
    fontSize: hp(1.6),
    fontFamily: FONT.regular,
    marginTop: hp(0.5),
    letterSpacing: 0.5,
  },
  wheelWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(10),
  },
  indicatorContainer: {
    position: 'absolute',
    top: -hp(1.5),
    zIndex: 10,
  },
  indicatorTriangle: {
    width: 0,
    height: 0,
    backgroundColor: COLORS.transparent,
    borderStyle: 'solid',
    borderLeftWidth: wp(3.5),
    borderRightWidth: wp(3.5),
    borderBottomWidth: hp(2.5),
    borderLeftColor: COLORS.transparent,
    borderRightColor: COLORS.transparent,
    borderBottomColor: COLORS.creamWhite,
    transform: [{ rotate: '180deg' }],
  },
  outerGlow: {
    width: wp(82),
    height: wp(82),
    borderRadius: wp(41),
    backgroundColor: COLORS.wheelGlowBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: COLORS.whiteBorderFaint,
  },
  wheelContainer: {
    width: wp(76),
    height: wp(76),
    borderRadius: wp(38),
    overflow: 'hidden',
  },
  sliceContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(18),
  },
  sliceText: {
    color: COLORS.white,
    fontSize: hp(1.4),
    fontFamily: FONT.semiBold,
    marginTop: hp(0.8),
    textAlign: 'center',
  },
  centerHub: {
    position: 'absolute',
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    backgroundColor: COLORS.hubOrange,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.darkWhite,
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  spinButton: {
    backgroundColor: COLORS.spinBlue,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(80),
    paddingVertical: hp(2),
    borderRadius: hp(2),
    position: 'absolute',
    bottom: hp(6),
    borderWidth: 1,
    borderColor: COLORS.whiteBorderLight,
  },
  spinButtonText: {
    color: COLORS.white,
    fontSize: hp(2.2),
    fontFamily: FONT.semiBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.modalOverlayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surfaceElevated,
    width: wp(82),
    borderRadius: hp(3),
    padding: hp(3),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.whiteBorderFaint,
  },
  modalConfetti: {
    marginBottom: hp(1),
  },
  modalCongratulations: {
    color: COLORS.white,
    fontSize: hp(2.5),
    fontFamily: FONT.semiBold,
    letterSpacing: 0.5,
  },
  modalYouWon: {
    color: COLORS.silverGrey,
    fontSize: hp(1.6),
    fontFamily: FONT.regular,
    marginTop: hp(0.5),
    letterSpacing: 1,
  },
  modalRewardValue: {
    color: COLORS.yellow,
    fontSize: hp(2.8),
    fontFamily: FONT.semiBold,
    marginVertical: hp(0.5),
  },
  rarityBadge: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.4),
    borderRadius: hp(1.5),
    marginBottom: hp(3),
  },
  rarityText: {
    color: COLORS.yellow,
    fontSize: hp(1.3),
    fontFamily: FONT.semiBold,
  },
  spinAgainBtn: {
    backgroundColor: COLORS.accent,
    width: '100%',
    paddingVertical: hp(1.8),
    borderRadius: hp(1.5),
    alignItems: 'center',
    marginBottom: hp(1.2),
  },
  btnTextActive: {
    color: COLORS.white,
    fontSize: hp(1.8),
    fontFamily: FONT.semiBold,
  },
  collectBtn: {
    backgroundColor: COLORS.bgPurpleDark,
    width: '100%',
    paddingVertical: hp(1.8),
    borderRadius: hp(1.5),
    alignItems: 'center',
  },
  btnTextInactive: {
    color: COLORS.green,
    fontSize: hp(1.8),
    fontFamily: FONT.semiBold,
  },
});
