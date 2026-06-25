import React, { useState } from 'react';
import { StyleSheet, View, SectionList } from 'react-native';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { en } from '../../languages';
import { SETTINGS_SECTIONS } from '../../dummies';
import { SettingsItem } from '../../components';
import Button from '../../common/Button';

const DailyRobuxQuiz = () => {
  return (
    <View style={styles.mainContainer}>
        <Label>Daily Robux Quiz</Label>
    </View>
  );
};

export default DailyRobuxQuiz;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
    paddingHorizontal: wp(6),
    paddingVertical: wp(10),
  },

  HeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: COLORS.lightYellow,
    paddingHorizontal: wp(2),
    paddingVertical: wp(2),
    borderRadius: hp(4),
  },

  dailyRobuxText: {
    color: COLORS.lightYellow,
    fontSize: hp(2.8),
    fontFamily: FONT.semiBold,
    textAlign: 'center',
  },

  eliteChallengeText: {
    color: COLORS.lightWhite,
    fontSize: hp(1.6),
    fontFamily: FONT.semiBold,
    textAlign: 'center',
  },
  dailyNewRobuxText: {
    color: COLORS.lightWhite,
    fontSize: hp(3.2),
    fontFamily: FONT.semiBold,
    textAlign: 'center',
    marginTop: hp(3),
  },
  testYourKnowledgeText: {
    color: COLORS.lightWhite + HEX_OPACITY[73],
    fontSize: hp(1.4),
    fontFamily: FONT.medium,
    textAlign: 'center',
  },
  startBtnText: {
    color: COLORS.white,
    fontFamily: FONT.semiBold,
    textAlign: 'center',
  },
  startBtn: {
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp(1.3),
    borderRadius: hp(2),
    marginTop: hp(4),
  },
  playBtnText: {
    color: COLORS.black,
    fontFamily: FONT.semiBold,
    textAlign: 'center',
  },
  playBtn: {
    backgroundColor: COLORS.lightYellow,
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp(1.3),
    borderRadius: hp(2),
    marginTop: hp(1),
  },
  controller: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp(1.3),
    borderRadius: hp(2),
  },
  mindIconContainer: {
    backgroundColor: COLORS.lightYellow,
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp(4),

    borderTopLeftRadius: hp(3),
    borderTopRightRadius: hp(3),
    borderBottomLeftRadius: hp(3),

    alignSelf: 'center',
    marginTop: hp(8),

    // iOS Glow
    shadowColor: COLORS.lightYellow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 20,
  },
  insideMindContainer: {
    backgroundColor: COLORS.black + HEX_OPACITY[73],
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp(2),
    borderTopLeftRadius: hp(3),
    borderBottomLeftRadius: hp(3),
    borderTopRightRadius: hp(3),
    alignSelf: 'center',
  },
});
