import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';
import { getAdUnitId } from './AdConfig';

let interstitialAd = null;
let interstitialLoaded = false;
let interstitialLoading = false;
let listenersAttached = false;

const createInterstitialAd = () =>
  InterstitialAd.createForAdRequest(getAdUnitId('interstitial'), {
    requestNonPersonalizedAdsOnly: true,
  });

const ensureInterstitialInstance = () => {
  if (!interstitialAd) {
    interstitialAd = createInterstitialAd();
    listenersAttached = false;
  }

  if (!listenersAttached) {
    interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      interstitialLoaded = true;
      interstitialLoading = false;
    });

    interstitialAd.addAdEventListener(AdEventType.ERROR, error => {
      interstitialLoaded = false;
      interstitialLoading = false;
      console.warn('Interstitial ad error:', error?.message || error);

      setTimeout(() => {
        preloadInterstitialAd();
      }, 15000);
    });

    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      interstitialLoaded = false;
      interstitialLoading = false;
      preloadInterstitialAd();
    });

    listenersAttached = true;
  }

  return interstitialAd;
};

export const preloadInterstitialAd = () => {
  if (interstitialLoaded || interstitialLoading) {
    return;
  }

  const ad = ensureInterstitialInstance();

  interstitialLoading = true;
  interstitialLoaded = false;

  try {
    ad.load();
  } catch (error) {
    interstitialLoading = false;
    interstitialLoaded = false;
    console.warn('Interstitial ad preload failed:', error?.message || error);
  }
};

export const isInterstitialAdReady = () => interstitialLoaded;

export const showInterstitialIfAvailable = () => {
  try {
    const ad = ensureInterstitialInstance();

    if (!interstitialLoaded) {
      preloadInterstitialAd();
      return false;
    }

    ad.show();
    return true;
  } catch (error) {
    console.warn('Interstitial ad show failed:', error?.message || error);
    preloadInterstitialAd();
    return false;
  }
};
