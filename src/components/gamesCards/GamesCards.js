import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { useNavigation } from '@react-navigation/native';

const LEVEL_STYLES = {
  Easy: {
    bg: COLORS.green + HEX_OPACITY[22],
    border: COLORS.green + HEX_OPACITY[45],
    text: COLORS.lightestGreen,
  },
  Medium: {
    bg: COLORS.yellow + HEX_OPACITY[18],
    border: COLORS.yellow + HEX_OPACITY[40],
    text: COLORS.lightYellow,
  },
  Hard: {
    bg: COLORS.red + HEX_OPACITY[20],
    border: COLORS.red + HEX_OPACITY[42],
    text: COLORS.lightRed,
  },
};

const GamesCards = ({ item }) => {
  const navigation = useNavigation();
  const levelStyle = LEVEL_STYLES[item.level] || LEVEL_STYLES.Easy;
  const detailText = String(item.detail || '').replace(/\n/g, ' ');
  const metaText = String(item.subDetail || '').replace(/\n/g, ' ');

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate(item.screen)}
      style={styles.cardShadow}
    >
      <LinearGradient
        colors={[COLORS.surfaceElevated, COLORS.bgPurpleDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={[styles.accentBar, { backgroundColor: item.bgcolor }]} />

        <View style={styles.body}>
          <View
            style={[
              styles.iconWrap,
              {
                backgroundColor: item.bgcolor + HEX_OPACITY[28],
                borderColor: item.bgcolor + HEX_OPACITY[55],
              },
            ]}
          >
            <View
              style={[
                styles.iconInner,
                { backgroundColor: item.bgcolor + HEX_OPACITY[70] },
              ]}
            >
              <SvgIcon icon={item.icon} width={hp(2.8)} height={hp(2.8)} />
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Label style={styles.title} numberOfLines={1}>
                {item.name}
              </Label>
              <View
                style={[
                  styles.levelBadge,
                  {
                    backgroundColor: levelStyle.bg,
                    borderColor: levelStyle.border,
                  },
                ]}
              >
                <Label style={[styles.levelText, { color: levelStyle.text }]}>
                  {item.level}
                </Label>
              </View>
            </View>

            <Label style={styles.detail} numberOfLines={2}>
              {detailText}
            </Label>

            <View style={styles.footerRow}>
              <Label style={styles.meta} numberOfLines={1}>
                {metaText}
              </Label>

              <View style={styles.playChip}>
                <SvgIcon icon={SVG.play} width={hp(1.4)} height={hp(1.4)} />
                <Label style={styles.playText}>Play</Label>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GamesCards;

const styles = StyleSheet.create({
  cardShadow: {
    marginBottom: hp(1.4),
    borderRadius: hp(2),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  card: {
    borderRadius: hp(2),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.lightYellow + HEX_OPACITY[18],
    flexDirection: 'row',
    minHeight: hp(12),
  },
  accentBar: {
    width: wp(1.2),
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(3.5),
    gap: wp(3),
  },
  iconWrap: {
    width: hp(7.2),
    height: hp(7.2),
    borderRadius: hp(2),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInner: {
    width: hp(5.4),
    height: hp(5.4),
    borderRadius: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: wp(2),
  },
  title: {
    flex: 1,
    color: COLORS.newwhite,
    fontSize: hp(1.85),
    fontFamily: FONT.bold,
  },
  levelBadge: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.3),
    borderRadius: hp(1),
    borderWidth: 1,
  },
  levelText: {
    fontSize: hp(1.15),
    fontFamily: FONT.semiBold,
    letterSpacing: 0.2,
  },
  detail: {
    color: COLORS.mutedText,
    fontSize: hp(1.35),
    fontFamily: FONT.regular,
    marginTop: hp(0.45),
    lineHeight: hp(1.9),
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(1),
    gap: wp(2),
  },
  meta: {
    flex: 1,
    color: COLORS.lightestWhite,
    fontSize: hp(1.2),
    fontFamily: FONT.medium,
    opacity: 0.85,
  },
  playChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.2),
    backgroundColor: COLORS.accent,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.55),
    borderRadius: hp(2),
    borderWidth: 1,
    borderColor: COLORS.lightYellow + HEX_OPACITY[50],
  },
  playText: {
    color: COLORS.black,
    fontSize: hp(1.25),
    fontFamily: FONT.semiBold,
  },
});
