import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';
import { COLORS, FONT, hp, wp } from '../../enums/StyleGuide';

const ConversionCard = ({ item, selected, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        selected && styles.selectedCard,
      ]}>

      <View style={styles.row}>

        {/* Left Icon */}
        <View
          style={[
            styles.iconCircle,
            selected && styles.selectedIcon,
          ]}>
          <Label
            style={[
              styles.iconText,
              selected && styles.selectedIconText,
            ]}>
            {item.icon}
          </Label>
        </View>

        {/* Center Text */}
        <View style={styles.textContainer}>
          <Label style={styles.title}>{item.title}</Label>
          <Label style={styles.subTitle}>{item.subtitle}</Label>
        </View>

        {/* Tick */}
        {selected && (
          <View style={styles.tickCircle}>
            <SvgIcon
              icon={SVG.selected}
              width={wp(4)}
              height={wp(4)}
            />
          </View>
        )}

      </View>

    </TouchableOpacity>
  );
};

export default React.memo(ConversionCard);

const styles = StyleSheet.create({

  card: {
    width: '48%',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: wp(5),
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
  },

  selectedCard: {
    borderWidth: wp(0.6),
    borderColor: COLORS.lightestGreen,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconCircle: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: '#546583',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedIcon: {
    backgroundColor: COLORS.lightestGreen,
  },

  iconText: {
    color: COLORS.white,
    fontFamily: FONT.bold,
    fontSize: hp(2.3),
  },

  selectedIconText: {
    color: COLORS.white,
  },

  textContainer: {
    flex: 1,
    marginLeft: wp(3),
  },

  title: {
    color: COLORS.white,
    fontFamily: FONT.semiBold,
    fontSize: hp(1.8),
  },

  subTitle: {
    color:COLORS.lightGrey,
    fontFamily: FONT.medium,
    fontSize: hp(1.2),
    marginTop: hp(0.3),
  },

  tickCircle: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    backgroundColor: COLORS.lightestGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },

});