import React, { useCallback, useEffect, useRef } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { RobuxCodesCards } from '../../components';
import { ROBUX_CODES } from '../../dummies';
import { ENGAGEMENT_THRESHOLDS } from '../../enums';
import {
  COLORS,
  FONT,
  hp,
  wp
} from '../../enums/StyleGuide';
import { en } from '../../languages';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isIOS } from '../../helpers';
import useTotalPoints from '../../hooks/useTotalPoints';
import { AppBannerAd } from '../../services/ads';

const UNLOCK_POINTS = ENGAGEMENT_THRESHOLDS.FEATURE_UNLOCK;

const RobuxCodesScreen = () => {
  const navigation = useNavigation();
  const { totalPoints, loading } = useTotalPoints();
  const hasRedirectedRef = useRef(false);
  const isFeatureLocked = !loading && Number(totalPoints) < UNLOCK_POINTS;

  useEffect(() => {
    if (!isFeatureLocked || hasRedirectedRef.current) {
      return;
    }

    hasRedirectedRef.current = true;
    Alert.alert(
      en.featureLocked,
      en.featureLockedMessage.replace('{points}', String(UNLOCK_POINTS)),
      [{ text: en.ok, onPress: () => navigation.goBack() }],
    );
    navigation.goBack();
  }, [isFeatureLocked, navigation]);

  const renderItem = useCallback(
    ({ item }) => <RobuxCodesCards item={item} />,
    [],
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}
      >
        <SvgIcon
          icon={SVG.goBack}
          width={hp(3)}
          height={hp(3)}
        />
      </TouchableOpacity>

      <Label style={styles.titleText}>
        {en.robuxCodes}
      </Label>

      <View style={styles.placeholder} />
    </View>
  );

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: COLORS.splashBg }, styles.mainContainer]}>
      <FlatList
        data={ROBUX_CODES}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.bannerContainer}>
        <AppBannerAd />
      </View>
    </SafeAreaView>
  );
};

export default RobuxCodesScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  listContainer: {
    backgroundColor: COLORS.splashBg,
    paddingVertical: isIOS() ? wp(1) : hp(2),
    paddingHorizontal: wp(5),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(3),
  },

  backIcon: {
    backgroundColor: COLORS.lightYellow,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(2),
    borderRadius: hp(4),
  },

  titleText: {
    color: COLORS.white,
    fontSize: hp(2.6),
    fontFamily: FONT.bold,
  },

  placeholder: {
    width: wp(10),
  },
  bannerContainer: {
    paddingBottom: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.splashBg,
  },
});