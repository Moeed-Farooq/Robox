import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';

const FruitCard = ({ item, index, onPress }) => {
  const isOpen = item.isFlipped || item.isMatched;

  return (
    <TouchableOpacity
      style={[styles.card, isOpen && styles.cardOpen]}
      activeOpacity={0.7}
      onPress={() => onPress(index)}
    >
      {isOpen ? (
        typeof item.icon === 'string' ? (
          <Label style={{ fontSize: hp(3.5) }}>{item.icon}</Label>
        ) : (
          <SvgIcon icon={item.icon} width={wp(10)} height={hp(5)} />
        )
      ) : (
        <SvgIcon icon={SVG.locked} width={wp(8)} height={hp(4)} />
      )}
    </TouchableOpacity>
  );
};

export default React.memo(FruitCard);

const styles = StyleSheet.create({
  card: {
    width: wp(18),
    height: wp(22),
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardOpen: {
    backgroundColor: COLORS.lightGreen,
    borderColor: COLORS.lightYellow || '#ffd700',
    borderWidth: 1,
  },
});