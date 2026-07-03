import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';

import { SafeAreaView } from 'react-native-safe-area-context';
import { SVG } from '../../assets';
import { TERMS_DATA } from '../../dummies';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { isIOS } from '../../helpers';
import { en } from '../../languages';

const TermsAndConditionsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: COLORS.splashBg }, styles.mainContainer]}>  
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <SvgIcon icon={SVG.goBack} height={hp(3.5)} width={hp(3.5)} />
        </TouchableOpacity>

        <Label style={styles.titleText}>{en.termsAndConditions}</Label>

        <View style={styles.placeholder} />
      </View>

      <Label style={styles.introText}>{en.termsAndConditionsTitle}</Label>

      <View style={styles.divider} />

      {TERMS_DATA.map(section => (
        <View key={section.id} style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.numberBadge}>
              <Label style={styles.badgeText}>{section.number}</Label>
            </View>
            {section.title ? (
              <Label style={styles.sectionTitle}>{section.title}</Label>
            ) : null}
          </View>

          <Label style={styles.descriptionText}>{section.description}</Label>

          {section.points?.map((point, index) => (
            <View key={`${section.id}-${index}`} style={styles.bulletRow}>
              <Label style={styles.bulletDot}>•</Label>

              <Label style={styles.bulletText}>{point}</Label>
            </View>
          ))}

          {!!section.footerText && (
            <Label style={styles.footerText}>{section.footerText}</Label>
          )}
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
  mainContainer: {
  paddingVertical: isIOS() ? wp(1) : hp(2),
  },

  scrollContainer: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(5),
    flexGrow: 1,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },

  closeButton: {
    backgroundColor: COLORS.lightYellow,
    width: hp(5),
    height: hp(5),
    borderRadius: hp(2.5),
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholder: {
    width: hp(5),
  },

  titleText: {
    color: COLORS.white,
    fontSize: hp(2.3),
    fontFamily: FONT.bold,
  },

  introText: {
    color: COLORS.white,
    fontSize: hp(1.7),
    lineHeight: hp(2.8),
    fontFamily: FONT.regular,
    backgroundColor: COLORS.black + HEX_OPACITY[32],
    padding: wp(3),
    borderRadius: wp(1.4),
  },

  divider: {
    height: wp(0.1),
    backgroundColor: COLORS.white + HEX_OPACITY[67],
    marginVertical: hp(3),
  },

  sectionContainer: {
    marginBottom: hp(4),
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },

  numberBadge: {
    backgroundColor: COLORS.lightYellow,
    width: hp(3.5),
    height: hp(3.5),
    borderRadius: hp(1.75),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },

  badgeText: {
    color: COLORS.black,
    fontSize: hp(1.8),
    fontFamily: FONT.semiBold,
  },

  sectionTitle: {
    flex: 1,
    color: COLORS.white,
    fontSize: hp(2.4),
    fontFamily: FONT.bold,
  },

  descriptionText: {
    color: COLORS.darkWhite,
    fontSize: hp(1.9),
    lineHeight: hp(2.8),
    marginBottom: hp(1.5),
    fontFamily: FONT.medium,
  },

  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(1.2),
    paddingLeft: wp(2),
  },

  bulletDot: {
    color: COLORS.white,
    fontSize: hp(2.2),
    marginRight: wp(2.5),
    lineHeight: hp(2.4),
  },

  bulletText: {
    flex: 1,
    color: COLORS.white,
    fontSize: hp(1.8),
    lineHeight: hp(2.6),
    fontFamily: FONT.regular,
  },

  footerText: {
    marginTop: hp(1.5),
    color: COLORS.white,
    fontSize: hp(1.7),
    lineHeight: hp(2.8),
    fontFamily: FONT.regular,
    backgroundColor: COLORS.black + HEX_OPACITY[32],
    padding: wp(3),
    borderRadius: wp(1.4),
  },
});
