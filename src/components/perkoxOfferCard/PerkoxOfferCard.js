import React, { memo } from 'react';
import { Image, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Label from '../../common';
import { SCREEN } from '../../enums';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';

const OPEN_OFFERS_IN_WEBVIEW = false;

const PerkoxOfferCard = ({ item }) => {
  const navigation = useNavigation();

  const handleOpen = async () => {
    if (!item?.link) {
      return;
    }

    // Keep WebView flow available for later use.
    if (OPEN_OFFERS_IN_WEBVIEW) {
      navigation.navigate(SCREEN.PERKOX_WEBVIEW_SCREEN, {
        url: item.link,
        title: item.name || 'Offer',
      });
      return;
    }

    try {
      await Linking.openURL(item.link);
    } catch (error) {
      console.warn('Failed to open Perkox offer:', error?.message || error);
    }
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={handleOpen}>
      <View style={styles.row}>
        <View style={styles.imageWrap}>
          {item.thumbnail ? (
            <Image source={{ uri: item.thumbnail }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Label style={styles.placeholderText}>PX</Label>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Label style={styles.title} numberOfLines={2}>
            {item.name}
          </Label>
          {!!item.description && (
            <Label style={styles.description} numberOfLines={2}>
              {item.description}
            </Label>
          )}
          <View style={styles.metaRow}>
            <View style={styles.rewardBadge}>
              <Label style={styles.rewardText}>+{item.payout} coins</Label>
            </View>
            <Label style={styles.ctaText}>Open</Label>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(PerkoxOfferCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceElevated + HEX_OPACITY[70],
    borderRadius: hp(1.8),
    borderWidth: 1,
    borderColor: COLORS.lightYellow + HEX_OPACITY[25],
    padding: wp(3),
    marginBottom: hp(1.2),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrap: {
    width: hp(7),
    height: hp(7),
    borderRadius: hp(1.4),
    overflow: 'hidden',
    backgroundColor: COLORS.bgPurpleDark,
    marginRight: wp(3),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: COLORS.lightYellow,
    fontFamily: FONT.bold,
  },
  content: {
    flex: 1,
  },
  title: {
    color: COLORS.newwhite,
    fontSize: hp(1.7),
    fontFamily: FONT.semiBold,
  },
  description: {
    color: COLORS.lightestWhite,
    fontSize: hp(1.3),
    fontFamily: FONT.regular,
    marginTop: hp(0.4),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(0.8),
  },
  rewardBadge: {
    backgroundColor: COLORS.accent + HEX_OPACITY[25],
    borderRadius: hp(1),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
  },
  rewardText: {
    color: COLORS.accent,
    fontSize: hp(1.35),
    fontFamily: FONT.semiBold,
  },
  ctaText: {
    color: COLORS.lightYellow,
    fontSize: hp(1.4),
    fontFamily: FONT.semiBold,
  },
});
