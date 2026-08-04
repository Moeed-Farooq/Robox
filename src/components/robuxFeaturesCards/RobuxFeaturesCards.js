import React from 'react';
import { Alert, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { ENGAGEMENT_THRESHOLDS } from '../../enums';
import { useNavigation } from '@react-navigation/native';
import { en } from '../../languages';

const UNLOCK_POINTS = ENGAGEMENT_THRESHOLDS.FEATURE_UNLOCK;

const RobuxFeaturesCards = ({ item, totalPoints = 0 }) => {
  const navigation = useNavigation();
  const isLocked =
    Boolean(item.requiresUnlock) && Number(totalPoints) < UNLOCK_POINTS;

  const handlePress = () => {
    if (isLocked) {
      Alert.alert(
        en.featureLocked,
        en.featureLockedMessage.replace('{points}', String(UNLOCK_POINTS)),
        [{ text: en.ok }],
      );
      return;
    }

    navigation.navigate(item.screen);
  };

  return (
    <TouchableOpacity
      style={[styles.card, isLocked && styles.cardLocked]}
      activeOpacity={0.5}
      onPress={handlePress}
    >
      <View style={styles.innerPanel}>
        <Image
          source={item.src}
          style={[styles.image, isLocked && styles.imageLocked]}
          resizeMode="cover"
        />
        <Label style={[styles.title, isLocked && styles.titleLocked]}>
          {item.title}
        </Label>

        {isLocked ? (
          <View style={styles.lockBadge}>
            <SvgIcon icon={SVG.locked} width={hp(2.2)} height={hp(2.2)} />
            <Label style={styles.lockText}>
              {en.unlockAt.replace('{points}', String(UNLOCK_POINTS))}
            </Label>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default RobuxFeaturesCards;

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: wp(5),
    minHeight: hp(19),
    backgroundColor: COLORS.surfaceElevated + HEX_OPACITY[60],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(2),
    borderWidth: 1,
    borderColor: COLORS.lightYellow + HEX_OPACITY[25],
  },
  cardLocked: {
    borderColor: COLORS.lightYellow + HEX_OPACITY[12],
    opacity: 0.85,
  },
  innerPanel: {
    width: '100%',
    minHeight: hp(16),
    borderRadius: wp(4),
    backgroundColor: COLORS.bgPurpleDark + HEX_OPACITY[35],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(2),
    overflow: 'hidden',
  },
  image: {
    width: hp(9),
    height: hp(9),
    borderRadius: hp(2.6),
    overflow: 'hidden',
  },
  imageLocked: {
    opacity: 0.45,
  },
  title: {
    color: COLORS.newwhite,
    fontSize: hp(1.9),
    fontFamily: FONT.bold,
    marginTop: hp(1.3),
    textAlign: 'center',
    textShadowColor: COLORS.accent + HEX_OPACITY[45],
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  titleLocked: {
    opacity: 0.7,
  },
  lockBadge: {
    marginTop: hp(0.8),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    backgroundColor: COLORS.splashBg + HEX_OPACITY[70],
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.35),
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: COLORS.lightYellow + HEX_OPACITY[20],
  },
  lockText: {
    color: COLORS.lightYellow,
    fontSize: hp(1.25),
    fontFamily: FONT.bold,
  },
});
