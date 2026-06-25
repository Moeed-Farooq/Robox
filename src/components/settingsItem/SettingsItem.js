import React from 'react';
import { StyleSheet, TouchableOpacity, View, Switch } from 'react-native';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';

const SettingsItem = ({ item, type, onPress, onToggle }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>
          <SvgIcon icon={item.icon} width={hp(2.8)} height={hp(2.8)} />
        </View>

        <View style={styles.textContainer}>
          <Label style={styles.title}>{item.title}</Label>
          <Label style={styles.subtitle}>{item.subtitle}</Label>
        </View>
      </View>

      {type === 'toggle' ? (
        <Switch
          value={item.value}
          onValueChange={onToggle}
          trackColor={{
            false: '#6e7288',
            true: '#e7a311',
          }}
          thumbColor={item.value ? '#FFF8E1' : '#9797be'}
        />
      ) : (
        <SvgIcon icon={SVG.arrowRight} width={hp(3)} height={hp(3)} />
      )}
    </TouchableOpacity>
  );
};

export default SettingsItem;

const styles = StyleSheet.create({
  container: {
    height: hp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    borderRadius: hp(2),
    backgroundColor: COLORS.surfaceElevated + HEX_OPACITY[55],
    marginBottom: hp(1.2),
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  textContainer: {
    marginLeft: wp(3),
  },
  iconContainer: {
    backgroundColor: COLORS.yellow + HEX_OPACITY[25],
    paddingHorizontal: wp(3),
    paddingVertical: wp(3),

    borderRadius: wp(6),
  },
  title: {
    color: COLORS.white,
    fontSize: hp(1.9),
    fontFamily: FONT.medium,
  },

  subtitle: {
    color: COLORS.mutedText,
    fontSize: hp(1.4),
    fontFamily: FONT.regular,
  },
});
