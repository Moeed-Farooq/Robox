import { SectionList, StyleSheet, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, wp, hp, FONT, HEX_OPACITY } from '../../enums/StyleGuide';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { en } from '../../languages';
import { GAMES_DATA } from '../../dummies';
import { GamesCards } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOTAL_GAMES = GAMES_DATA.reduce(
  (count, section) => count + section.data.length,
  0,
);

const CATEGORY_THEMES = {
  'Easy Games': {
    label: 'Easy',
    accent: COLORS.green,
    badgeBg: COLORS.green + HEX_OPACITY[22],
    badgeBorder: COLORS.green + HEX_OPACITY[45],
    badgeText: COLORS.lightestGreen,
  },
  'Medium Games': {
    label: 'Medium',
    accent: COLORS.yellow,
    badgeBg: COLORS.yellow + HEX_OPACITY[18],
    badgeBorder: COLORS.yellow + HEX_OPACITY[40],
    badgeText: COLORS.lightYellow,
  },
  'Hard Games': {
    label: 'Hard',
    accent: COLORS.red,
    badgeBg: COLORS.red + HEX_OPACITY[20],
    badgeBorder: COLORS.red + HEX_OPACITY[42],
    badgeText: COLORS.lightRed,
  },
};

const GamesScreen = () => {
  const renderItem = ({ item }) => <GamesCards item={item} />;

  const renderSectionHeader = ({ section }) => {
    const theme =
      CATEGORY_THEMES[section.title] || CATEGORY_THEMES['Easy Games'];

    return (
      <View
        style={[
          styles.sectionShadow,
          {
            shadowColor: theme.accent,
          },
        ]}
      >
        <LinearGradient
          colors={[
            theme.accent + HEX_OPACITY[28],
            COLORS.surfaceElevated,
            COLORS.bgPurpleDark,
          ]}
          locations={[0, 0.45, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.sectionHeader,
            { borderColor: theme.accent + HEX_OPACITY[55] },
          ]}
        >
          <View style={styles.sectionBody}>
            <View style={styles.sectionTopRow}>
              <View
                style={[
                  styles.sectionIconWrap,
                  {
                    backgroundColor: theme.accent + HEX_OPACITY[40],
                    borderColor: theme.accent + HEX_OPACITY[85],
                  },
                ]}
              >
                <View
                  style={[
                    styles.sectionIconInner,
                    { backgroundColor: theme.accent },
                  ]}
                >
                  <SvgIcon
                    icon={section.icon}
                    width={hp(3.2)}
                    height={hp(3.2)}
                  />
                </View>
              </View>

              <View
                style={[
                  styles.difficultyBadge,
                  {
                    backgroundColor: theme.accent + HEX_OPACITY[30],
                    borderColor: theme.accent + HEX_OPACITY[80],
                  },
                ]}
              >
                <Label
                  style={[styles.difficultyBadgeText, { color: theme.badgeText }]}
                >
                  {theme.label}
                </Label>
              </View>
            </View>

            <Label style={styles.sectionTitle}>{section.title}</Label>
            <Label style={styles.sectionSubtitle}>{section.detail}</Label>

            <View style={styles.sectionMetaRow}>
              <View
                style={[
                  styles.sectionMetaChip,
                  {
                    backgroundColor: theme.accent + HEX_OPACITY[28],
                    borderColor: theme.accent + HEX_OPACITY[70],
                  },
                ]}
              >
                <Label
                  style={[
                    styles.sectionMetaChipText,
                    { color: theme.badgeText },
                  ]}
                >
                  {section.data.length} games
                </Label>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.heroShadow}>
      <LinearGradient
        colors={[COLORS.surfaceElevated, COLORS.bgPurpleDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroBody}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroIconWrap}>
              <View style={styles.heroIconInner}>
                <SvgIcon
                  icon={SVG.gameControllerColorful}
                  width={hp(2.8)}
                  height={hp(2.8)}
                />
              </View>
            </View>

            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Label style={styles.liveBadgeText}>Live now</Label>
            </View>
          </View>

          <Label style={styles.titleText}>{en.games}</Label>
          <Label style={styles.heroSubtitle}>
            Discover your next favorite challenge
          </Label>

          <View style={styles.heroMetaRow}>
            <View style={styles.metaChip}>
              <Label style={styles.metaChipText}>{TOTAL_GAMES} games</Label>
            </View>
            <View style={[styles.metaChip, styles.metaChipAccent]}>
              <Label style={[styles.metaChipText, styles.metaChipAccentText]}>
                Easy · Medium · Hard
              </Label>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.splashBg }}>
      <SectionList
        sections={GAMES_DATA}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderHeader}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

export default GamesScreen;

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(18),
  },

  heroShadow: {
    marginBottom: hp(1.8),
    borderRadius: hp(2),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  heroCard: {
    borderRadius: hp(2),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.lightYellow + HEX_OPACITY[18],
    minHeight: hp(16),
  },
  heroBody: {
    flex: 1,
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4),
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(1.2),
  },
  heroIconWrap: {
    width: hp(7.2),
    height: hp(7.2),
    borderRadius: hp(2),
    borderWidth: 1,
    backgroundColor: COLORS.accent + HEX_OPACITY[28],
    borderColor: COLORS.accent + HEX_OPACITY[55],
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIconInner: {
    width: hp(5.4),
    height: hp(5.4),
    borderRadius: hp(1.5),
    backgroundColor: COLORS.accent + HEX_OPACITY[70],
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
    backgroundColor: COLORS.green + HEX_OPACITY[22],
    borderWidth: 1,
    borderColor: COLORS.green + HEX_OPACITY[45],
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.55),
    borderRadius: hp(2),
  },
  liveDot: {
    width: hp(0.9),
    height: hp(0.9),
    borderRadius: hp(0.45),
    backgroundColor: COLORS.lightestGreen,
  },
  liveBadgeText: {
    color: COLORS.lightestGreen,
    fontSize: hp(1.25),
    fontFamily: FONT.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  titleText: {
    color: COLORS.newwhite,
    fontSize: hp(2.8),
    fontFamily: FONT.extraBold,
  },
  heroSubtitle: {
    color: COLORS.mutedText,
    fontSize: hp(1.45),
    fontFamily: FONT.regular,
    marginTop: hp(0.4),
    lineHeight: hp(2),
  },
  heroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
    marginTop: hp(1.3),
  },
  metaChip: {
    backgroundColor: COLORS.white + HEX_OPACITY[9],
    borderWidth: 1,
    borderColor: COLORS.lightYellow + HEX_OPACITY[18],
    paddingHorizontal: wp(2.8),
    paddingVertical: hp(0.45),
    borderRadius: hp(1.2),
  },
  metaChipAccent: {
    backgroundColor: COLORS.accent + HEX_OPACITY[18],
    borderColor: COLORS.accent + HEX_OPACITY[40],
  },
  metaChipText: {
    color: COLORS.lightestWhite,
    fontSize: hp(1.2),
    fontFamily: FONT.medium,
  },
  metaChipAccentText: {
    color: COLORS.lightYellow,
  },

  sectionShadow: {
    marginTop: hp(2),
    marginBottom: hp(1.4),
    borderRadius: hp(2.4),
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  sectionHeader: {
    borderRadius: hp(2.4),
    overflow: 'hidden',
    borderWidth: 1.5,
  },
  sectionBody: {
    paddingVertical: hp(2.2),
    paddingHorizontal: wp(4.5),
  },
  sectionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(1.4),
  },
  sectionIconWrap: {
    width: hp(8),
    height: hp(8),
    borderRadius: hp(2.2),
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionIconInner: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(1.6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    borderRadius: hp(2.2),
    borderWidth: 1.5,
  },
  difficultyBadgeText: {
    fontSize: hp(1.45),
    fontFamily: FONT.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionTitle: {
    color: COLORS.newwhite,
    fontSize: hp(2.6),
    fontFamily: FONT.extraBold,
    textShadowColor: COLORS.black + HEX_OPACITY[40],
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  sectionSubtitle: {
    color: COLORS.lightWhite,
    fontSize: hp(1.5),
    marginTop: hp(0.5),
    fontFamily: FONT.medium,
    lineHeight: hp(2.1),
    opacity: 0.92,
  },
  sectionMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
    marginTop: hp(1.4),
  },
  sectionMetaChip: {
    borderWidth: 1.5,
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.65),
    borderRadius: hp(1.4),
  },
  sectionMetaChipText: {
    fontSize: hp(1.35),
    fontFamily: FONT.semiBold,
  },
});
