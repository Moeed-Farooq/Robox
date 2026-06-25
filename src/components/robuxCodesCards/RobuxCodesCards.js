import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View, Clipboard } from 'react-native';
import Label from '../../common';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { SVG } from '../../assets';
import SvgIcon from '../../common/SvgIcon';

const RobuxCodesCards = ({ item }) => {
  const handleCopy = () => {
    Clipboard.setString(item.code);
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.providerSection}>
          <SvgIcon
            icon={SVG.userAvatarWhite}
            width={hp(2.2)}
            height={hp(2.2)}
          />
          <Label style={styles.providerText}>{item.provider}</Label>
        </View>
        <View style={styles.viewsContainer}>
          <View style={{ marginTop: wp(0.7) }}>
            <SvgIcon icon={SVG.eye} width={hp(2)} height={hp(2)} />
          </View>
          <Label style={styles.metaText}>{item.views}</Label>
        </View>

        <Label style={styles.timeText}>{item.time}</Label>
      </View>

      <View style={styles.codeBox}>
        <Label style={styles.codeText}>{item.code}</Label>
      </View>

      <TouchableOpacity
        style={styles.copyButton}
        activeOpacity={0.8}
        onPress={handleCopy}
      >
        <Label style={styles.copyButtonText}>Copy</Label>
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <TouchableOpacity style={styles.reportButton}>
          <SvgIcon icon={SVG.report} width={hp(1.8)} height={hp(1.8)} />

          <Label style={styles.reportText}>Report</Label>
        </TouchableOpacity>

        <TouchableOpacity style={styles.howToUseButton}>
          <Label style={styles.howToUseText}>How to use code</Label>
        </TouchableOpacity>

        <TouchableOpacity>
        <SvgIcon icon={SVG.crossButton} width={hp(4)} height={hp(4)} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RobuxCodesCards;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.darkRed + HEX_OPACITY[9],
    borderRadius: hp(3),
    padding: wp(5),
    marginBottom: hp(2.5),
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },

  providerSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarIcon: {
    fontSize: hp(2),
    marginRight: wp(2),
  },

  metaText: {
    color: COLORS.lightGreen,
    fontSize: hp(1.8),
    fontFamily: FONT.regular,
  },

  timeText: {
    backgroundColor: COLORS.red,
    paddingHorizontal: wp(2),
    paddingVertical: wp(1),
    color: COLORS.white,
    fontSize: hp(1.3),
    borderRadius: wp(1),
    overflow: 'hidden',
    fontFamily: FONT.regular,
  },

  codeBox: {
    backgroundColor: COLORS.white,
    borderRadius: hp(2),
    paddingVertical: hp(2.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },

  codeText: {
    color: COLORS.darkRed,
    fontSize: hp(2.5),
    letterSpacing: 2,
    fontFamily: FONT.bold,
  },

  copyButton: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: hp(2),
    paddingVertical: hp(1.8),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2.5),
  },

  copyButtonText: {
    color: COLORS.white,
    fontSize: hp(2.2),
    fontFamily: FONT.bold,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  reportText: {
    color: COLORS.white,
    fontSize: hp(1.8),
    fontFamily: FONT.medium,
  },

  howToUseButton: {
    backgroundColor: COLORS.yellow,
    borderRadius: hp(3),
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.2),
  },

  howToUseText: {
    color: COLORS.white,
    fontSize: hp(1.3),
    fontFamily: FONT.semiBold,
  },

  crossButton: {
    width: hp(4.2),
    height: hp(4.2),
    borderRadius: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },

  crossText: {
    color: COLORS.white,
    fontSize: hp(1.8),
    fontFamily: FONT.bold,
  },
  viewsContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'center',
    gap: wp(1),
  },

  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
  },

  providerText: {
    color: COLORS.white,
    fontSize: hp(2.1),
    fontFamily: FONT.bold,
    marginLeft: wp(2),
  },
});
