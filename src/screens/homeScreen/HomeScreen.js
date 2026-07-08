import React from 'react';
import { Animated, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import { en } from '../../languages';
import { DailyReward, RobuxFeaturesData } from '../../dummies';
import { DailyRewardsCards, HomeHeroBanner, RobuxFeaturesCards } from '../../components';
import useHomeScreenAnimation from '../../hooks/useHomeScreenAnimation';
import useTotalPoints from '../../hooks/useTotalPoints';

const AnimatedScrollView = Animated.createAnimatedComponent(
  Animated.ScrollView,
);

const HomeScreen = () => {
  const navigation = useNavigation();
  const { screenAnim } = useHomeScreenAnimation();
  const { totalPoints, loading } = useTotalPoints();

  const renderDailyRewards = ({ item }) => <DailyRewardsCards item={item} />;
  const renderRobuxFeatures = ({ item }) => <RobuxFeaturesCards item={item} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AnimatedScrollView
        style={[styles.mainContainer, screenAnim]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <HomeHeroBanner
          navigation={navigation}
          totalPoints={totalPoints}
          totalPointsLoading={loading}
        />

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
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.splashBg,
  },
  contentContainer: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(18),
  },
  sectionWrap: {
    marginBottom: hp(2),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.2),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightYellow + '22',
    paddingBottom: hp(0.8),
  },
  sectionTitle: {
    color: COLORS.lightYellow,
    fontSize: hp(2.1),
    fontFamily: FONT.bold,
    textShadowColor: COLORS.accent + '99',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: hp(1.3),
  },
  listSpacing: {
    paddingBottom: hp(0.5),
  },
});
