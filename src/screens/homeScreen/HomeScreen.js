import React, { useEffect, useRef } from 'react';
import { Animated, Easing, FlatList, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import { en } from '../../languages';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { DailyReward, RobuxFeaturesData } from '../../dummies';
import { DailyRewardsCards, RobuxFeaturesCards } from '../../components';

const AnimatedScrollView = Animated.createAnimatedComponent(
  Animated.ScrollView,
);

const HomeScreen = () => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const screenAnim = {
    opacity: progress,
    transform: [
      {
        translateX: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-60, 0],
        }),
      },
    ],
  };

  const renderDailyRewards = ({ item }) => <DailyRewardsCards item={item} />;
  const renderRobuxFeatures = ({ item }) => <RobuxFeaturesCards item={item} />;

  return (
    <AnimatedScrollView
      style={[styles.mainContainer, screenAnim]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroTopRow}>
          <View style={styles.textColumn}>
            <Label style={styles.robuxText}>{en.robuxPoints}</Label>
            <Label style={styles.welcomeText}>{en.welconeBack}</Label>
          </View>

          <View style={styles.controller}>
            <SvgIcon
              icon={SVG.gameControllerWhite}
              width={hp(4)}
              height={hp(4)}
            />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeader}>
          <Label style={styles.sectionTitle}>{en.dailyRewards}</Label>
        </View>

        <FlatList
          data={DailyReward}
          renderItem={renderDailyRewards}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.listSpacing}
        />
      </View>

      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeader}>
          <Label style={styles.sectionTitle}>{en.robuxFeatures}</Label>
        </View>

        <FlatList
          data={RobuxFeaturesData}
          renderItem={renderRobuxFeatures}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          contentContainerStyle={styles.listSpacing}
        />
      </View>
    </AnimatedScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
  },
  contentContainer: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(18),
  },
  heroCard: {
    borderRadius: wp(6),
    padding: wp(5),
    marginTop: hp(1),
    marginBottom: hp(2.5),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 8,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textColumn: {
    flex: 1,
  },
  eyebrow: {
    color: COLORS.newlightWhite,
    fontSize: hp(1.45),
    fontFamily: FONT.medium,
    textTransform: 'uppercase',
    letterSpacing: wp(0.8),
    marginBottom: hp(0.6),
  },
  welcomeText: {
    color: COLORS.newlightWhite,
    fontSize: hp(1.8),
    marginTop: hp(0.4),
    fontFamily: FONT.regular,
  },
  robuxText: {
    color: COLORS.white,
    fontSize: hp(3.1),
    fontFamily: FONT.semiBold,
  },
  controller: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp(1.3),
    borderRadius: hp(2),
  },
  heroStatsRow: {
    flexDirection: 'row',
    marginTop: hp(2.4),
  },
  statPill: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: hp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    marginRight: wp(3),
  },
  statValue: {
    color: COLORS.white,
    fontSize: hp(1.6),
    fontFamily: FONT.semiBold,
  },
  statLabel: {
    color: COLORS.newlightWhite,
    fontSize: hp(1.2),
    marginTop: hp(0.1),
    fontFamily: FONT.regular,
  },
  sectionWrap: {
    marginBottom: hp(2),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.2),
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: hp(2.1),
    fontFamily: FONT.semiBold,
  },
  sectionLink: {
    color: COLORS.lightYellow,
    fontSize: hp(1.45),
    fontFamily: FONT.medium,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: hp(1.3),
  },
  listSpacing: {
    paddingBottom: hp(0.5),
  },
});
