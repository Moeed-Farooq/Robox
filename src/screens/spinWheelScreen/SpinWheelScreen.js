import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { SVG } from '../../assets';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { pickWeightedSpinReward, SPIN_REWARDS } from '../../dummies';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { en } from '../../languages';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isIOS } from '../../helpers';
import useTotalPoints from '../../hooks/useTotalPoints';
import {
  AppBannerAd,
  getRewardedAdUserMessage,
  preloadRewardedAd,
  showRewardedAdForAction,
} from '../../services/ads';
import {
  formatCooldownRemaining,
  getSpinCooldownStatus,
  markSpinCompleted,
} from '../../services/spin/SpinCooldownService';

const SPIN_DISCLOSURE =
  'Watch this ad to get 1 chance to spin the wheel and win a random reward.';

const SpinWheelScreen = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerModalVisible, setWinnerModalVisible] = useState(false);
  const [rewardsModalVisible, setRewardsModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isAdFlowInProgress, setIsAdFlowInProgress] = useState(false);
  const [cooldownRemainingMs, setCooldownRemainingMs] = useState(0);
  const [cooldownReady, setCooldownReady] = useState(true);
  const navigation = useNavigation();
  const { addPoints } = useTotalPoints();
  const spinRewardGrantingRef = useRef(false);
  const spinStartLockRef = useRef(false);
  const rewardedShowInFlightRef = useRef(false);

  const totalSegments = SPIN_REWARDS.length;
  const degreesPerSegment = 360 / totalSegments;
  const wheelSize = wp(76);
  const radius = wheelSize / 2;
  const isOnCooldown = !cooldownReady;
  const canStartSpin =
    !isSpinning && !isAdFlowInProgress && !isOnCooldown && !spinStartLockRef.current;

  const refreshCooldown = useCallback(async () => {
    const status = await getSpinCooldownStatus();
    setCooldownReady(status.isAvailable);
    setCooldownRemainingMs(status.remainingMs);
  }, []);

  useEffect(() => {
    preloadRewardedAd();
    refreshCooldown();
  }, [refreshCooldown]);

  useEffect(() => {
    if (cooldownReady) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      refreshCooldown();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [cooldownReady, refreshCooldown]);

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

  const animateWheelToReward = targetReward =>
    new Promise(resolve => {
      const rewardIndex = Math.max(
        0,
        SPIN_REWARDS.findIndex(item => item.id === targetReward.id),
      );
      const targetAngle =
        360 - rewardIndex * degreesPerSegment - degreesPerSegment / 2 - 90;
      const finalValue = 1440 + targetAngle;

      setIsSpinning(true);
      spinValue.setValue(0);

      Animated.timing(spinValue, {
        toValue: finalValue,
        duration: 4000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        setIsSpinning(false);
        resolve();
      });
    });

  const runSpinAfterAd = async () => {
    if (spinStartLockRef.current || rewardedShowInFlightRef.current) {
      return;
    }

    const cooldownStatus = await getSpinCooldownStatus();
    if (!cooldownStatus.isAvailable) {
      setCooldownReady(false);
      setCooldownRemainingMs(cooldownStatus.remainingMs);
      Alert.alert(
        'Spin Unavailable',
        `You can spin again in ${formatCooldownRemaining(
          cooldownStatus.remainingMs,
        )}.`,
      );
      return;
    }

    spinStartLockRef.current = true;
    setIsAdFlowInProgress(true);
    rewardedShowInFlightRef.current = true;
    spinRewardGrantingRef.current = false;

    const targetReward = pickWeightedSpinReward();

    try {
      const result = await showRewardedAdForAction(async () => {
        if (spinRewardGrantingRef.current) {
          return;
        }

        spinRewardGrantingRef.current = true;
        await animateWheelToReward(targetReward);
        await addPoints(targetReward?.reward || 0);
        await markSpinCompleted();
        setSelectedReward(targetReward);
      });

      if (result?.completed) {
        await refreshCooldown();
        setWinnerModalVisible(true);
      } else if (result?.reason === 'action_failed') {
        setSelectedReward(null);
        Alert.alert('Reward Error', getRewardedAdUserMessage(result?.reason));
      } else {
        setSelectedReward(null);
        Alert.alert(
          result?.reason === 'ad_not_ready' || result?.reason === 'show_failed'
            ? 'Ad Unavailable'
            : 'Reward Not Granted',
          getRewardedAdUserMessage(result?.reason),
        );
      }
    } finally {
      rewardedShowInFlightRef.current = false;
      spinStartLockRef.current = false;
      setIsAdFlowInProgress(false);
      setIsSpinning(false);
    }
  };

  const handleSpinPress = () => {
    if (!canStartSpin) {
      if (isOnCooldown) {
        Alert.alert(
          'Spin Unavailable',
          `You can spin again in ${formatCooldownRemaining(cooldownRemainingMs)}.`,
        );
      }
      return;
    }

    Alert.alert('Random Reward Spin', SPIN_DISCLOSURE, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Watch Ad',
        onPress: () => {
          runSpinAfterAd();
        },
      },
    ]);
  };

  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: COLORS.splashBg }, styles.mainContainer]}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.iconButton}>
            <SvgIcon
              icon={SVG.goBack}
              height={hp(2.5)}
              width={hp(2.5)}
              onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setRewardsModalVisible(true)}
          >
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
          <Label style={styles.subtitleText}>{en.spinWheelSubtitle}</Label>
          <Label style={styles.disclosureText}>{SPIN_DISCLOSURE}</Label>
        </View>

        <TouchableOpacity
          style={styles.viewRewardsButton}
          activeOpacity={0.85}
          onPress={() => setRewardsModalVisible(true)}
        >
          <Label style={styles.viewRewardsText}>{en.viewPossibleRewards}</Label>
        </TouchableOpacity>

        {isOnCooldown ? (
          <Label style={styles.cooldownText}>
            Next spin in {formatCooldownRemaining(cooldownRemainingMs)}
          </Label>
        ) : null}

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
          onPress={handleSpinPress}
          disabled={!canStartSpin}
          style={[styles.spinButton, !canStartSpin && { opacity: 0.6 }]}
        >
          <SvgIcon
            icon={SVG.spin}
            height={hp(3)}
            width={hp(3)}
            style={{ marginRight: wp(2) }}
          />
          <Label style={styles.spinButtonText}>
            {isOnCooldown ? en.spinLocked : en.watchAdToSpin}
          </Label>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={rewardsModalVisible}
        onRequestClose={() => setRewardsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.rewardsModalContent}>
            <Label style={styles.rewardsModalTitle}>{en.viewPossibleRewards}</Label>
            <Label style={styles.rewardsModalSubtitle}>
              All outcomes award in-app points. Chance of receiving a reward is
              100%.
            </Label>
            <ScrollView style={styles.rewardsList} showsVerticalScrollIndicator={false}>
              {SPIN_REWARDS.map(item => (
                <View key={item.id} style={styles.rewardRow}>
                  <View style={[styles.rewardColorDot, { backgroundColor: item.color }]} />
                  <View style={styles.rewardInfo}>
                    <Label style={styles.rewardTitle}>
                      {item.reward} in-app points
                    </Label>
                    <Label style={styles.rewardMeta}>
                      {item.rarity} · {item.probability}% chance
                    </Label>
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.collectBtn}
              onPress={() => setRewardsModalVisible(false)}
            >
              <Label style={styles.btnTextInactive}>{en.close}</Label>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
                ★ {selectedReward?.reward.toLocaleString()} {en.points}
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
                style={styles.collectBtn}
                onPress={() => setWinnerModalVisible(false)}
              >
                <Label style={styles.btnTextInactive}>{en.collectReward}</Label>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <View style={styles.bannerContainer}>
        <AppBannerAd />
      </View>
    </SafeAreaView>
  );
};

export default SpinWheelScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
  },
  content: {
    flex: 1,
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
    paddingHorizontal: wp(5),
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
  disclosureText: {
    color: COLORS.lightYellow,
    fontSize: hp(1.45),
    fontFamily: FONT.medium,
    textAlign: 'center',
    marginTop: hp(1),
    lineHeight: hp(2.1),
  },
  viewRewardsButton: {
    marginTop: hp(1.2),
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.9),
    borderRadius: hp(1.2),
    borderWidth: 1,
    borderColor: COLORS.lightYellow + HEX_OPACITY[40],
    backgroundColor: COLORS.surfaceElevated + HEX_OPACITY[50],
  },
  viewRewardsText: {
    color: COLORS.lightYellow,
    fontSize: hp(1.45),
    fontFamily: FONT.semiBold,
  },
  cooldownText: {
    color: COLORS.contrastCoral,
    fontSize: hp(1.4),
    fontFamily: FONT.medium,
    marginTop: hp(0.8),
  },
  wheelWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(3),
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
    marginTop: 'auto',
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: COLORS.whiteBorderLight,
  },
  spinButtonText: {
    color: COLORS.white,
    fontSize: hp(2),
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
  rewardsModalContent: {
    backgroundColor: COLORS.surfaceElevated,
    width: wp(88),
    maxHeight: hp(72),
    borderRadius: hp(2.5),
    padding: hp(2.5),
    borderWidth: 1,
    borderColor: COLORS.whiteBorderFaint,
  },
  rewardsModalTitle: {
    color: COLORS.lightYellow,
    fontSize: hp(2.2),
    fontFamily: FONT.bold,
    textAlign: 'center',
  },
  rewardsModalSubtitle: {
    color: COLORS.lightestWhite,
    fontSize: hp(1.4),
    fontFamily: FONT.regular,
    textAlign: 'center',
    marginTop: hp(1),
    marginBottom: hp(1.5),
    lineHeight: hp(2),
  },
  rewardsList: {
    maxHeight: hp(42),
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.1),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.whiteBorderFaint,
  },
  rewardColorDot: {
    width: hp(1.6),
    height: hp(1.6),
    borderRadius: hp(0.8),
    marginRight: wp(3),
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    color: COLORS.newwhite,
    fontSize: hp(1.6),
    fontFamily: FONT.semiBold,
  },
  rewardMeta: {
    color: COLORS.lightestWhite,
    fontSize: hp(1.3),
    fontFamily: FONT.regular,
    marginTop: hp(0.2),
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
    marginTop: hp(1),
  },
  rarityText: {
    color: COLORS.yellow,
    fontSize: hp(1.3),
    fontFamily: FONT.semiBold,
  },
  collectBtn: {
    backgroundColor: COLORS.bgPurpleDark,
    width: '100%',
    paddingVertical: hp(1.8),
    borderRadius: hp(1.5),
    alignItems: 'center',
    marginTop: hp(1),
  },
  btnTextInactive: {
    color: COLORS.green,
    fontSize: hp(1.8),
    fontFamily: FONT.semiBold,
  },
  bannerContainer: {
    paddingBottom: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
