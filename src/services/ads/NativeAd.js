import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  NativeAd as GoogleNativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
} from 'react-native-google-mobile-ads';
import { COLORS, FONT, HEX_OPACITY, hp, wp } from '../../enums/StyleGuide';
import { en } from '../../languages';
import { getAdUnitId } from './AdConfig';
import {
  areAdsEnabled,
  initializeAdsSettings,
  isAdsConfigLoaded,
} from './AdsSettingsService';

const DEFAULT_REQUEST_OPTIONS = { requestNonPersonalizedAdsOnly: true };

// AdMob requires the main media asset to be at least 120x120 dp/pt in every
// dimension, otherwise video ads are rejected by the native ad validator.
const MIN_MEDIA_DIMENSION = 120;
const MEDIA_HEIGHT = Math.max(hp(20), MIN_MEDIA_DIMENSION + 20);

const NativeAdCard = ({ style, requestOptions = DEFAULT_REQUEST_OPTIONS }) => {
  const [adsEnabled, setAdsEnabled] = useState(
    isAdsConfigLoaded() && areAdsEnabled(),
  );
  const [nativeAd, setNativeAd] = useState(null);
  // Google's native ad validator flags asset views as "outside the native ad
  // view" when the NativeAdView's measured height contains a fractional pixel
  // (e.g. 637.333). Locking the height to an integer after the first layout
  // pass keeps every registered asset view strictly inside the ad container
  // on both platforms.
  const [adViewHeight, setAdViewHeight] = useState(null);
  const hasMeasuredRef = useRef(false);

  useEffect(() => {
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

  useEffect(() => {
    let mounted = true;
    let loadedAd = null;

    if (!adsEnabled) {
      setNativeAd(null);
      return undefined;
    }

    hasMeasuredRef.current = false;
    setAdViewHeight(null);

    GoogleNativeAd.createForAdRequest(
      getAdUnitId('nativeAdvanced'),
      requestOptions,
    )
      .then(ad => {
        if (!mounted) {
          ad.destroy();
          return;
        }

        loadedAd = ad;
        setNativeAd(ad);
      })
      .catch(error => {
        console.warn('Native ad failed to load:', error?.message || error);
        if (mounted) {
          setNativeAd(null);
        }
      });

    return () => {
      mounted = false;
      loadedAd?.destroy();
    };
  }, [adsEnabled, requestOptions]);

  const handleAdViewLayout = useCallback(event => {
    if (hasMeasuredRef.current) {
      return;
    }

    const measuredHeight = event?.nativeEvent?.layout?.height;

    if (!measuredHeight) {
      return;
    }

    hasMeasuredRef.current = true;
    setAdViewHeight(Math.ceil(measuredHeight));
  }, []);

  if (!adsEnabled || !nativeAd) {
    return null;
  }

  const hasRating = typeof nativeAd.starRating === 'number' && nativeAd.starRating > 0;
  const hasPriceOrStore = Boolean(nativeAd.price || nativeAd.store);

  return (
    <View style={[styles.container, style]}>
      <NativeAdView
        nativeAd={nativeAd}
        style={[styles.adView, adViewHeight ? { height: adViewHeight } : null]}
        onLayout={handleAdViewLayout}
      >
        <View style={styles.content}>
          <View style={styles.attributionBadge}>
            <Text style={styles.attributionText}>{en.sponsored || 'Sponsored'}</Text>
          </View>

          <View style={styles.headerRow}>
            {nativeAd.icon ? (
              <NativeAsset assetType={NativeAssetType.ICON}>
                <Image source={{ uri: nativeAd.icon.url }} style={styles.icon} />
              </NativeAsset>
            ) : null}

            <View style={styles.headerText}>
              <NativeAsset assetType={NativeAssetType.HEADLINE}>
                <Text style={styles.headline} numberOfLines={2}>
                  {nativeAd.headline}
                </Text>
              </NativeAsset>

              {nativeAd.advertiser ? (
                <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                  <Text style={styles.advertiser} numberOfLines={1}>
                    {nativeAd.advertiser}
                  </Text>
                </NativeAsset>
              ) : null}
            </View>
          </View>

          <View style={styles.mediaWrap}>
            <NativeMediaView style={styles.media} resizeMode="cover" />
          </View>

          {nativeAd.body ? (
            <NativeAsset assetType={NativeAssetType.BODY}>
              <Text style={styles.body} numberOfLines={3}>
                {nativeAd.body}
              </Text>
            </NativeAsset>
          ) : null}

          {hasRating || hasPriceOrStore ? (
            <View style={styles.metaRow}>
              {hasRating ? (
                <NativeAsset assetType={NativeAssetType.STAR_RATING}>
                  <Text style={styles.metaText}>
                    {'\u2605'} {nativeAd.starRating.toFixed(1)}
                  </Text>
                </NativeAsset>
              ) : null}

              {nativeAd.store ? (
                <NativeAsset assetType={NativeAssetType.STORE}>
                  <Text style={styles.metaText} numberOfLines={1}>
                    {nativeAd.store}
                  </Text>
                </NativeAsset>
              ) : null}

              {nativeAd.price ? (
                <NativeAsset assetType={NativeAssetType.PRICE}>
                  <Text style={styles.metaText} numberOfLines={1}>
                    {nativeAd.price}
                  </Text>
                </NativeAsset>
              ) : null}
            </View>
          ) : null}

          {nativeAd.callToAction ? (
            <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
              <View style={styles.ctaButton}>
                <Text style={styles.ctaText} numberOfLines={1}>
                  {nativeAd.callToAction}
                </Text>
              </View>
            </NativeAsset>
          ) : null}
        </View>
      </NativeAdView>
    </View>
  );
};

export default NativeAdCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: wp(5),
    backgroundColor: COLORS.surfaceElevated + HEX_OPACITY[60],
    borderWidth: 1,
    borderColor: COLORS.lightYellow + HEX_OPACITY[25],
    overflow: 'hidden',
  },
  adView: {
    width: '100%',
  },
  content: {
    width: '100%',
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1.5),
  },
  attributionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.lightYellow,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.25),
    borderRadius: wp(1.5),
    marginBottom: hp(1),
  },
  attributionText: {
    color: COLORS.splashBg,
    fontSize: hp(1.1),
    fontFamily: FONT.bold,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.2),
  },
  icon: {
    width: hp(5.2),
    height: hp(5.2),
    borderRadius: hp(1.4),
    marginRight: wp(2.5),
    backgroundColor: COLORS.bgPurpleDark + HEX_OPACITY[40],
  },
  headerText: {
    flex: 1,
  },
  headline: {
    color: COLORS.newwhite,
    fontSize: hp(1.85),
    fontFamily: FONT.bold,
  },
  advertiser: {
    color: COLORS.lightWhite,
    fontSize: hp(1.3),
    fontFamily: FONT.medium,
    marginTop: hp(0.25),
    opacity: 0.85,
  },
  mediaWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(3.5),
    overflow: 'hidden',
    backgroundColor: COLORS.bgPurpleDark + HEX_OPACITY[35],
  },
  media: {
    width: '100%',
    height: MEDIA_HEIGHT,
    minWidth: 160,
    minHeight: 160,
    alignSelf: 'center',
  },
  body: {
    color: COLORS.lightWhite,
    fontSize: hp(1.45),
    fontFamily: FONT.medium,
    marginTop: hp(1),
    opacity: 0.9,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: wp(3),
    marginTop: hp(1),
  },
  metaText: {
    color: COLORS.lightYellow,
    fontSize: hp(1.3),
    fontFamily: FONT.bold,
  },
  ctaButton: {
    marginTop: hp(1.3),
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightYellow,
    paddingVertical: hp(1),
    borderRadius: wp(3),
  },
  ctaText: {
    color: COLORS.splashBg,
    fontSize: hp(1.6),
    fontFamily: FONT.bold,
    letterSpacing: 0.3,
  },
});
