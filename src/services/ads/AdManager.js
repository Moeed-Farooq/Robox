import mobileAds from 'react-native-google-mobile-ads';
import { preloadRewardedAd } from './RewardedService';
import { preloadInterstitialAd } from './InterstitialService';

let initializationPromise = null;

export const initializeAds = async () => {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      await mobileAds().initialize();
    } catch (error) {
      console.warn('Google Mobile Ads SDK initialization failed:', error?.message || error);
    }

    preloadRewardedAd();
    preloadInterstitialAd();

    return true;
  })();

  return initializationPromise;
};

const AdManager = {
  initializeAds,
};

export default AdManager;
