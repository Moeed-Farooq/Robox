import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';
import { getAdUnitId } from './AdConfig';
import {
  areAdsEnabled,
  initializeAdsSettings,
  isAdsConfigLoaded,
} from './AdsSettingsService';

let interstitialAd = null;
let interstitialLoaded = false;
let interstitialLoading = false;
let listenersAttached = false;
const interstitialCloseSubscribers = new Set();
const interstitialErrorSubscribers = new Set();

const notifySubscribers = subscribers => {
  subscribers.forEach(callback => {
    try {
      callback?.();
    } catch (error) {
      console.warn('Interstitial subscriber callback failed:', error?.message || error);
    }
  });

  subscribers.clear();
};

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
      notifySubscribers(interstitialErrorSubscribers);
      interstitialCloseSubscribers.clear();

      setTimeout(() => {
        preloadInterstitialAd();
      }, 15000);
    });

    interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      interstitialLoaded = false;
      interstitialLoading = false;
      notifySubscribers(interstitialCloseSubscribers);
      interstitialErrorSubscribers.clear();
      preloadInterstitialAd();
    });

    listenersAttached = true;
  }

  return interstitialAd;
};

export const preloadInterstitialAd = () => {
  if (!isAdsConfigLoaded()) {
    initializeAdsSettings().catch(() => {});
    return;
  }

  if (!areAdsEnabled()) {
    return;
  }

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

export const showInterstitialIfAvailable = options => {
  if (!isAdsConfigLoaded()) {
    initializeAdsSettings().catch(() => {});
    return false;
  }

  if (!areAdsEnabled()) {
    return false;
  }

  try {
    const ad = ensureInterstitialInstance();
    const onClosed = options?.onClosed;
    const onError = options?.onError;

    if (!interstitialLoaded) {
      preloadInterstitialAd();
      return false;
    }

    if (typeof onClosed === 'function') {
      interstitialCloseSubscribers.add(onClosed);
    }

    if (typeof onError === 'function') {
      interstitialErrorSubscribers.add(onError);
    }

    ad.show();
    return true;
  } catch (error) {
    console.warn('Interstitial ad show failed:', error?.message || error);
    if (typeof options?.onClosed === 'function') {
      interstitialCloseSubscribers.delete(options.onClosed);
    }
    if (typeof options?.onError === 'function') {
      interstitialErrorSubscribers.delete(options.onError);
    }
    options?.onError?.();
    preloadInterstitialAd();
    return false;
  }
};
