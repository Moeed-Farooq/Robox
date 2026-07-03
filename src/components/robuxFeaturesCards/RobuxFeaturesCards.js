import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Label from '../../common';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { useNavigation } from '@react-navigation/native';

const RobuxFeaturesCards = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.5}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Image source={item.src} style={styles.image} resizeMode="cover" />
      <Label style={styles.title}>{item.title}</Label>
    </TouchableOpacity>
  );
};

export default RobuxFeaturesCards;

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: wp(5),
    minHeight: hp(19),
    backgroundColor: COLORS.surfaceElevated+ HEX_OPACITY[22],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(2),
  },
  image: {
    width: hp(9),
    height: hp(9),
    borderRadius: hp(2.2),
    overflow: 'hidden',
  },
  title: {
    color: COLORS.white,
    fontSize: hp(1.9),
    fontFamily: FONT.semiBold,
    marginTop: hp(1.3),
    textAlign: 'center',
  },
});
