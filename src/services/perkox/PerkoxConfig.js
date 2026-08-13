import { Platform } from 'react-native';
import {
  PERKOX_API_KEY,
  PERKOX_APP_ID,
  PERKOX_BETA,
  PERKOX_IOS_API_KEY,
  PERKOX_IOS_APP_ID,
  PERKOX_IOS_SDK_ID,
  PERKOX_OFFERS_URL,
  PERKOX_SDK_ID,
  PERKOX_WEB_OFFERWALL_URL,
} from '@env';

const isIOS = Platform.OS === 'ios';

export const PERKOX_CONFIG = {
  APP_ID: isIOS ? PERKOX_IOS_APP_ID || PERKOX_APP_ID : PERKOX_APP_ID,
  /** Maps to native SDK `sdkKey`. */
  SDK_ID: isIOS ? PERKOX_IOS_SDK_ID || PERKOX_SDK_ID : PERKOX_SDK_ID,
  API_KEY: isIOS ? PERKOX_IOS_API_KEY || PERKOX_API_KEY : PERKOX_API_KEY,
  BETA: String(PERKOX_BETA || '').toLowerCase() === 'true',
  OFFERS_URL: PERKOX_OFFERS_URL || 'https://api.perkox.com/offerwall/api/offers',
  WEB_OFFERWALL_URL: PERKOX_WEB_OFFERWALL_URL || 'https://perkwall.com',
};
