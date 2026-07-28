import {
  PERKOX_API_KEY,
  PERKOX_APP_ID,
  PERKOX_OFFERS_URL,
  PERKOX_SDK_ID,
  PERKOX_WEB_OFFERWALL_URL,
} from '@env';

export const PERKOX_CONFIG = {
  APP_ID: PERKOX_APP_ID,
  SDK_ID: PERKOX_SDK_ID,
  API_KEY: PERKOX_API_KEY,
  OFFERS_URL: PERKOX_OFFERS_URL || 'https://api.perkox.com/offerwall/api/offers',
  WEB_OFFERWALL_URL: PERKOX_WEB_OFFERWALL_URL || 'https://perkwall.com',
};
