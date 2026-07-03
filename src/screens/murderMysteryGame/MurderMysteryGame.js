import React from 'react';
import { StyleSheet, View, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common'; // Assuming Label is your custom Text component
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { en } from '../../languages';
import { useNavigation } from '@react-navigation/native';

const MurderMysteryGame = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={[COLORS.Purple, '#5d43cf', '#7A5CFF']}
      style={styles.mainContainer}
    >
      <StatusBar backgroundColor={COLORS.Purple} barStyle={'light-content'} />
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <SvgIcon
            icon={SVG.goBack}
            height={hp(4)}
            width={hp(4)}
            color={COLORS.white}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <View style={styles.inlineTitleRow}>
            <SvgIcon
              icon={SVG.search}
              height={wp(10)}
              width={wp(10)}
              style={styles.titleIcon}
            />
            <Label style={styles.mainTitle}>{en.murderMystery}</Label>
          </View>
          <Label style={styles.subTitle}>{en.detectiveGame}</Label>
        </View>

        <View style={{ width: wp(10) }} />
      </View>

      <View style={styles.centerContainer}>
        <View style={styles.logoCard}>
          <SvgIcon icon={SVG.search} height={wp(15)} width={wp(15)} />
        </View>

        <Label style={styles.comingSoonText}>{en.comingSoon}</Label>

        <Label style={styles.descriptionText}>{en.solveTheMystery}</Label>
        <Label style={styles.subDescriptionText}>{en.gatherClues}</Label>

        <Label style={styles.taglineText}>{en.detectiveClueMind}</Label>

        {/* Family Pill Tag */}
        <View style={styles.pillTag}>
          <Label style={styles.pillText}>{en.recomendForSharpMinds}</Label>
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <SvgIcon
            icon={SVG.home}
            width={hp(1)}
            height={hp(1)}
            style={{ marginRight: wp(2) }}
          />
          <Label style={styles.backButtonText}>{en.backToGames}</Label>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default MurderMysteryGame;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    marginTop: hp(6),
  },
  closeButton: {
    backgroundColor: COLORS.yellow,
    width: wp(13),
    height: wp(13),
    borderRadius: wp(6.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  inlineTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: wp(2),
  },
  mainTitle: {
    color: COLORS.white,
    fontSize: hp(2.8),
    fontFamily: FONT.semiBold,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: hp(1.4),
    fontFamily: FONT.regular,
    marginTop: hp(0.2),
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(6),
  },
  logoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    width: wp(32),
    height: wp(32),
    borderRadius: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(4),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  comingSoonText: {
    color: COLORS.white,
    fontSize: hp(4.2),
    fontFamily: FONT.semiBold,
    marginBottom: hp(2),
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  descriptionText: {
    color: COLORS.white,
    fontSize: hp(1.8),
    fontFamily: FONT.regular,
    textAlign: 'center',
    lineHeight: hp(2.6),
  },
  subDescriptionText: {
    color: COLORS.white,
    fontSize: hp(1.8),
    fontFamily: FONT.regular,
    textAlign: 'center',
    lineHeight: hp(2.6),
    marginBottom: hp(2.5),
  },
  taglineText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: hp(1.5),
    fontFamily: FONT.medium,
    textAlign: 'center',
    marginBottom: hp(2),
  },
  pillTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    borderRadius: hp(2),
  },
  pillText: {
    color: COLORS.lightYellow,
    fontSize: hp(1.5),
    fontFamily: FONT.medium,
  },
  bottomContainer: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(5),
  },
  backButton: {
    backgroundColor: '#1C1C1E', // Dark charcoal/black color from image
    flexDirection: 'row',
    height: hp(6.5),
    borderRadius: hp(3.25),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: hp(1.8),
    fontFamily: FONT.semiBold,
  },
});
