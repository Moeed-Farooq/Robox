import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BannerAd as GoogleBannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import { getAdUnitId } from './AdConfig';
import {
  areAdsEnabled,
  initializeAdsSettings,
  isAdsConfigLoaded,
} from './AdsSettingsService';

const BannerAd = ({
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  style,
  requestOptions = { requestNonPersonalizedAdsOnly: true },
}) => {
  const [adsEnabled, setAdsEnabled] = React.useState(
    isAdsConfigLoaded() && areAdsEnabled(),
  );

  React.useEffect(() => {
    let mounted = true;

    initializeAdsSettings()
      .then(() => {
        if (mounted) {
          setAdsEnabled(areAdsEnabled());
        }
      })
      .catch(() => {
        if (mounted) {
          setAdsEnabled(areAdsEnabled());
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!adsEnabled) {
    return null;
  }

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
