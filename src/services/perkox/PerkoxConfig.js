import {
  PERKOX_API_KEY,
  PERKOX_APP_ID,
  PERKOX_BETA,
  PERKOX_OFFERS_URL,
  PERKOX_SDK_ID,
  PERKOX_WEB_OFFERWALL_URL,
} from '@env';

export const PERKOX_CONFIG = {
  APP_ID: PERKOX_APP_ID,
  /** Maps to native SDK `sdkKey`. */
  SDK_ID: PERKOX_SDK_ID,
  API_KEY: PERKOX_API_KEY,
  BETA: String(PERKOX_BETA || '').toLowerCase() === 'true',
  OFFERS_URL: PERKOX_OFFERS_URL || 'https://api.perkox.com/offerwall/api/offers',
  WEB_OFFERWALL_URL: PERKOX_WEB_OFFERWALL_URL || 'https://perkwall.com',
};
