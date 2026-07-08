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
      <View style={styles.innerPanel}>
        <Image source={item.src} style={styles.image} resizeMode="cover" />
        <Label style={styles.title}>{item.title}</Label>
      </View>
    </TouchableOpacity>
  );
};

export default RobuxFeaturesCards;

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: wp(5),
    minHeight: hp(19),
    backgroundColor: COLORS.surfaceElevated + HEX_OPACITY[60],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(2),
    borderWidth: 1,
    borderColor: COLORS.lightYellow + HEX_OPACITY[25],
  },
  innerPanel: {
    width: '100%',
    minHeight: hp(16),
    borderRadius: wp(4),
    backgroundColor: COLORS.bgPurpleDark + HEX_OPACITY[35],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(2),
    overflow: 'hidden',
  },
  image: {
    width: hp(9),
    height: hp(9),
    borderRadius: hp(2.6),
    overflow: 'hidden',
  },
  title: {
    color: COLORS.newwhite,
    fontSize: hp(1.9),
    fontFamily: FONT.bold,
    marginTop: hp(1.3),
    textAlign: 'center',
    textShadowColor: COLORS.accent + HEX_OPACITY[45],
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
