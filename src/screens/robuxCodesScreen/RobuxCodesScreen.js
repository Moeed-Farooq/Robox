import React, { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';

import { SVG } from '../../assets';
import { en } from '../../languages';
import { ROBUX_CODES } from '../../dummies';
import {
  COLORS,
  FONT,
  HEX_OPACITY,
  hp,
  wp,
} from '../../enums/StyleGuide';
import { RobuxCodesCards } from '../../components';

const RobuxCodesScreen = () => {
  const navigation = useNavigation();

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
    <FlatList
      data={ROBUX_CODES}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      ListHeaderComponent={renderHeader}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

export default RobuxCodesScreen;

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: COLORS.splashBg,
    paddingVertical: wp(8),
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
});