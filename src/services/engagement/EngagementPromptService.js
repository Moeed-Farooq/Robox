import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENGAGEMENT_THRESHOLDS } from '../../enums';

const STORAGE_KEYS = {
  RATE_PROMPT_SHOWN: '@robox/engagement/rate_prompt_shown',
  SHARE_PROMPT_SHOWN: '@robox/engagement/share_prompt_shown',
};

const readFlag = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value === 'true';
  } catch (error) {
    console.warn('Failed to read engagement flag:', error?.message || error);
    return false;
  }
};

const writeFlag = async key => {
  try {
    await AsyncStorage.setItem(key, 'true');
  } catch (error) {
    console.warn('Failed to write engagement flag:', error?.message || error);
  }
};

export const hasShownRatePrompt = () => readFlag(STORAGE_KEYS.RATE_PROMPT_SHOWN);

export const hasShownSharePrompt = () =>
  readFlag(STORAGE_KEYS.SHARE_PROMPT_SHOWN);

export const markRatePromptShown = () => writeFlag(STORAGE_KEYS.RATE_PROMPT_SHOWN);

export const markSharePromptShown = () =>
  writeFlag(STORAGE_KEYS.SHARE_PROMPT_SHOWN);

export const getNextEngagementPrompt = async totalPoints => {
  const points = Number(totalPoints) || 0;

  if (points >= ENGAGEMENT_THRESHOLDS.RATE) {
    const rateShown = await hasShownRatePrompt();
    if (!rateShown) {
      return 'rate';
    }
  }

  if (points >= ENGAGEMENT_THRESHOLDS.SHARE) {
    const shareShown = await hasShownSharePrompt();
    if (!shareShown) {
      return 'share';
    }
  }

  return null;
};
