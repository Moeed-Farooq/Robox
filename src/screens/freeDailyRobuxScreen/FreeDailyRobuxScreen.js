import React, { useState } from 'react';
import { StyleSheet, View, SectionList, TouchableOpacity } from 'react-native';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { en } from '../../languages';
import { SETTINGS_SECTIONS } from '../../dummies';
import { SettingsItem } from '../../components';
import Button from '../../common/Button';
import { useNavigation } from '@react-navigation/native';
import { SCREEN } from '../../enums';

const FreeDailyRobuxScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.HeaderRow}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.goBack()}
        >
          <SvgIcon icon={SVG.goBack} height={hp(4)} width={hp(4)} />
        </TouchableOpacity>
        <View>
          <Label style={styles.dailyRobuxText}>{en.dailyRobux}</Label>
          <Label style={styles.eliteChallengeText}>{en.eliteChallenge}</Label>
        </View>
        <View style={styles.controller}>
          <SvgIcon
            icon={SVG.gameControllerWhite}
            width={hp(3)}
            height={hp(3)}
          />
        </View>
      </View>
      <View style={styles.mindIconContainer}>
        <View style={styles.insideMindContainer}>
          <SvgIcon icon={SVG.mind} width={hp(4)} height={hp(4)} />
        </View>
      </View>

      <Label style={styles.dailyNewRobuxText}>{en.dailyNewRobux}</Label>
      <Label style={styles.testYourKnowledgeText}>{en.testYourKnowledge}</Label>
      <View style={styles.btnRow}>
        <Button
          icon={<SvgIcon icon={SVG.play} width={hp(2)} height={hp(2)} />}
          text={en.startRobux}
          textStyle={styles.startBtnText}
          style={styles.startBtn}
          onPress={() => navigation.navigate(SCREEN.DAILY_ROBUX_QUIZ)}
        />
        <Button
          icon={
            <SvgIcon
              icon={SVG.gameControllerColorful}
              width={hp(2)}
              height={hp(2)}
            />
          }
          text={en.playRobuxBlast}
          textStyle={styles.playBtnText}
          style={styles.playBtn}
        />
      </View>
    </View>
  );
};

export default FreeDailyRobuxScreen;

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
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(5),
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
