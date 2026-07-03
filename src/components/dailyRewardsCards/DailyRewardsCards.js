import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Label from '../../common';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { hexToRgba } from '../../helpers';
import { useNavigation } from '@react-navigation/native';

const DailyRewardsCards = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
    onPress={()=>navigation.navigate(item.screen)}
     style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={item.src} style={styles.image} resizeMode="cover" />
      </View>

      <View style={styles.textContainer}>
        <Label style={styles.title1}>{item.title1}</Label>
        <View style={styles.bottomRow}>
          <View style={[styles.rewardContainer, { backgroundColor: hexToRgba(item.color, 0.2) }]}> 
            <Label style={[styles.reward, { color: item.color }]}>{item.reward}</Label>
          </View>
          <Label style={styles.title2}>{item.title2}</Label>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DailyRewardsCards;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingHorizontal: wp(3.5),
    marginBottom: hp(1.3),
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated+ HEX_OPACITY[22],
    borderRadius: wp(5),
    minHeight: hp(14),
    // borderWidth: 1,
    // borderColor: COLORS.borderSoft,
  },
imageContainer: {
  width: wp(15),
  height: wp(15),
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: wp(3),
  borderRadius: wp(2),
  backgroundColor: 'rgba(255,255,255,0.05)',
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
    color: COLORS.white,
    fontSize: hp(1.95),
    fontFamily: FONT.semiBold,
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: hp(0.5),
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title2: {
    color: COLORS.mutedText,
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
  },
});