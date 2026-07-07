import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BannerAd as GoogleBannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import { getAdUnitId } from './AdConfig';

const BannerAd = ({
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  style,
  requestOptions = { requestNonPersonalizedAdsOnly: true },
}) => {
  return (
    <View style={[styles.container, style]}>
      <GoogleBannerAd
        unitId={getAdUnitId('banner')}
        size={size}
        requestOptions={requestOptions}
        onAdFailedToLoad={error => {
          console.warn('Banner ad failed to load:', error?.message || error);
        }}
      />
    </View>
  );
};

export default BannerAd;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
