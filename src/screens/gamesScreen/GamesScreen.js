import { SectionList, StyleSheet, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, wp, hp, FONT, HEX_OPACITY } from '../../enums/StyleGuide';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { en } from '../../languages';
import { GAMES_DATA } from '../../dummies';
import { GamesCards } from '../../components';

const GamesScreen = () => {
  const renderItem = ({ item }) => <GamesCards item={item} />;

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.headerLeft}>
        <View
          style={[
            styles.headerIconContainer,
            { backgroundColor: section.bgcolor },
          ]}
        >
          <SvgIcon icon={section.icon} width={hp(2.2)} height={hp(2.2)} />
        </View>

        <View style={styles.headerCopy}>
          <Label style={styles.sectionTitle}>{section.title}</Label>
          <Label style={styles.sectionSubtitle}>{section.detail}</Label>
        </View>
      </View>

      <View
        style={[styles.sectionIndicator, { backgroundColor: section.bgcolor }]}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.heroCard}>
      <Label style={styles.eyebrow}>Live now</Label>
      <Label style={styles.titleText}>{en.games}</Label>
      <Label style={styles.heroSubtitle}>
        Discover your next favorite challenge
      </Label>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
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
    </View>
  );
};

export default GamesScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
  },

  listContent: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(18),
  },

  heroCard: {
    borderRadius: wp(6),
    padding: wp(5),
    marginBottom: hp(2),
    backgroundColor:COLORS.surfaceElevated+ HEX_OPACITY[42]
  },

  eyebrow: {
    color: COLORS.lightYellow,
    fontSize: hp(1.35),
    fontFamily: FONT.medium,
    textTransform: 'uppercase',
    letterSpacing: wp(0.8),
    marginBottom: hp(0.4),
  },

  titleText: {
    color: COLORS.white,
    fontSize: hp(3),
    fontFamily: FONT.bold,
  },

  heroSubtitle: {
    color: COLORS.mutedText,
    fontSize: hp(1.5),
    fontFamily: FONT.regular,
    marginTop: hp(0.5),
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(2.2),
    marginBottom: hp(1.3),
    marginHorizontal: wp(1),
    backgroundColor:COLORS.surfaceElevated+ HEX_OPACITY[62],
  paddingVertical:hp(2),
//   marginHorizontal:hp(2),
 paddingHorizontal:hp(2),
 borderRadius:hp(1)
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  headerCopy: {
    flex: 1,
  },

  headerIconContainer: {
    width: hp(4.5),
    height: hp(4.5),
    borderRadius: hp(1.2),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: hp(2),
    fontFamily: FONT.semiBold,
  },

  sectionSubtitle: {
    color: COLORS.mutedText,
    fontSize: hp(1.25),
    marginTop: hp(0.2),
    fontFamily: FONT.regular,
  },

  sectionIndicator: {
    width: wp(0.8),
    height: hp(2.3),
    borderRadius: hp(1),
  },
});
