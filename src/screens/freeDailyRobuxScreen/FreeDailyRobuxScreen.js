import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SVG } from '../../assets';
import Label from '../../common';
import Button from '../../common/Button';
import SvgIcon from '../../common/SvgIcon';
import { SCREEN } from '../../enums';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { en } from '../../languages';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isIOS } from '../../helpers';
import useTotalPoints from '../../hooks/useTotalPoints';

const FreeDailyRobuxScreen = () => {
  const navigation = useNavigation();
  const { totalPoints, loading } = useTotalPoints();
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: COLORS.splashBg }, styles.mainContainer]}>
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
      <Label style={styles.totalPointsText}>
        {en.totalPoints}: {loading ? '--' : Number(totalPoints).toLocaleString()}
      </Label>
      <View style={styles.btnRow}>
        <View style={styles.btnWrap}>
          <Button
            icon={<SvgIcon icon={SVG.play} width={hp(2)} height={hp(2)} />}
            text={en.startRobux}
            textStyle={styles.startBtnText}
            style={styles.startBtn}
            onPress={() => navigation.navigate(SCREEN.DAILY_ROBUX_QUIZ)}
          />
        </View>
        <View style={styles.btnWrap}>
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
    </SafeAreaView>
  );
};

export default FreeDailyRobuxScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
    paddingHorizontal: wp(6),
    paddingVertical: isIOS() ? wp(1) : hp(2),
  },

  HeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(5),
    gap: wp(3),
    width: '100%',
  },
  btnWrap: {
    flex: 1,
    flexBasis: 0,
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
  totalPointsText: {
    color: COLORS.lightYellow,
    fontSize: hp(1.8),
    fontFamily: FONT.semiBold,
    textAlign: 'center',
    marginTop: hp(1.2),
  },
  startBtnText: {
    color: COLORS.white,
    fontFamily: FONT.semiBold,
    textAlign: 'center',
  },
  startBtn: {
    width: '100%',
    marginVertical: 0,
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
    width: '100%',
    marginVertical: 0,
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
