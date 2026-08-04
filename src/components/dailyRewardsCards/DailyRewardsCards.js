import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Alert } from 'react-native';
import Label from '../../common';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { hexToRgba } from '../../helpers';
import { useNavigation } from '@react-navigation/native';

const DailyRewardsCards = ({ item }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (item?.comingSoon) {
      Alert.alert('Coming Soon', 'Perkox Offerwall Rewards is coming soon. Stay tuned!');
      return;
    }

    if (item?.screen) {
      navigation.navigate(item.screen);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <View style={styles.innerPanel}>
        <View style={styles.imageContainer}>
          <Image source={item.src} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.textContainer}>
          <Label style={styles.title1}>{item.title1}</Label>
          <View style={styles.bottomRow}>
            <View
              style={[
                styles.rewardContainer,
                { backgroundColor: hexToRgba(item.color, 0.2) },
              ]}
            >
              <Label style={[styles.reward, { color: item.color }]}>
                {item.reward}
              </Label>
            </View>
            <Label style={styles.title2}>{item.title2}</Label>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DailyRewardsCards;

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: wp(1.8),
    paddingVertical: hp(0.9),
    marginBottom: hp(1.3),
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated + HEX_OPACITY[58],
    borderRadius: wp(5),
    minHeight: hp(14),
    borderWidth: 1,
    borderColor: COLORS.lightYellow + HEX_OPACITY[24],
    justifyContent: 'center',
  },
  innerPanel: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: wp(4),
    overflow: 'hidden',
    backgroundColor: COLORS.bgPurpleDark + HEX_OPACITY[36],
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
  },
  imageContainer: {
    width: wp(15),
    height: wp(15),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
    borderRadius: wp(3),
    backgroundColor: COLORS.white + HEX_OPACITY[6],
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
  },
  title1: {
    color: COLORS.newwhite,
    fontSize: hp(1.95),
    fontFamily: FONT.bold,
    textShadowColor: COLORS.black + HEX_OPACITY[35],
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: hp(0.5),
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title2: {
    color: COLORS.lightestWhite,
    fontSize: hp(1.35),
    marginLeft: wp(2.5),
    fontFamily: FONT.regular,
  },
  reward: {
    fontSize: hp(1.45),
    fontFamily: FONT.semiBold,
  },
  rewardContainer: {
    paddingVertical: wp(1.1),
    paddingHorizontal: hp(1),
    borderRadius: wp(3.5),
    borderWidth: 1,
    borderColor: COLORS.lightYellow + HEX_OPACITY[20],
  },
});
