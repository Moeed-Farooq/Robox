const USE_PRODUCTION_ADS = true;

const PRODUCTION_AD_IDS = {
  appIdAndroid: 'ca-app-pub-6091683149476586~1820232130',
  appIdIOS: 'ca-app-pub-6091683149476586~1820232130',
  banner: 'ca-app-pub-6091683149476586/5283804159',
  rewarded: 'ca-app-pub-6091683149476586/1567920427',
  interstitial: 'ca-app-pub-6091683149476586/5774758745',
  nativeAdvanced: 'ca-app-pub-6091683149476586/7342423067',
  appOpen: 'ca-app-pub-6091683149476586/7418444680',
};

const TEST_AD_IDS = {
  appIdAndroid: 'ca-app-pub-3940256099942544~3347511713',
  appIdIOS: 'ca-app-pub-3940256099942544~1458002511',
  banner: 'ca-app-pub-3940256099942544/6300978111',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
};

const ACTIVE_AD_IDS = USE_PRODUCTION_ADS ? PRODUCTION_AD_IDS : TEST_AD_IDS;

export const getAdUnitId = adType => ACTIVE_AD_IDS[adType] || '';

export const getAdsAppId = platform => {
  if (platform === 'ios') {
    return ACTIVE_AD_IDS.appIdIOS;
  }

  return ACTIVE_AD_IDS.appIdAndroid;
};

export { USE_PRODUCTION_ADS, PRODUCTION_AD_IDS, TEST_AD_IDS };
