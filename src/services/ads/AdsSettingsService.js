import firestore from '@react-native-firebase/firestore';
import { ADS, FIREBASE_COLLECTIONS } from '../../enums';

let adsEnabled = null;
let adsSettingsPromise = null;

export const initializeAdsSettings = async () => {
  if (adsSettingsPromise) {
    return adsSettingsPromise;
  }

  adsSettingsPromise = (async () => {
    try {
      const snapshot = await firestore()
        .collection(FIREBASE_COLLECTIONS.ADS_COLLECTION)
        .doc(ADS.ADS_DOCUMENT)
        .get();

      const remoteValue = snapshot.data()?.[ADS.ADS_FIELD];

      if (typeof remoteValue === 'boolean') {
        adsEnabled = remoteValue;
      } else {
        // Fail-open when config is missing/malformed to preserve app behavior.
        adsEnabled = true;
        console.warn(
          'Ads config is missing or invalid. Falling back to ads enabled.',
        );
      }
    } catch (error) {
      // Fail-open on network/config read issues while avoiding app crashes.
      adsEnabled = true;
      console.warn(
        'Failed to load ads config from Firestore:',
        error?.message || error,
      );
    }

    return adsEnabled;
  })();

  return adsSettingsPromise;
};

export const areAdsEnabled = () => adsEnabled === true;

export const isAdsConfigLoaded = () => adsEnabled !== null;
