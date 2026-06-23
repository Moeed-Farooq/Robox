import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import Label from '../../common';
import SvgIcon from '../../common/SvgIcon';
import { SVG } from '../../assets';

const GamesCards = ({ item }) => {
  const levelColors = {
    Easy: {
      bg: '#2E4730',
      text: '#69FF7E',
    },
    Medium: {
      bg: '#4D4420',
      text: '#FFD54F',
    },
    Hard: {
      bg: '#4A2222',
      text: '#FF6B6B',
    },
  };

  const currentLevelColor = levelColors[item.level];
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: item.bgcolor }]}>
        <SvgIcon icon={item.icon} width={hp(3)} height={hp(3)} />
      </View>

      <View style={styles.content}>
        <Label style={styles.title}>{item.name}</Label>

        <Label style={styles.detail}>{item.detail}</Label>

        <View style={styles.bottomRow}>
          <View
            style={[
              styles.levelContainer,
              { backgroundColor: currentLevelColor.bg },
            ]}
          >
            <Label style={[styles.level, { color: currentLevelColor.text }]}>
              {item.level}
            </Label>
          </View>

          <Label style={styles.subDetail}>{item.subDetail}</Label>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.8} style={styles.playButton}>
        <SvgIcon icon={SVG.play} width={hp(1.8)} height={hp(1.8)} />
      </TouchableOpacity>
    </View>
  );
};

export default GamesCards;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceElevated+ HEX_OPACITY[22],
    borderRadius: hp(2),
    paddingHorizontal: hp(3),
    paddingVertical: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
    
  marginHorizontal:hp(2),
  },

  iconContainer: {
    width: hp(8),
    height: hp(8),
    borderRadius: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    marginLeft: hp(3),
  },

  title: {
    color: COLORS.white,
    fontSize: hp(1.9),
    fontFamily: FONT.semiBold,
  },

  detail: {
    color: COLORS.mutedText,
    fontSize: hp(1.4),
    marginTop: hp(0.4),
    fontFamily: FONT.regular,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.8),
  },

  levelContainer: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.25),
    borderRadius: hp(1),
  },

  level: {
    fontSize: hp(1.1),
    fontFamily: FONT.medium,
  },

  subDetail: {
    color: COLORS.mutedText,
    fontSize: hp(1.2),
    marginLeft: wp(3),
    textAlign: 'center',
  },

  playButton: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2),
  },
});
