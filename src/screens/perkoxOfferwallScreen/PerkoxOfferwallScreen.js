import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SVG } from '../../assets';
import { IMAGES } from '../../assets/images';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import useTotalPoints from '../../hooks/useTotalPoints';
import {
  initPerkoxSdk,
  onPerkoxRewardCredited,
  showPerkoxOfferwall,
} from '../../services/perkox/perkoxSdk';

const PerkoxOfferwallScreen = () => {
  const navigation = useNavigation();
  const { totalPoints } = useTotalPoints();
  const [opening, setOpening] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const bootstrap = async () => {
        setError('');

        try {
          await initPerkoxSdk();
          if (isActive) {
            setReady(true);
          }
        } catch (err) {
          if (isActive) {
            setReady(false);
            setError(err?.message || 'Unable to initialize Perkox SDK.');
          }
        }
      };

      bootstrap();

      const unsubscribeReward = onPerkoxRewardCredited((reward, result) => {
        if (!result?.granted) {
          return;
        }

        Alert.alert(
          'Reward Earned',
          `${result.granted} points were added to your balance.`,
        );
      });

      return () => {
        isActive = false;
        unsubscribeReward();
      };
    }, []),
  );

  const handleOpenOfferwall = useCallback(async () => {
    if (opening) {
      return;
    }

    setOpening(true);
    setError('');

    try {
      const success = await showPerkoxOfferwall();

      if (!success) {
        setError('Failed to launch Perkox Offerwall.');
        Alert.alert('Error', 'Failed to launch Perkox Offerwall.');
      }
    } catch (err) {
      const message = err?.message || 'Failed to launch Perkox Offerwall.';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setOpening(false);
    }
  }, [opening]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <SvgIcon icon={SVG.goBack} height={hp(2.8)} width={hp(2.8)} />
          </TouchableOpacity>
          <View style={styles.titleWrap}>
            <Label style={styles.title}>Perkox Offerwall Rewards</Label>
            <Label style={styles.subtitle}>Earn coins by completing offers</Label>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <Image
            source={IMAGES.PERKOX_LOGO}
            style={styles.logo}
            resizeMode="contain"
          />
          <Label style={styles.heroTitle}>Complete offers. Earn points.</Label>
          <Label style={styles.heroMessage}>
            Open the Perkox offerwall, finish available tasks, and rewards are
            added to your app balance automatically.
          </Label>

          <View style={styles.pointsCard}>
            <Label style={styles.pointsLabel}>App total points</Label>
            <Label style={styles.pointsValue}>
              {Number(totalPoints).toLocaleString()}
            </Label>
          </View>

          {!!error && <Label style={styles.errorText}>{error}</Label>}

          <TouchableOpacity
            style={[
              styles.ctaButton,
              (opening || !ready) && styles.ctaButtonDisabled,
            ]}
            disabled={opening || !ready}
            onPress={handleOpenOfferwall}
            activeOpacity={0.85}
          >
            {opening ? (
              <ActivityIndicator color={COLORS.black} />
            ) : (
              <Label style={styles.ctaText}>
                {ready ? 'Open Perkox Offerwall' : 'Preparing…'}
              </Label>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PerkoxOfferwallScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1),
    marginBottom: hp(1.5),
  },
  backButton: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(2.5),
    backgroundColor: COLORS.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    marginHorizontal: wp(3),
  },
  title: {
    color: COLORS.lightYellow,
    fontSize: hp(2.4),
    fontFamily: FONT.bold,
  },
  subtitle: {
    color: COLORS.lightestWhite,
    fontSize: hp(1.35),
    fontFamily: FONT.regular,
    marginTop: hp(0.2),
  },
  headerSpacer: {
    width: hp(5),
  },
  heroCard: {
    marginTop: hp(2),
    backgroundColor: COLORS.surfaceElevated + HEX_OPACITY[70],
    borderRadius: hp(2),
    borderWidth: 1,
    borderColor: COLORS.blue,
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
    alignItems: 'center',
  },
  logo: {
    width: hp(9),
    height: hp(9),
    marginBottom: hp(1.5),
  },
  heroTitle: {
    color: COLORS.newwhite,
    fontSize: hp(2.1),
    fontFamily: FONT.bold,
    textAlign: 'center',
  },
  heroMessage: {
    color: COLORS.lightestWhite,
    fontSize: hp(1.45),
    fontFamily: FONT.regular,
    textAlign: 'center',
    marginTop: hp(1),
    lineHeight: hp(2.1),
  },
  pointsCard: {
    width: '100%',
    marginTop: hp(2.5),
    marginBottom: hp(1),
    borderRadius: hp(1.4),
    borderWidth: 1,
    borderColor: COLORS.lightYellow + HEX_OPACITY[24],
    backgroundColor: COLORS.bgPurpleDark + HEX_OPACITY[40],
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(4),
    alignItems: 'center',
  },
  pointsLabel: {
    color: COLORS.lightestWhite,
    fontSize: hp(1.3),
    fontFamily: FONT.regular,
  },
  pointsValue: {
    color: COLORS.accent,
    fontSize: hp(2.4),
    fontFamily: FONT.bold,
    marginTop: hp(0.4),
  },
  errorText: {
    color: COLORS.yellow,
    fontSize: hp(1.35),
    fontFamily: FONT.regular,
    textAlign: 'center',
    marginBottom: hp(1.2),
  },
  ctaButton: {
    width: '100%',
    marginTop: hp(1.5),
    backgroundColor: COLORS.accent,
    borderRadius: hp(1.4),
    paddingVertical: hp(1.6),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp(5.5),
  },
  ctaButtonDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    color: COLORS.black,
    fontSize: hp(1.7),
    fontFamily: FONT.semiBold,
  },
});
