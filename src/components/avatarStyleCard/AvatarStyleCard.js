import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';

const AvatarStyleCard = ({ item, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.card, isSelected && styles.activeCard]}>
      <View style={[styles.iconBox, isSelected && styles.activeIconBox]}>
        <SvgIcon
          icon={isSelected ? item.activeIcon : item.icon}
          width={hp(2.6)}
          height={hp(2.6)}
        />
      </View>

      <Label style={[styles.title, isSelected && styles.activeTitle]}>{item.title}</Label>
      <Label style={styles.subtitle}>{item.subtitle}</Label>
    </TouchableOpacity>
  );
};

export default AvatarStyleCard;

const styles = StyleSheet.create({
  card: {
    width: wp(38),
    padding: wp(3.5),
    borderRadius: wp(4.8),
    backgroundColor: COLORS.surfaceAlt + HEX_OPACITY[22],
    marginRight: wp(3),
    alignItems: 'center',
    
  },
  activeCard: {
    width: wp(42),
    transform: [{ scale: 1.03 }],
    backgroundColor: COLORS.surfaceElevated + HEX_OPACITY[82],
  },
  iconBox: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  activeIconBox: {
    backgroundColor: COLORS.lightYellow,
    borderRadius: wp(7),
  },
  title: {
    color: COLORS.white,
    fontSize: hp(1.7),
    fontFamily: FONT.semiBold,
    marginTop: hp(0.4),
  },
  activeTitle: {
    color: COLORS.lightYellow,
  },
  subtitle: {
    color: COLORS.mutedText,
    fontSize: hp(1.25),
    marginTop: hp(0.35),
    textAlign: 'center',
    fontFamily: FONT.regular,
  },
});