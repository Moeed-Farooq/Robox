import { Platform } from 'react-native';

const USE_PRODUCTION_ADS = true;

const PRODUCTION_AD_IDS = {
  appIdAndroid: 'ca-app-pub-6091683149476586~1317862771',
  appIdIOS: 'ca-app-pub-6091683149476586~1820232130',
  bannerIOS: 'ca-app-pub-6091683149476586/5283804159',
  bannerAndroid: 'ca-app-pub-6091683149476586/3752454424',
  rewardedIOS: 'ca-app-pub-6091683149476586/1567920427',
  rewardedAndroid: 'ca-app-pub-6091683149476586/8954598659',
  interstitialIOS: 'ca-app-pub-6091683149476586/5774758745',
  interstitialAndroid: 'ca-app-pub-6091683149476586/9004781104',
  nativeAdvancedIOS: 'ca-app-pub-6091683149476586/7342423067',
  nativeAdvancedAndroid: 'ca-app-pub-6091683149476586/4123599877',
  appOpenIOS: 'ca-app-pub-6091683149476586/7418444680',
  appOpenAndroid: 'ca-app-pub-6091683149476586/4394494394',
};

const TEST_AD_IDS = {
  appIdAndroid: 'ca-app-pub-3940256099942544~3347511713',
  appIdIOS: 'ca-app-pub-3940256099942544~1458002511',
  bannerIOS: 'ca-app-pub-3940256099942544/6300978111',
  bannerAndroid: 'ca-app-pub-3940256099942544/6300978111',
  rewardedIOS: 'ca-app-pub-3940256099942544/5224354917',
  rewardedAndroid: 'ca-app-pub-3940256099942544/5224354917',
  interstitialIOS: 'ca-app-pub-3940256099942544/1033173712',
  interstitialAndroid: 'ca-app-pub-3940256099942544/1033173712',
  nativeAdvancedIOS: 'ca-app-pub-3940256099942544/2247696110',
  nativeAdvancedAndroid: 'ca-app-pub-3940256099942544/2247696110',
  appOpenIOS: 'ca-app-pub-3940256099942544/9257395921',
  appOpenAndroid: 'ca-app-pub-3940256099942544/9257395921',
};

const ACTIVE_AD_IDS = USE_PRODUCTION_ADS ? PRODUCTION_AD_IDS : TEST_AD_IDS;

const PLATFORM_AD_TYPES = {
  banner: {
    ios: 'bannerIOS',
    android: 'bannerAndroid',
  },
  interstitial: {
    ios: 'interstitialIOS',
    android: 'interstitialAndroid',
  },
  rewarded: {
    ios: 'rewardedIOS',
    android: 'rewardedAndroid',
  },
  nativeAdvanced: {
    ios: 'nativeAdvancedIOS',
    android: 'nativeAdvancedAndroid',
  },
  appOpen: {
    ios: 'appOpenIOS',
    android: 'appOpenAndroid',
  },
};

export const getAdUnitId = adType => {
  const platformKeys = PLATFORM_AD_TYPES[adType];

  if (platformKeys) {
    const key = Platform.OS === 'ios' ? platformKeys.ios : platformKeys.android;
    return ACTIVE_AD_IDS[key] || '';
  }

  return ACTIVE_AD_IDS[adType] || '';
};

export const getAdsAppId = platform => {
  if (platform === 'ios') {
    return ACTIVE_AD_IDS.appIdIOS;
  }

  return ACTIVE_AD_IDS.appIdAndroid;
};

export { USE_PRODUCTION_ADS, PRODUCTION_AD_IDS, TEST_AD_IDS };
